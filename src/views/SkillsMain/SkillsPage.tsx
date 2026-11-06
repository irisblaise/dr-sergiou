'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import neuron from '../../../public/assets/skills/neuron-six-arms-transparent-highres.webp'
import type { Skill, SkillKey } from '../../data/types'
import type { PageContent } from '../../sanity/lib/queries'
import { resolvePageIntro } from '../../lib/pageIntro'
import { sanityLoaderFor } from '../../lib/sanityImageLoader'
import PageIntro from '../../components/ui/PageIntro/PageIntro'
import styles from './SkillsPage.module.scss'

// Design-space stage — matches Skills · Map the Network.dc.html (design handoff).
const STAGE_W = 1600
const STAGE_H = 1040

// Placement of the artwork's own 1000×1000 space within the stage. The traced
// arm paths below are authored in that 1000×1000 space, so this transform is
// what makes them land exactly on top of the artwork's own tracks.
const OX = 525
const OY = 165
const SC = 0.75

type ArmDef = {
    key: SkillKey
    captionSide: 'l' | 'r' | 'c'
    vias: number[]
    d: string
}

// Traced pixel-by-pixel from neuron-six-arms-transparent-highres.webp (1000×1000
// artwork space), soma-first so the live track always grows outward from the
// cell body. Re-trace from the artwork if it's ever replaced — see arms.json
// in the design handoff.
const ARMS: ArmDef[] = [
    {
        key: 'neuro',
        captionSide: 'c',
        vias: [0.3, 0.56, 0.8],
        d: 'M343.7 333.3 L339.3 297 L318.2 281.9 L314.2 272.3 L289.1 252.8 L272.3 250.8 L264.8 242.4 L250.4 238.4 L221.7 236.8 L204.9 222.5 L194.2 203.7 L176.2 196.2 L108.5 196.6',
    },
    {
        key: 'coding',
        captionSide: 'r',
        vias: [0.3, 0.56, 0.8],
        d: 'M653.5 333.7 L661.9 296.7 L715.7 254 L734.1 252.4 L749.6 246 L778.3 244.4 L795.1 229.3 L807.4 205.3 L820.6 199 L875.6 196.6 L899.9 193.4',
    },
    {
        key: 'vr',
        captionSide: 'r',
        vias: [0.3, 0.8],
        d: 'M795.1 480.5 L801.8 476.5 L812.6 484.4 L858.1 482.1 L876 469.3 L897.5 469.3 L911.9 476.5 L959.5 476.6',
    },
    {
        key: 'music',
        captionSide: 'r',
        vias: [0.3, 0.56, 0.8],
        d: 'M773.5 662.7 L777.9 707.7 L796.3 731.3 L818.2 744.4 L826.6 756.4 L848.5 758.8 L870 775.1 L876.4 790.7 L877.6 823.4 L888 840.1 L895.9 863.6',
    },
    {
        key: 'behavior',
        captionSide: 'l',
        vias: [0.3, 0.56, 0.8],
        d: 'M240.4 670.3 L240.4 686.2 L234.4 703.3 L218.5 725.7 L171.9 756.4 L151.9 757.6 L127.6 773.9 L118 793.5 L116.8 824.6 L102.5 863.2',
    },
    {
        key: 'forensic',
        captionSide: 'l',
        vias: [0.3, 0.56, 0.8],
        d: 'M195.4 464.1 L186.6 460.5 L172.2 474.9 L146.3 476.5 L138.4 471.7 L124 471.3 L118.4 477.7 L44.7 474.5',
    },
]

type Pt = [number, number]

function parsePolyline(d: string): Pt[] {
    return d
        .split(/[ML]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.split(/\s+/).map(Number) as Pt)
}

function polylineLength(pts: Pt[]): number {
    let len = 0
    for (let i = 1; i < pts.length; i++) {
        len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    }
    return len
}

// SVG geometry only needs sub-pixel precision, and rounding here makes the
// server- and client-rendered markup byte-identical — Math.hypot's last bit
// isn't guaranteed to match across JS engines, so an unrounded value can
// differ between SSR and the browser and trip a hydration mismatch.
function round(n: number): number {
    return Math.round(n * 10000) / 10000
}

