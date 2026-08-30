'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESKTOP_QUERY } from '../../styles/breakpoints'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'
import styles from './LayersOfExploration.module.scss'

const BASE_IMAGE = '/assets/homepage/head-brain-transparent.png'

type Layer = {
    number: string
    nav: string
    heading: string
    description: string
    overlaySrc: string
}

type Passion = { number?: string; title: string; description: string }

// Fallback content, and the source of each slot's `nav` tag and `overlaySrc`
// artwork — those aren't editorial copy Sanity manages, they're bound to
// this component's fixed six hand-drawn overlays. `heading`/`description`
// are overridden per slot by Sanity's homePage.passions when present (see
// buildLayers below), so this doubles as the offline/CMS-empty fallback.
const DEFAULT_LAYERS: Layer[] = [
    {
        number: '01',
        nav: 'NEUROSCIENCE',
        heading: '(Forensic) Neuroscience',
        description:
            "Oh the brain, what a majestic piece of art. It all started when I was very young and saw \"One flew over the cuckoo's nest\", to see the neurodiversity for the first time. Later on my fascination guided me towards the criminal brain. To examine how the neural correlates can shape decision-making into making criminal decisions. The crossroads of Neuroscience and the Forensic Field is where it all came together during my PhD. To unravel the neural underpinnings of aggression, emotion regulation and empathy are my main regions of fascination.",
        overlaySrc: '/assets/homepage/pink-layer-01-transparent.png',
    },
    {
        number: '02',
        nav: 'DECISION-MAKING',
        heading: 'Criminal Decision-making',
        description:
            'Since I started this journey as a young puppet, I have studied the brain of forensic samples, using different tools, in different age groups and severity, but all with one aim: understanding criminal decision-making. Previously I worked as a post-doctoral researcher within the Virtual Burglary Project at the Max Planck Institute for Crime, Security, and Law (MPI) and Leiden University, where we used Virtual Reality (VR) to study criminal decision-making in incarcerated burglars. Currently, I work within the Growing up Together in Society (GUTS) team where we investigate the biopsychosocial development of high-risk youth using functional Magnetic Resonance Imaging (fMRI).',
        overlaySrc: '/assets/homepage/pink-layer-02-transparent.png',
    },
    {
        number: '03',
        nav: 'TECHNOLOGY',
        heading: 'Innovative Technologies',
        description:
            'My fascination with innovative technologies that can improve therapy in forensic care is the common thread throughout my research trajectory. Technologies like virtual reality (VR), neuromodulation, functional Near-Infrared Spectroscopy (fNIRS), Electroencephalography (EEG), Hyperscanning, fMRI and the power of multi-modal approaches fuel my passion. Being able to study brain responses in real-time in virtual environments is the future avenue to unraveling the neural underpinnings of behavior. Recently I initiated the FORNEUROTECH network to bring these fields together.',
        overlaySrc: '/assets/homepage/pink-layer-03-transparent.png',
    },
    {
        number: '04',
        nav: 'OPEN SCIENCE',
        heading: 'The Future of Decentralized Science',
        description:
            "I'm on a mission to help revolutionize open science, to decentralize science (DeSci). Science should be available to everyone, regardless of a university affiliation. To this end, I've launched the Neuroscience NFT project, a collaboration with 3D artist Sytske Nijp and computer scientist Emanuel Boderash. Together, we're merging the digital world with the realms of science — using the brain scans of my own research studies, Sytske created 3D art.",
        overlaySrc: '/assets/homepage/pink-layer-04-transparent.png',
    },
    {
        number: '05',
        nav: 'PSYCHEDELICS',
        heading: 'Psychedelics in Mental Health Care',
        description:
            'I believe in the potential of using psychedelics in treatment, with a big emphasis on safe implementation in Dutch Mental Healthcare. When responsibly implemented, these treatments can be game-changers and keys to a better future. I co-created a report on using ketamine therapy in treatment-resistant depression (TRD) in collaboration with the Open Foundation.',
        overlaySrc: '/assets/homepage/pink-layer-05-transparent.png',
    },
    {
        number: '06',
        nav: 'MUSIC',
        heading: 'Musical Synergy',
        description:
            'Next to all my scientific passions, music is a crucial factor in fueling my motivation and excitement. I combine this by DJ-ing (Ventromedial) and supporting the open-minded event organisation in Amsterdam, Kraft und Licht, with a homebase at Der Hintergarten. I believe dancing is a powerful tool to feel empowered and charged to continue as a devoted researcher.',
        overlaySrc: '/assets/homepage/pink-layer-06-transparent.png',
    },
]

