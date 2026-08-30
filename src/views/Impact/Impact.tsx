'use client'

import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import type { PageContent } from '../../sanity/lib/queries'
import type { Award, ImpactAsset, MediaItem } from '../../data/types'
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from '../../lib/prefersReducedMotion'
import { useRecomputeOnResize } from '../../lib/useRecomputeOnResize'
import { useMatchMedia } from '../../lib/useMatchMedia'
import { resolvePageIntro } from '../../lib/pageIntro'
import PageIntro from '../../components/ui/PageIntro/PageIntro'
import ArrowLink from '../../components/ui/ArrowLink/ArrowLink'
import Chip from '../../components/ui/Chip/Chip'
import styles from './Impact.module.scss'

type Category = 'MEDIA' | 'AWARD'
interface ImpactItem {
    id: string
    category: Category
    eyebrow: string
    title: string
    people?: string
    description: string
    date: string
    link?: string
    image?: string
    imageAlt?: string
    hasVideo: boolean
    assets: ImpactAsset[]
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
function fmtDate(d: string): string {
    const m = d.match(/(\d{1,2})-(\d{1,2})-(\d{4})/)
    if (!m) return d
    const [, day, mon, year] = m
    return `${day} ${MONTHS[Number(mon) - 1] ?? ''} ${year}`
}

const HEADER_H = 42
const RULE = 'rgba(94,89,77,.28)'

// Convert a YouTube watch/short URL into an autoplay embed URL.
function ytEmbed(url: string): string {
    const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{6,})/)
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : url
}
// ---- Gutter spine geometry: a static trace stepping sideways at three bends ----
const SPINE_W = 56
const SPINE_C = SPINE_W / 2
function buildSpine(h: number) {
    const bends = [
        { y: h * 0.24, dx: 9 },
        { y: h * 0.52, dx: -9 },
        { y: h * 0.82, dx: 9 },
    ]
    let d = `M ${SPINE_C} 0`
    for (const { y, dx } of bends) {
        const x2 = SPINE_C + dx
        d += ` L ${SPINE_C} ${y - 18} Q ${x2} ${y - 18} ${x2} ${y - 11} L ${x2} ${y + 11} Q ${x2} ${y + 18} ${SPINE_C} ${y + 18}`
    }
    d += ` L ${SPINE_C} ${h}`
    return { d, bends }
}