// Reproduces SVGPathElement.getPointAtLength for a plain polyline, without
// needing a real DOM node — the traced arms are all M/L segments, so this is
// exact, not an approximation.
function pointAtFraction(pts: Pt[], f: number): Pt {
    const target = polylineLength(pts) * f
    let acc = 0
    for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1]
        const [x1, y1] = pts[i]
        const segLen = Math.hypot(x1 - x0, y1 - y0)
        if (acc + segLen >= target) {
            const t = segLen === 0 ? 0 : (target - acc) / segLen
            return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]
        }
        acc += segLen
    }
    return pts[pts.length - 1]
}

type ArmLayout = ArmDef & {
    viaPoints: Pt[]
    end: Pt
    length: number
    medallion: { left: number; top: number }
    caption: { left: number; top: number; align: 'left' | 'right' }
}

// Node image slot (medallion) sits 50px along the arm's outgoing direction
// from its terminal node; the caption anchor is 76px along the same line —
// both in stage px, so the terminal node always sits on the medallion's rim.
function layoutArm(arm: ArmDef): ArmLayout {
    const pts = parsePolyline(arm.d)
    const end = pts[pts.length - 1]
    const prev = pts[pts.length - 2]
    const dx = end[0] - prev[0]
    const dy = end[1] - prev[1]
    const dl = Math.hypot(dx, dy) || 1
    const ux = dx / dl
    const uy = dy / dl
    const ex = OX + end[0] * SC
    const ey = OY + end[1] * SC
    const cx0 = ex + ux * 76
    const cy0 = ey + uy * 76

    const caption: ArmLayout['caption'] =
        arm.captionSide === 'r'
            ? { left: round(cx0 + 76), top: round(cy0 - 40), align: 'left' }
            : arm.captionSide === 'l'
              ? { left: round(cx0 - 76 - 200), top: round(cy0 - 40), align: 'right' }
              : { left: round(ex + 28), top: round(ey - 92), align: 'left' }

    return {
        ...arm,
        viaPoints: arm.vias.map((f) => pointAtFraction(pts, f).map(round) as Pt),
        end: [round(end[0]), round(end[1])],
        length: round(polylineLength(pts)),
        medallion: { left: round(ex + ux * 50), top: round(ey + uy * 50) },
        caption,
    }
}

const ARM_LAYOUT: ArmLayout[] = ARMS.map(layoutArm)

// Introduces its own behaviour on load, per the handoff.
const DEFAULT_ACTIVE: SkillKey = 'vr'

// The source illustrations (300×300) aren't drawn centred within their own
// canvas — each has a hand-sketched circle + subject sitting a few px off
// from the frame centre, with a soft margin around it. Zooming in slightly
// (130px source rendered into the 108px slot) crops that margin away, and
// the per-key nudge re-centres the subject within the medallion.
const MEDALLION_FRAME: Record<SkillKey, { size: number; x: number; y: number }> = {
    neuro: { size: 130, x: -4, y: 1 },
    coding: { size: 130, x: -2, y: -1 },
    forensic: { size: 130, x: -8, y: 3 },
    vr: { size: 130, x: -1, y: 2 },
    behavior: { size: 130, x: -2, y: -2 },
    music: { size: 130, x: 0, y: -4 },
}

const DESKTOP_MEDALLION_SLOT = 108
const MOBILE_NODE_SLOT = 56

// The mobile timeline node is the same 56px circle for every skill, so the
// desktop recentring above (tuned for the 108px medallion slot) is reused
// here, scaled down proportionally to that smaller slot.
function mobileMedallionFrame(key: SkillKey) {
    const scale = MOBILE_NODE_SLOT / DESKTOP_MEDALLION_SLOT
    const frame = MEDALLION_FRAME[key]
    return { size: frame.size * scale, x: frame.x * scale, y: frame.y * scale }
}

