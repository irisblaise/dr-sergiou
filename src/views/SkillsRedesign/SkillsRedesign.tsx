'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Skill, SkillKey } from '../../data/types'
import type { PageContent } from '../../sanity/lib/queries'
import styles from './SkillsRedesign.module.scss'

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

// Traced pixel-by-pixel from neuron-six-arms-transparent-highres.png (1000×1000
// artwork space), soma-first so the live track always grows outward from the
// cell body. Re-trace from the artwork if it's ever replaced — see arms.json
// in the design handoff.
const ARMS: ArmDef[] = [
    {
        key: 'neuro',
        captionSide: 'c',
        vias: [0.3, 0.56, 0.8],
        d: 'M346.1 336.5 L 340 330.4 L 340 301 L 335 296 L 288 249.5 L 269 249.5 L 257 237.5 L 232 237.5 L 201 206.5 L 191 206.5 L 184.5 200 L 177.5 200 L 174 196.6 L 108.5 196.6',
    },
    {
        key: 'coding',
        captionSide: 'r',
        vias: [0.3, 0.56, 0.8],
        d: 'M649.9 338.1 L 659.6 332.5 L 662 327.5 L 662 305.4 L 668 295.6 L 675.8 287.7 L 695.5 277.6 L 715.2 257.9 L 726.6 255.2 L 748.9 255.2 L 764.5 248.7 L 781.2 248.7 L 796.9 233 L 802.6 220.1 L 830.9 193.4 L 899.9 193.4',
    },
    {
        key: 'vr',
        captionSide: 'r',
        vias: [0.3, 0.8],
        d: 'M782.3 472.2 L 790 472.2 L 798 480 L 864 480 L 875.4 468.6 L 898 468.6 L 906 476.6 L 959.5 476.6',
    },
    {
        key: 'music',
        captionSide: 'r',
        vias: [0.3, 0.56, 0.8],
        d: 'M768.7 661.9 L 774.9 665.4 L 777.9 671.5 L 777.9 698.6 L 784.4 709.7 L 817 742.3 L 831.7 751.7 L 850.9 756 L 876.7 781.8 L 881.8 791.1 L 883.2 826.2 L 895.9 863.6',
    },
    {
        key: 'behavior',
        captionSide: 'l',
        vias: [0.3, 0.56, 0.8],
        d: 'M478.5 530.3 L 438.6 550.2 L 378.8 578.2 L 299 617.9 L 247.2 662.7 L 238 671.9 L 227.1 704.9 L 199.1 733 L 162.7 751.6 L 145.1 756 L 115.1 786 L 111.6 795.9 L 111.3 824.6 L 102.5 863.2',
    },
    {
        key: 'forensic',
        captionSide: 'l',
        vias: [0.3, 0.56, 0.8],
        d: 'M438.6 450.6 L 398.7 460.5 L 338.9 464.6 L 199.4 464.1 L 188.2 464.1 L 172.1 480.2 L 155.9 480.2 L 135.6 487.6 L 124.4 487.6 L 110.5 479.5 L 90.1 482.5 L 66.2 482.5 L 44.7 474.5',
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
            ? { left: cx0 + 76, top: cy0 - 40, align: 'left' }
            : arm.captionSide === 'l'
              ? { left: cx0 - 76 - 200, top: cy0 - 40, align: 'right' }
              : { left: ex + 28, top: ey - 92, align: 'left' }

    return {
        ...arm,
        viaPoints: arm.vias.map((f) => pointAtFraction(pts, f)),
        end: [end[0], end[1]],
        length: polylineLength(pts),
        medallion: { left: ex + ux * 50, top: ey + uy * 50 },
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

export default function SkillsRedesign({
    skills,
    pageContent,
}: {
    skills: Skill[]
    pageContent?: PageContent | null
}) {
    const [active, setActive] = useState<SkillKey | null>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const heading = pageContent?.heading ?? 'Skills'
    const eyebrow = pageContent?.eyebrow ?? 'MAP THE NETWORK'
    const introParagraphs = pageContent?.intro?.length ? pageContent.intro : [
        'Expertise across neuroscience, technology, and human behavior — branches of one connected network, applied to questions of justice and society.',
    ]

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
                <h1 className={styles.heading}>{heading}</h1>
                <div className={styles.eyebrow}>{eyebrow}</div>
                {introParagraphs.map((paragraph, index) => (
                    <p key={index} className={styles.paragraph}>
                        {paragraph}
                    </p>
                ))}
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
                            src="/assets/skills/neuron-six-arms-transparent-highres.png"
                            alt=""
                            width={1000}
                            height={1000}
                            className={styles.cellImg}
                            priority
                        />
                    </div>

                    <svg className={styles.net} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
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
                    <h1 className={styles.mHeading}>{heading}</h1>
                    <div className={styles.eyebrow}>{eyebrow}</div>
                    {introParagraphs.map((paragraph, index) => (
                        <p key={index} className={styles.mParagraph}>
                            {paragraph}
                        </p>
                    ))}
                </header>

                <div className={styles.timeline}>
                    <span className={styles.timelineLine} aria-hidden />
                    {ARM_LAYOUT.map((arm, i) => {
                        const skill = byKey.get(arm.key)
                        if (!skill) return null
                        return (
                            <div
                                key={arm.key}
                                className={`${styles.row} ${i === ARM_LAYOUT.length - 1 ? styles.rowLast : ''}`}
                            >
                                <span className={styles.mNode}>
                                    <Image src={skill.image} alt="" fill sizes="56px" />
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