const MARKERS: Array<{
    top: string
    left: string
    markerKey: string
    sub: string
    lineHeight?: number
    lineX?: string
}> = [
    { top: '10%', left: '13%', markerKey: 'PFC', sub: 'EVALUATION & CONTROL', lineHeight: 74 },
    { top: '0%', left: '44%', markerKey: 'ACC', sub: 'CONFLICT MONITORING', lineHeight: 118 },
    { top: '8%', left: '72%', markerKey: 'DLPFC', sub: 'STRATEGIC DECISION-MAKING', lineHeight: 110, lineX: '54%' },
    { top: '56%', left: '4%', markerKey: 'VS', sub: 'REWARD VALUATION' },
    { top: '72%', left: '69%', markerKey: 'AMY', sub: 'EMOTIONAL SIGNALING' },
]

const COUNT = DEFAULT_LAYERS.length

// Overrides each slot's heading/description with the matching Sanity
// passion (by position) when the CMS document has one, falling back to the
// hand-written default otherwise — same `?? fallback` pattern used on every
// other page's Sanity-backed copy.
function buildLayers(passions?: Passion[]): Layer[] {
    return DEFAULT_LAYERS.map((defaults, i) => {
        const passion = passions?.[i]
        if (!passion) return defaults
        return { ...defaults, heading: passion.title, description: passion.description }
    })
}

// Per-overlay registration nudges — a few of the pink-layer PNGs aren't
// aligned to the base image out of the box, so each misaligned one gets its
// own small positional correction (see the .overlayRegistration0N rules).
// Indexed by layer position; undefined entries use the default inset: 0.
const OVERLAY_REGISTRATION_CLASS: (string | undefined)[] = [
    styles.overlayRegistration01,
    styles.overlayRegistration02,
    undefined,
    styles.overlayRegistration04,
    styles.overlayRegistration05,
    styles.overlayRegistration06,
]