export default function SkillsPage({
    skills,
    pageContent,
}: {
    skills: Skill[]
    pageContent?: PageContent | null
}) {
    const [active, setActive] = useState<SkillKey | null>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const { heading, eyebrow, paragraphs: introParagraphs } = resolvePageIntro(pageContent, {
        heading: 'Skills',
        eyebrow: 'MAP THE NETWORK',
        intro: [
            'Expertise across neuroscience, technology, and human behavior — branches of one connected network, applied to questions of justice and society.',
        ],
    })

    const byKey = new Map(skills.map((s) => [s.key, s]))

    // Only one branch is active at a time; re-entering the same key is a
    // no-op, and there's no deactivate-on-leave — the page is never dead.
    const activate = useCallback((key: SkillKey) => {
        setActive((prev) => (prev === key ? prev : key))
    }, [])

    useEffect(() => {
        const t = setTimeout(() => activate(DEFAULT_ACTIVE), 700)
        return () => clearTimeout(t)
    }, [activate])

    // Contain-fit the design-space stage within whatever area is available,
    // centred both ways — matches the live Skills page's radial map.
    const fit = useCallback(() => {
        const wrap = wrapRef.current
        const stage = stageRef.current
        if (!wrap || !stage) return
        const vw = wrap.clientWidth
        const vh = wrap.clientHeight
        if (vw < 1 || vh < 1) return
        const s = Math.min(1, (vw - 24) / STAGE_W, (vh - 24) / STAGE_H)
        const tx = Math.max(0, (vw - STAGE_W * s) / 2)
        const ty = Math.max(0, (vh - STAGE_H * s) / 2)
        stage.style.transformOrigin = 'top left'
        stage.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
    }, [])

    useEffect(() => {
        fit()
        let raf = 0
        const onResize = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(fit)
        }
        window.addEventListener('resize', onResize)
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
        if (ro && wrapRef.current) ro.observe(wrapRef.current)
        return () => {
            window.removeEventListener('resize', onResize)
            ro?.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [fit])

    return (
        <div className={styles.page}>
            <div className={styles.intro}>
                <PageIntro
                    heading={heading}
                    eyebrow={eyebrow}
                    paragraphs={introParagraphs}
                    headingClassName={styles.heading}
                    eyebrowClassName={styles.eyebrow}
                    paragraphClassName={styles.paragraph}
                />
            </div>

            {/* ---------- Desktop: neuron network stage ---------- */}
            <div className={styles.stageWrap} ref={wrapRef}>
                <div
                    className={`${styles.stage} ${active ? styles.stageActive : ''}`}
                    ref={stageRef}
                    style={{ width: STAGE_W, height: STAGE_H }}
                >
                    <div className={styles.hint}>HOVER A BRANCH</div>
                    <div className={styles.aura} aria-hidden />

                    <div className={styles.cell} aria-hidden>
                        <Image
                            src={neuron}
                            alt=""
                            width={1000}
                            height={1000}
                            // .cell renders it at 750px (before any stage scaling)
                            sizes="750px"
                            className={styles.cellImg}
                            preload
                        />
                    </div>

                    <svg className={styles.net} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
                        {/* Explicit SVG <filter>s, not the CSS drop-shadow()
                            in SkillsPage.module.scss's .live/.via.on rules —
                            Safari clips a CSS filter's default region to
                            roughly the shape's own bounding box + 10%, so a
                            6px glow on these thin/small shapes silently
                            disappears there (Chrome doesn't clip the same
                            way). See ProjectsPage.tsx for the fuller writeup. */}
                        <defs>
                            <filter
                                id="skills-live-glow"
                                colorInterpolationFilters="sRGB"
                                x="-300%"
                                y="-300%"
                                width="700%"
                                height="700%"
                            >
                                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="rgba(var(--accent-glow), 0.55)" />
                            </filter>
                            <filter
                                id="skills-via-glow"
                                colorInterpolationFilters="sRGB"
                                x="-500%"
                                y="-500%"
                                width="1100%"
                                height="1100%"
                            >
                                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(var(--accent-glow), 0.6)" />
                            </filter>
                        </defs>
                        <g transform={`translate(${OX},${OY}) scale(${SC})`}>
                            {ARM_LAYOUT.map((arm) => {
                                const on = arm.key === active
                                const [ex, ey] = arm.end
                                const cls = (base: string) => `${base}${on ? ` ${styles.on}` : ''}`
                                return (
                                    <g key={arm.key} onPointerEnter={() => activate(arm.key)}>
                                        <circle cx={ex} cy={ey} r={19} className={cls(styles.ringHalo)} />
                                        <circle cx={ex} cy={ey} r={16} className={styles.nodePad} />
                                        {arm.viaPoints.map(([vx, vy], i) => (
                                            <circle key={i} cx={vx} cy={vy} r={4.4} className={cls(styles.via)} />
                                        ))}
                                        <g className={`${styles.term} ${on ? styles.termOn : ''}`}>
                                            <circle cx={ex} cy={ey} r={17} className={styles.ringP} />
                                            <circle cx={ex} cy={ey} r={12.4} className={styles.ringO} />
                                            <circle cx={ex} cy={ey} r={5.4} className={styles.ringI} />
                                        </g>
                                        <path
                                            d={arm.d}
                                            className={cls(styles.live)}
                                            style={{ '--len': arm.length } as React.CSSProperties}
                                        />
                                        <path
                                            d={arm.d}
                                            className={cls(styles.spark)}
                                            style={{ '--len': arm.length } as React.CSSProperties}
                                        />
                                        <path d={arm.d} className={styles.hit} />
                                        <circle cx={ex} cy={ey} r={26} className={styles.dot} />
                                    </g>
                                )
                            })}
                        </g>
                    </svg>

                    {ARM_LAYOUT.map((arm) => {
                        const skill = byKey.get(arm.key)
                        if (!skill) return null
                        const on = arm.key === active
                        const frame = MEDALLION_FRAME[arm.key]
                        return (
                            <button
                                key={arm.key}
                                type="button"
                                className={`${styles.med} ${on ? styles.medOn : ''}`}
                                style={{ left: arm.medallion.left, top: arm.medallion.top }}
                                onMouseEnter={() => activate(arm.key)}
                                onFocus={() => activate(arm.key)}
                                aria-label={`${skill.label} — ${skill.detail}`}
                            >
                                <Image
                                    src={skill.image}
                                    loader={sanityLoaderFor(skill.image)}
                                    alt=""
                                    width={frame.size}
                                    height={frame.size}
                                    sizes={`${frame.size}px`}
                                    className={styles.medImg}
                                    style={{
                                        left: `calc(50% + ${frame.x}px)`,
                                        top: `calc(50% + ${frame.y}px)`,
                                    }}
                                />
                            </button>
                        )
                    })}

                    {ARM_LAYOUT.map((arm) => {
                        const skill = byKey.get(arm.key)
                        if (!skill) return null
                        const on = arm.key === active
                        return (
                            <button
                                key={arm.key}
                                type="button"
                                className={`${styles.cap} ${on ? styles.capOn : ''}`}
                                style={{ left: arm.caption.left, top: arm.caption.top, textAlign: arm.caption.align }}
                                onMouseEnter={() => activate(arm.key)}
                                onFocus={() => activate(arm.key)}
                            >
                                <b>{skill.label}</b>
                                <span>{skill.detail}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ---------- Mobile: intro + vertical list ----------
                Not specced by the handoff (network diagrams don't reflow); this
                reuses the live Skills page's stacked-timeline treatment. */}
            <div className={styles.mobile}>
                <header className={styles.mHeader}>
                    <PageIntro
                        heading={heading}
                        eyebrow={eyebrow}
                        paragraphs={introParagraphs}
                        headingClassName={styles.mHeading}
                        eyebrowClassName={styles.eyebrow}
                        paragraphClassName={styles.mParagraph}
                    />
                </header>

                <div className={styles.timeline}>
                    <span className={styles.timelineLine} aria-hidden />
                    {ARM_LAYOUT.map((arm, i) => {
                        const skill = byKey.get(arm.key)
                        if (!skill) return null
                        const frame = mobileMedallionFrame(arm.key)
                        return (
                            <div
                                key={arm.key}
                                className={`${styles.row} ${i === ARM_LAYOUT.length - 1 ? styles.rowLast : ''}`}
                            >
                                <span className={styles.mNode}>
                                    <Image
                                        src={skill.image}
                                        loader={sanityLoaderFor(skill.image)}
                                        alt=""
                                        width={frame.size}
                                        height={frame.size}
                                        sizes={`${frame.size}px`}
                                        className={styles.mImg}
                                        style={{
                                            left: `calc(50% + ${frame.x}px)`,
                                            top: `calc(50% + ${frame.y}px)`,
                                        }}
                                    />
                                </span>
                                <span className={styles.mText}>
                                    <span className={styles.mLabel}>{skill.label}</span>
                                    <span className={styles.mDetail}>{skill.detail}</span>
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
