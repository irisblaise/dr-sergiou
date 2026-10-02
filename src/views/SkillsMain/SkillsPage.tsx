'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import type { Skill, SkillKey } from '../../data/types'
import type { PageContent } from '../../sanity/lib/queries'
import { resolvePageIntro } from '../../lib/pageIntro'
import { useMatchMedia } from '../../lib/useMatchMedia'
import { MOBILE_QUERY } from '../../styles/breakpoints'
import PageIntro from '../../components/ui/PageIntro/PageIntro'
import ArrowLink from '../../components/ui/ArrowLink/ArrowLink'
import TeaserPopover, { TEASER_PANEL_ID } from '../../components/BrainTeasers/TeaserPopover'
import { hasTeaserComponent } from '../../components/BrainTeasers/teasers/registry'
import { TEASER_ORDER, networkMappedLine, teasers, type Teaser } from '../../content/teasers'
import { ARM_LAYOUT, STAGE_H, STAGE_W, OX, OY, SC } from './neuronGeometry'
import { REDUCED_MOTION_QUERY } from '../../lib/prefersReducedMotion'

// The firing layer (and Framer Motion with it) only loads once a branch has
// been solved — nothing teaser-related weighs on the page's first load.
const NeuronFiring = dynamic(() => import('./NeuronFiring'), { ssr: false })
import styles from './SkillsPage.module.scss'

// A skill gets a teaser by its stable key (Skill.key ↔ Teaser.branch), never
// its display title — renaming a skill in Sanity can't break the mapping.
// An arm whose teaser isn't built yet renders exactly as before.
function teaserFor(key: SkillKey): Teaser | null {
    const t = teasers[key]
    return hasTeaserComponent(t) ? t : null
}

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