export default function Impact({
    awards,
    media,
    pageContent,
}: {
    awards: Award[]
    media: MediaItem[]
    pageContent?: PageContent | null
}) {
    const { heading, eyebrow, paragraphs: introParagraphs } = resolvePageIntro(pageContent, {
        heading: 'Impact',
        eyebrow: 'IMPACT IN SOCIETY.',
        intro: ['Media coverage, interviews, and awards reflecting the reach of Dr. Carmen-Silva Sergiou\'s research.'],
    })
    const items = useMemo<ImpactItem[]>(() => {
        const mediaItems: ImpactItem[] = media.map((m, i) => ({
            id: `media-${i}`,
            category: 'MEDIA',
            eyebrow: m.mediaType,
            title: m.subject,
            people: m.peopleInvolved || undefined,
            description: m.description,
            date: m.date,
            link: m.link || undefined,
            image: m.image,
            imageAlt: m.imageAlt,
            hasVideo: m.assets.some((a) => a.type === 'video'),
            assets: m.assets,
        }))
        const awardItems: ImpactItem[] = awards.map((a, i) => ({
            id: `award-${i}`,
            category: 'AWARD',
            eyebrow: a.mediaType,
            title: a.subject,
            people: a.peopleInvolved || undefined,
            description: a.description,
            date: a.date,
            image: a.image,
            imageAlt: a.imageAlt,
            hasVideo: a.assets.some((as) => as.type === 'video'),
            assets: a.assets,
        }))
        return [...mediaItems, ...awardItems]
    }, [awards, media])

    const mediaCount = media.length
    const awardCount = awards.length
    const [selected, setSelected] = useState(0)
    const item = items[selected]

    // ---- Mobile switcher: tabs (Media/Awards) + chip strip ----
    const [activeTab, setActiveTab] = useState<Category>('MEDIA')
    const chipsRef = useRef<HTMLDivElement>(null)
    const selectTab = (tab: Category) => {
        setActiveTab(tab)
        const first = items.findIndex((it) => it.category === tab)
        if (first >= 0) setSelected(first)
        chipsRef.current?.scrollTo({ left: 0, behavior: 'auto' })
    }

    // ---- Detail media: active asset ----
    const [activeAsset, setActiveAsset] = useState(0)
    const [playing, setPlaying] = useState(false)

    // Reset the active asset whenever a different item is selected, and stop
    // any playing video whenever either the item or its active asset changes
    // — adjusted during render rather than in an effect, since this is pure
    // React-state synchronization with no external system involved (see
    // https://react.dev/learn/you-might-not-need-an-effect).
    const [prevSelected, setPrevSelected] = useState(selected)
    if (selected !== prevSelected) {
        setPrevSelected(selected)
        setActiveAsset(0)
    }
    const [prevPlaybackKey, setPrevPlaybackKey] = useState([selected, activeAsset])
    if (prevPlaybackKey[0] !== selected || prevPlaybackKey[1] !== activeAsset) {
        setPrevPlaybackKey([selected, activeAsset])
        setPlaying(false)
    }

    const assets = item.assets ?? []
    // The hero reflects the active asset — which may be an image OR a video.
    const heroAsset =
        assets[activeAsset] ?? (item.image ? ({ type: 'image', src: item.image } as ImpactAsset) : undefined)
    const isVideo = heroAsset?.type === 'video'
    const heroSrc = heroAsset?.type === 'image' ? heroAsset.src : item.image
    const prevAsset = () => setActiveAsset((i) => (i - 1 + assets.length) % assets.length)
    const nextAsset = () => setActiveAsset((i) => (i + 1) % assets.length)
    const pad2 = (n: number) => String(n).padStart(2, '0')

    // ---- Sticky stacked legend (see IMPACT_LEGEND.md) ----
    const scrollRef = useRef<HTMLDivElement>(null)
    const anchorRef = useRef<HTMLDivElement>(null)
    const awardsHeaderRef = useRef<HTMLDivElement>(null)
    const fadeRef = useRef<HTMLDivElement>(null)
    const spacerRef = useRef<HTMLDivElement>(null)

    // ---- Gutter spine: static traced axon, sized to the rail's live height ----
    const railRef = useRef<HTMLDivElement>(null)
    const [spineH, setSpineH] = useState(0)
    const reducedMotion = useMatchMedia(REDUCED_MOTION_QUERY)
    const spine = useMemo(() => buildSpine(spineH), [spineH])

    const updateSticky = useCallback(() => {
        const scroll = scrollRef.current
        const anchor = anchorRef.current
        const ah = awardsHeaderRef.current
        const fade = fadeRef.current
        if (!scroll || !anchor || !ah) return

        const y = anchor.offsetTop // in-flow offset of the awards anchor
        const bottomPin = scroll.clientHeight - HEADER_H
        const viewPos = y - scroll.scrollTop
        const top = Math.min(bottomPin, Math.max(HEADER_H, viewPos))
        ah.style.top = `${top}px`

        const stacked = top <= HEADER_H + 0.5
        const pinned = top >= bottomPin - 0.5

        if (stacked) {
            ah.style.borderTopColor = 'transparent'
            ah.style.borderBottomColor = RULE
        } else {
            ah.style.borderBottomColor = 'transparent'
            ah.style.borderTopColor = pinned ? RULE : 'transparent'
        }

        if (fade) {
            fade.style.top = `${top - 30}px`
            fade.style.opacity = pinned ? '1' : '0'
        }
    }, [])

    const fit = useCallback(() => {
        const scroll = scrollRef.current
        const anchor = anchorRef.current
        const spacer = spacerRef.current
        const rail = railRef.current
        if (!scroll || !anchor || !spacer) return
        spacer.style.height = '0px'
        const y = anchor.offsetTop
        const desired = scroll.clientHeight + y - HEADER_H
        const need = Math.max(0, desired - scroll.scrollHeight)
        spacer.style.height = `${need}px`
        updateSticky()
        if (rail) setSpineH(rail.offsetHeight)
    }, [updateSticky])

    useRecomputeOnResize(fit)

    const scrollLegendTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }

    const renderRow = (it: ImpactItem) => {
        const idx = items.indexOf(it)
        return (
            <button
                key={it.id}
                className={`${styles.listItem} ${idx === selected ? styles.itemActive : ''}`}
                onClick={() => setSelected(idx)}
            >
                <span className={styles.dot} />
                <span className={styles.rowText}>
                    <span className={styles.itemDate}>{fmtDate(it.date)}</span>
                    <span className={styles.itemTitle}>{it.eyebrow}</span>
                </span>
            </button>
        )
    }

    return (
        <div className={styles.page}>
            {/* Left rail: intro + sticky stacked legend */}
            <aside className={styles.rail} ref={railRef}>
                <PageIntro
                    heading={heading}
                    eyebrow={eyebrow}
                    paragraphs={introParagraphs}
                    headingClassName={styles.heading}
                    eyebrowClassName={styles.eyebrow}
                    paragraphClassName={styles.blurb}
                />

                {/* Mobile-only switcher: tabs + horizontal chip strip */}
                <div className={styles.switcher}>
                    <div className={styles.tabs}>
                        {(['MEDIA', 'AWARD'] as Category[]).map((tab) => (
                            <Chip
                                key={tab}
                                className={styles.tab}
                                activeClassName={styles.tabActive}
                                active={activeTab === tab}
                                onClick={() => selectTab(tab)}
                            >
                                {tab === 'MEDIA' ? 'MEDIA' : 'AWARDS'}
                                <span className={styles.tabCount}>
                                    {tab === 'MEDIA' ? mediaCount : awardCount}
                                </span>
                            </Chip>
                        ))}
                    </div>
                    <div className={styles.chipsWrap}>
                        <div
                            className={styles.chips}
                            ref={chipsRef}
                            onClick={(e) => {
                                const btn = (e.target as HTMLElement).closest('button')
                                btn?.scrollIntoView({
                                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                                    inline: 'start',
                                    block: 'nearest',
                                })
                            }}
                        >
                            {items
                                .filter((it) => it.category === activeTab)
                                .map((it) => {
                                    const idx = items.indexOf(it)
                                    return (
                                        <Chip
                                            key={it.id}
                                            className={styles.chip}
                                            activeClassName={styles.chipActive}
                                            active={idx === selected}
                                            onClick={() => setSelected(idx)}
                                        >
                                            <span className={styles.chipDate}>{fmtDate(it.date)}</span>
                                            <span className={styles.chipTitle}>{it.title}</span>
                                        </Chip>
                                    )
                                })}
                        </div>
                    </div>

                    <div className={styles.swipeHint}>
                        SWIPE&nbsp;FOR&nbsp;MORE
                        <span className={styles.swipeCueLine}>
                            <span className={styles.swipeCueDot} />
                        </span>
                    </div>
                </div>

                <div className={styles.legendWrap}>
                    <div className={styles.legend} ref={scrollRef} onScroll={updateSticky}>
                        <div className={styles.mediaHeader}>
                            <span className={styles.headLabel}>MEDIA</span>
                            <span className={styles.headCount}>{mediaCount} items</span>
                        </div>

                        {items.filter((it) => it.category === 'MEDIA').map(renderRow)}

                        {/* In-flow placeholder that reserves the awards header's slot */}
                        <div className={styles.awardsAnchor} ref={anchorRef} data-awanchor />

                        {items.filter((it) => it.category === 'AWARD').map(renderRow)}

                        <div className={styles.spacer} ref={spacerRef} />
                    </div>

                    {/* Moving AWARDS header overlay (top set by JS each frame) */}
                    <div className={styles.awardsHeader} ref={awardsHeaderRef}>
                        <span className={styles.headLabel}>AWARDS</span>
                        <span className={styles.headCount}>{awardCount} items</span>
                    </div>
                    <div className={styles.awardsFade} ref={fadeRef} aria-hidden />
                </div>

                <button className={styles.scrollUp} onClick={scrollLegendTop}>
                    SCROLL&nbsp;FOR&nbsp;MORE
                    <span className={styles.cueLine}>
                        <span className={styles.cueDot} />
                    </span>
                </button>

                {/* Gutter spine: a traced axon down the gutter, redrawn to the
                    rail's live height — purely decorative, no active-row wiring */}
                <div className={styles.spine} aria-hidden>
                    {spineH > 0 && (
                        <svg
                            className={styles.spineSvg}
                            viewBox={`0 0 ${SPINE_W} ${spineH}`}
                            preserveAspectRatio="none"
                            width="100%"
                            height="100%"
                        >
                            <path className={styles.spineTrace} d={spine.d} />
                            {!reducedMotion && (
                                <path
                                    className={styles.spineSignalPath}
                                    d={spine.d}
                                    style={
                                        {
                                            '--spine-dash-from': spineH + 314,
                                        } as CSSProperties
                                    }
                                />
                            )}
                            <circle className={styles.spineDot} cx={SPINE_C} cy={0} r={4.5} />
                            <circle className={styles.spineDot} cx={SPINE_C} cy={spineH} r={4.5} />
                            {spine.bends.map((b, i) => (
                                <circle
                                    key={i}
                                    className={styles.spineDot}
                                    cx={SPINE_C + b.dx}
                                    cy={b.y}
                                    r={3}
                                />
                            ))}
                        </svg>
                    )}
                </div>
            </aside>

            {/* Mobile-only: title, shown above the hero image instead of below it */}
            <h2 className={styles.featureTitleMobile}>{item.title}</h2>

            {/* Center: featured detail text */}
            <div className={styles.center}>
                <div className={styles.featureEyebrow}>
                    {item.category} · {item.eyebrow}
                </div>
                <div className={styles.featureDate}>{fmtDate(item.date)}</div>
                <h2 className={styles.featureTitle}>{item.title}</h2>
                {item.people && <div className={styles.featurePeople}>{item.people}</div>}
                <div className={styles.rule} />
                <p className={styles.featureDesc}>{item.description}</p>
                {item.link && (
                    <ArrowLink className={styles.cta} href={item.link} external>
                        {item.category === 'MEDIA' ? 'READ MORE' : 'VIEW'}
                    </ArrowLink>
                )}
            </div>

            {/* Right: hero media + in-image counter bar */}
            <div className={styles.media}>
                <div className={styles.hero}>
                    {isVideo && playing ? (
                        <iframe
                            className={styles.heroVideo}
                            src={ytEmbed(heroAsset!.src)}
                            title={item.title}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    ) : heroSrc ? (
                        <Image
                            className={styles.heroImg}
                            src={heroSrc}
                            alt={item.imageAlt || item.title}
                            fill
                            sizes="(max-width: 900px) 100vw, 40vw"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div className={styles.heroPlaceholder}>
                            <span>media · portrait</span>
                        </div>
                    )}

                    {!(isVideo && playing) && <span className={styles.heroShade} aria-hidden />}

                    {assets.length > 1 && !(isVideo && playing) && (
                        <div className={styles.bar}>
                            <button
                                className={styles.barBtn}
                                onClick={prevAsset}
                                aria-label="Previous asset"
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M19 12H5M11 6l-6 6 6 6" />
                                </svg>
                            </button>
                            <span className={styles.count} aria-live="polite">
                                {pad2(activeAsset + 1)} / {pad2(assets.length)}
                            </span>
                            <button
                                className={styles.barBtn}
                                onClick={nextAsset}
                                aria-label="Next asset"
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </button>
                            <span className={`${styles.kind} ${isVideo ? styles.kindVideo : ''}`}>
                                {isVideo ? 'VIDEO' : 'IMAGE'}
                            </span>
                        </div>
                    )}

                    {isVideo && !playing && (
                        <button
                            className={styles.play}
                            onClick={() => setPlaying(true)}
                            aria-label="Play video"
                        >
                            <span className={styles.playHalo} />
                            <span className={styles.playBtn}>
                                <span className={styles.playTri} />
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