export default function LayersOfExploration({ passions }: { passions?: Passion[] }) {
    const LAYERS = useMemo(() => buildLayers(passions), [passions])
    const [active, setActive] = useState(0)
    const cur = LAYERS[active]

    const scrollerRef = useRef<HTMLDivElement>(null)
    const reducedMotionRef = useRef(false)
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)

    useEffect(() => {
        reducedMotionRef.current = prefersReducedMotion()
    }, [])

    // Desktop: scroll progress through the tall .scroller drives the active
    // index. The panel itself is pinned with plain CSS `position: sticky` —
    // ScrollTrigger only reads progress here, it never touches opacity or
    // transform directly, so it can't fight the CSS transitions that handle
    // the actual crossfade.
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const mm = gsap.matchMedia()

        mm.add(DESKTOP_QUERY, () => {
            const st = ScrollTrigger.create({
                trigger: scrollerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                // Settles a scroll gesture onto one subject at a time instead of
                // free-scrubbing through all six — without it, a fast flick can
                // fire several index changes a second, restarting the text
                // crossfade before it ever finishes.
                snap: {
                    snapTo: 1 / COUNT,
                    duration: 0.4,
                    ease: 'power1.inOut',
                },
                onUpdate: (self) => {
                    const idx = Math.min(COUNT - 1, Math.floor(self.progress * COUNT))
                    setActive((prev) => (prev === idx ? prev : idx))
                },
            })
            return () => st.kill()
        })

        return () => mm.revert()
    }, [])

    const goTo = (i: number) => {
        const clamped = Math.min(COUNT - 1, Math.max(0, i))
        setActive(clamped)
        const el = scrollerRef.current
        if (!el || !window.matchMedia(DESKTOP_QUERY).matches) return
        const rect = el.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        if (scrollable <= 0) return
        const top = window.scrollY + rect.top + ((clamped + 0.5) / COUNT) * scrollable
        window.scrollTo({ top, behavior: reducedMotionRef.current ? 'auto' : 'smooth' })
    }

    // Mobile only: ScrollTrigger doesn't run below the desktop breakpoint (see
    // the matchMedia gate above), so a horizontal swipe over the visual/copy
    // area is this layout's only gesture-based way to change chapters — a
    // vertical swipe is left alone so the page can still scroll normally.
    const SWIPE_THRESHOLD = 40

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.matchMedia(DESKTOP_QUERY).matches) return
        const t = e.touches[0]
        touchStartRef.current = { x: t.clientX, y: t.clientY }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        const start = touchStartRef.current
        touchStartRef.current = null
        if (!start || window.matchMedia(DESKTOP_QUERY).matches) return
        const t = e.changedTouches[0]
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return
        goTo(active + (dx < 0 ? 1 : -1))
    }

    return (
        <section className={styles.section} aria-label="Six layers of exploration">
            <div className={styles.scroller} ref={scrollerRef} style={{ height: `${COUNT * 100}vh` }}>
                <div className={styles.sticky}>
                    <div className={styles.headerBand}>
                        <div className={styles.eyebrowTitle}>SIX&nbsp;LAYERS&nbsp;OF&nbsp;EXPLORATION</div>
                        <div className={styles.readout}>
                            {cur.number} / {String(COUNT).padStart(2, '0')} &nbsp;·&nbsp;{' '}
                            <span className={styles.readoutSubject}>{cur.nav}</span>
                        </div>
                    </div>

                    {/* mobile-only prev/next + compact rail, directly under the title line */}
                    <div className={styles.headerArrows}>
                        <button
                            type="button"
                            className={styles.headerArrow}
                            onClick={() => goTo(active - 1)}
                            disabled={active === 0}
                            aria-label="Previous layer"
                        >
                            <span aria-hidden="true">←</span>
                        </button>

                        <nav className={styles.rail} aria-label="Layers">
                            <span className={styles.railSpine} aria-hidden />
                            <ul>
                                {LAYERS.map((l, i) => (
                                    <li key={l.number}>
                                        <button
                                            type="button"
                                            className={`${styles.railBtn} ${i === active ? styles.railBtnActive : ''}`}
                                            aria-current={i === active ? 'true' : undefined}
                                            onClick={() => goTo(i)}
                                        >
                                            <span className={styles.railDot} aria-hidden />
                                            <span className={styles.railText}>
                                                <span className={styles.railNum}>{l.number}</span>
                                                <span className={styles.railNav}>{l.heading}</span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <button
                            type="button"
                            className={styles.headerArrow}
                            onClick={() => goTo(active + 1)}
                            disabled={active === COUNT - 1}
                            aria-label="Next layer"
                        >
                            <span aria-hidden="true">→</span>
                        </button>
                    </div>

                    <div className={styles.grid} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                        {/* brain stack */}
                        <div className={styles.visual}>
                            <div className={styles.stack}>
                                <Image
                                    src={BASE_IMAGE}
                                    alt="Anatomical illustration of the human head and brain"
                                    className={styles.base}
                                    fill
                                    sizes="500px"
                                    priority
                                />
                                {LAYERS.map((l, i) => (
                                    <Image
                                        key={l.overlaySrc}
                                        src={l.overlaySrc}
                                        alt=""
                                        aria-hidden="true"
                                        fill
                                        sizes="500px"
                                        className={`${styles.overlay} ${i === active ? styles.overlayActive : ''} ${
                                            OVERLAY_REGISTRATION_CLASS[i] || ''
                                        }`}
                                    />
                                ))}
                            </div>

                            {MARKERS.map((m) => (
                                <div
                                    key={m.markerKey}
                                    className={styles.marker}
                                    style={{ top: m.top, left: m.left }}
                                >
                                    <div className={styles.markerKey}>{m.markerKey}</div>
                                    <div className={styles.markerSub}>{m.sub}</div>
                                    {m.lineHeight != null && (
                                        <span
                                            className={styles.markerLine}
                                            style={{ left: m.lineX || 0, height: m.lineHeight }}
                                        />
                                    )}
                                </div>
                            ))}

                        </div>

                        {/* copy — all six states share one grid cell; only the active
                            one is visible/interactive, crossfading via CSS transitions */}
                        <div className={styles.content}>
                            {LAYERS.map((l, i) => (
                                <div
                                    key={l.number}
                                    className={`${styles.state} ${i === active ? styles.stateActive : ''}`}
                                    inert={i !== active}
                                >
                                    <div className={styles.label}>{l.nav}</div>
                                    <h2 className={styles.heading}>{l.heading}</h2>
                                    <p className={styles.description}>{l.description}</p>
                                    <a className={styles.cta} href="/projects">
                                        EXPLORE&nbsp;THIS&nbsp;FIELD <span aria-hidden="true">→</span>
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className={styles.closingLine}>The exploration never ends.</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