// Teaser popover width + leader line + edge padding, and the most the stage
// may pan to fit it before the popover is left to flip instead.
const POPOVER_ROOM = 400 + 36 + 20
const MAX_PAN = 280
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

    // ---------- Brain teasers ----------
    const reduced = useMatchMedia(REDUCED_MOTION_QUERY)
    const isMobile = useMatchMedia(MOBILE_QUERY)
    const [openKey, setOpenKey] = useState<SkillKey | null>(null)
    const [solved, setSolved] = useState<ReadonlySet<SkillKey>>(() => new Set())
    const [pulses, setPulses] = useState<Partial<Record<SkillKey, number>>>({})
    const [fireCount, setFireCount] = useState(0)
    const [beat, setBeat] = useState(0)
    const returnFocusRef = useRef<HTMLElement | null>(null)
    const mFigureRef = useRef<HTMLDivElement>(null)
    const medRefs = useRef(new Map<SkillKey, HTMLButtonElement>())
    // Sideways pan (screen px) that makes room for the popover on the arm's
    // outward side when the viewport is too narrow for it — otherwise it
    // would flip inward and cover the very branch that's about to fire.
    const panRef = useRef(0)

    // Arms that can fire: the skill exists in Sanity and its teaser is built.
    // "All six" means all of these — so the full-network state is reachable
    // (and reviewable) before the last teasers land in build steps 4–5.
    const teaserKeys = ARM_LAYOUT.map((a) => a.key).filter((k) => byKey.has(k) && teaserFor(k))
    const allSolved = teaserKeys.length > 0 && teaserKeys.every((k) => solved.has(k))
    const openTeaser = openKey ? teaserFor(openKey) : null
    const openArm = ARM_LAYOUT.find((a) => a.key === openKey)

    // Opening another arm while the panel is open swaps the teaser in place
    // (TeaserPanel keys the game by branch, so the unsolved one resets).
    const openArmTeaser = (key: SkillKey, trigger: HTMLElement) => {
        if (!teaserFor(key)) return
        returnFocusRef.current = trigger
        activate(key)
        setOpenKey(key)
        if (!isMobile) panToFit(key)
        // Mobile: bring the neuron into the top half, above the sheet, so
        // the firing animation is actually seen.
        if (isMobile) {
            mFigureRef.current?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })
        }
    }

    const closeTeaser = () => {
        setOpenKey(null)
        setPan(0)
        const el = returnFocusRef.current
        requestAnimationFrame(() => el?.focus({ preventScroll: true }))
    }

    const markSolved = () => {
        const key = openKey
        if (!key || solved.has(key)) return
        const next = new Set(solved).add(key)
        setSolved(next)
        setPulses((p) => ({ ...p, [key]: (p[key] ?? 0) + 1 }))
        if (teaserKeys.every((k) => next.has(k))) setFireCount((n) => n + 1)
    }

    // Wait for the drop: the cell body pulses on the beat.
    const pulseOnBeat = useCallback(() => setBeat((n) => n + 1), [])

    const armTriggerProps = (key: SkillKey) =>
        teaserFor(key)
            ? {
                  'aria-haspopup': 'dialog' as const,
                  'aria-expanded': openKey === key,
                  'aria-controls': openKey === key ? TEASER_PANEL_ID : undefined,
                  onClick: (e: React.MouseEvent<HTMLElement>) => openArmTeaser(key, e.currentTarget),
              }
            : {}

    const firing = (solved.size > 0 || beat > 0) && (
        <NeuronFiring
            solved={solved}
            pulses={pulses}
            fireCount={fireCount}
            allSolved={allSolved}
            beat={beat}
            reduced={reduced}
        />
    )

    const closingLine = (
        <p className={styles.mapped} role="status">
            {allSolved && <span className={styles.mappedIn}>{networkMappedLine}</span>}
        </p>
    )

    // Contain-fit the design-space stage within whatever area is available,
    // centred both ways — matches the live Skills page's radial map. A teaser
    // popover can add a sideways pan on top (see panToFit).
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
        stage.style.transform = `translate(${tx + panRef.current}px, ${ty}px) scale(${s})`
    }, [])

    const setPan = (px: number) => {
        if (px === panRef.current) return
        const stage = stageRef.current
        panRef.current = px
        // Only the pan eases — resizes and the initial fit stay instant.
        if (stage && !reduced) {
            stage.classList.add(styles.stagePanning)
            window.setTimeout(() => stage.classList.remove(styles.stagePanning), 700)
        }
        fit()
    }

    const panToFit = (key: SkillKey) => {
        const med = medRefs.current.get(key)
        const arm = ARM_LAYOUT.find((a) => a.key === key)
        if (!med || !arm) return
        const r = med.getBoundingClientRect()
        const unpanned = panRef.current
        const need = POPOVER_ROOM
        let px = 0
        if (arm.side === 'right') px = Math.min(0, window.innerWidth - (r.right - unpanned) - need)
        else px = Math.max(0, need - (r.left - unpanned))
        setPan(Math.max(-MAX_PAN, Math.min(MAX_PAN, px)))
    }

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
                    {/* Hover still lights a branch on desktop; "tap" reads right for mouse and touch alike. */}
                    <div className={styles.hint}>TAP A BRANCH</div>
                    <div className={styles.stageMapped}>{closingLine}</div>
                    <div className={styles.aura} aria-hidden />

                    <div className={styles.cell} aria-hidden>
                        <Image
                            src="/assets/skills/neuron-six-arms-transparent-highres.webp"
                            alt=""
                            width={1000}
                            height={1000}
                            className={styles.cellImg}
                            priority
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
                                        <path
                                            d={arm.d}
                                            className={styles.hit}
                                            onClick={() => {
                                                const med = medRefs.current.get(arm.key)
                                                if (med) openArmTeaser(arm.key, med)
                                            }}
                                        />
                                        <circle cx={ex} cy={ey} r={26} className={styles.dot} />
                                    </g>
                                )
                            })}
                            {firing}
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
                                ref={(el) => {
                                    if (el) medRefs.current.set(arm.key, el)
                                    else medRefs.current.delete(arm.key)
                                }}
                                className={`${styles.med} ${on ? styles.medOn : ''} ${
                                    solved.has(arm.key) ? styles.medSolved : ''
                                }`}
                                style={{ left: arm.medallion.left, top: arm.medallion.top }}
                                onMouseEnter={() => activate(arm.key)}
                                onFocus={() => activate(arm.key)}
                                aria-label={`${skill.label} — ${skill.detail}${
                                    teaserFor(arm.key) ? `. Brain teaser${solved.has(arm.key) ? ', solved' : ''}` : ''
                                }`}
                                {...armTriggerProps(arm.key)}
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
                                onClick={() => {
                                    const med = medRefs.current.get(arm.key)
                                    if (med) openArmTeaser(arm.key, med)
                                }}
                                // The medallion is the arm's one keyboard stop and
                                // carries the same label + detail.
                                tabIndex={-1}
                                aria-hidden
                            >
                                <b>{skill.label}</b>
                                <span>{skill.detail}</span>
                            </button>
                        )
                    })}

                    <TeaserPopover
                        teaser={openTeaser}
                        index={openKey ? TEASER_ORDER.indexOf(openKey) + 1 : 0}
                        total={TEASER_ORDER.length}
                        label={(openKey && byKey.get(openKey)?.label) || ''}
                        anchor={
                            openArm && !isMobile
                                ? {
                                      left: openArm.medallion.left,
                                      top: openArm.medallion.top,
                                      size: DESKTOP_MEDALLION_SLOT,
                                      side: openArm.side,
                                  }
                                : null
                        }
                        mobile={isMobile}
                        onClose={closeTeaser}
                        onSolved={markSolved}
                        onPulse={pulseOnBeat}
                    />
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

                {/* Compact neuron — the teasers' sheet takes the bottom half of
                    the screen, and this keeps the firing visible above it. */}
                {teaserKeys.length > 0 && (
                    <div className={styles.mFigure} ref={mFigureRef}>
                        <Image
                            src="/assets/skills/neuron-six-arms-transparent-highres.webp"
                            alt=""
                            width={1000}
                            height={1000}
                            sizes="(max-width: 900px) 90vw, 1px"
                            className={styles.mFigureImg}
                        />
                        <svg className={styles.mFigureNet} viewBox="0 0 1000 1000" aria-hidden>
                            {firing}
                        </svg>
                        {ARM_LAYOUT.map((arm) => {
                            const skill = byKey.get(arm.key)
                            if (!skill || !teaserFor(arm.key)) return null
                            return (
                                <button
                                    key={arm.key}
                                    type="button"
                                    className={`${styles.mTip} ${solved.has(arm.key) ? styles.mTipSolved : ''}`}
                                    style={{ left: `${arm.end[0] / 10}%`, top: `${arm.end[1] / 10}%` }}
                                    aria-label={`${skill.label} brain teaser${solved.has(arm.key) ? ', solved' : ''}`}
                                    {...armTriggerProps(arm.key)}
                                />
                            )
                        })}
                        <span className={styles.mHint}>TAP A BRANCH</span>
                        <div className={styles.mMapped}>{closingLine}</div>
                    </div>
                )}

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
                                    {teaserFor(arm.key) && (
                                        <ArrowLink
                                            className={`${styles.mPlay} ${solved.has(arm.key) ? styles.mPlaySolved : ''}`}
                                            onClick={(e) => openArmTeaser(arm.key, e.currentTarget)}
                                        >
                                            {solved.has(arm.key) ? 'FIRED · PLAY AGAIN' : 'BRAIN TEASER'}
                                        </ArrowLink>
                                    )}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
