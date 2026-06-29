import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { awards, media } from '../../data/impact'
import type { ImpactAsset } from '../../data/types'
import styles from './Impact.module.scss'

type Category = 'MEDIA' | 'AWARD'
interface ImpactItem {
    id: string
    category: Category
    eyebrow: string
    title: string
    people: string
    description: string
    date: string
    link?: string
    image?: string
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
const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Impact() {
    const items = useMemo<ImpactItem[]>(() => {
        const mediaItems: ImpactItem[] = media.map((m, i) => ({
            id: `media-${i}`,
            category: 'MEDIA',
            eyebrow: m.mediaType,
            title: m.subject,
            people: m.peopleInvolved,
            description: m.description,
            date: m.date,
            link: m.link || undefined,
            image: m.image,
            hasVideo: m.assets.some((a) => a.type === 'video'),
            assets: m.assets,
        }))
        const awardItems: ImpactItem[] = awards.map((a, i) => ({
            id: `award-${i}`,
            category: 'AWARD',
            eyebrow: a.mediaType,
            title: a.subject,
            people: a.peopleInvolved,
            description: a.description,
            date: a.date,
            image: a.image,
            hasVideo: a.assets.some((as) => as.type === 'video'),
            assets: a.assets,
        }))
        return [...mediaItems, ...awardItems]
    }, [])

    const mediaCount = media.length
    const awardCount = awards.length
    const [selected, setSelected] = useState(0)
    const item = items[selected]

    // ---- Mobile switcher: tabs (Media/Awards) + chip strip ----
    const [activeTab, setActiveTab] = useState<Category>('MEDIA')
    const selectTab = (tab: Category) => {
        setActiveTab(tab)
        const first = items.findIndex((it) => it.category === tab)
        if (first >= 0) setSelected(first)
    }

    // ---- Detail media: active asset + thumbnail track ----
    const [activeAsset, setActiveAsset] = useState(0)
    const [thumbStart, setThumbStart] = useState(0)
    useEffect(() => {
        setActiveAsset(0)
        setThumbStart(0)
    }, [selected])
    const [playing, setPlaying] = useState(false)
    useEffect(() => setPlaying(false), [activeAsset, selected])

    const assets = item.assets ?? []
    // The hero reflects the active asset — which may be an image OR a video.
    const heroAsset =
        assets[activeAsset] ?? (item.image ? ({ type: 'image', src: item.image } as ImpactAsset) : undefined)
    const isVideo = heroAsset?.type === 'video'
    const heroSrc = heroAsset?.type === 'image' ? heroAsset.src : item.image
    const THUMB_STEP = 102 // 90px thumb + 12px gap
    const VISIBLE = 4
    const maxStart = Math.max(0, assets.length - VISIBLE)
    const prevThumb = () => setThumbStart((s) => Math.max(0, s - 1))
    const nextThumb = () => setThumbStart((s) => Math.min(maxStart, s + 1))

    // ---- Sticky stacked legend (see IMPACT_LEGEND.md) ----
    const scrollRef = useRef<HTMLDivElement>(null)
    const anchorRef = useRef<HTMLDivElement>(null)
    const awardsHeaderRef = useRef<HTMLDivElement>(null)
    const fadeRef = useRef<HTMLDivElement>(null)
    const spacerRef = useRef<HTMLDivElement>(null)

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
        if (!scroll || !anchor || !spacer) return
        spacer.style.height = '0px'
        const y = anchor.offsetTop
        const desired = scroll.clientHeight + y - HEADER_H
        const need = Math.max(0, desired - scroll.scrollHeight)
        spacer.style.height = `${need}px`
        updateSticky()
    }, [updateSticky])

    useEffect(() => {
        const raf = requestAnimationFrame(fit)
        const onResize = () => fit()
        window.addEventListener('resize', onResize)
        let cancelled = false
        document.fonts?.ready?.then(() => {
            if (!cancelled) fit()
        })
        return () => {
            cancelAnimationFrame(raf)
            cancelled = true
            window.removeEventListener('resize', onResize)
        }
    }, [fit])

    const scrollLegendTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })
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
            <aside className={styles.rail}>
                <h1 className={styles.heading}>Impact</h1>
                <div className={styles.eyebrow}>
                    SCIENCE IN ACTION.
                    <br />
                    IMPACT IN SOCIETY.
                </div>
                <p className={styles.blurb}>
                    A selection of media, interviews and awards that reflect the reach and relevance
                    of my work.
                </p>

                {/* Mobile-only switcher: tabs + horizontal chip strip */}
                <div className={styles.switcher}>
                    <div className={styles.tabs}>
                        {(['MEDIA', 'AWARD'] as Category[]).map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                                onClick={() => selectTab(tab)}
                            >
                                {tab === 'MEDIA' ? 'MEDIA' : 'AWARDS'}
                                <span className={styles.tabCount}>
                                    {tab === 'MEDIA' ? mediaCount : awardCount}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.chipsWrap}>
                        <div className={styles.chips}>
                            {items
                                .filter((it) => it.category === activeTab)
                                .map((it) => {
                                    const idx = items.indexOf(it)
                                    return (
                                        <button
                                            key={it.id}
                                            className={`${styles.chip} ${idx === selected ? styles.chipActive : ''}`}
                                            onClick={() => setSelected(idx)}
                                        >
                                            <span className={styles.chipDate}>{fmtDate(it.date)}</span>
                                            <span className={styles.chipTitle}>{it.title}</span>
                                        </button>
                                    )
                                })}
                        </div>
                        <div className={styles.chipsFade} aria-hidden />
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
                    <span className={styles.scrollUpIcon} aria-hidden>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                            <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    SCROLL&nbsp;UP
                </button>
            </aside>

            {/* Center: featured detail text */}
            <div className={styles.center}>
                <div className={styles.featureEyebrow}>
                    {item.category} · {item.eyebrow}
                </div>
                <div className={styles.featureDate}>{fmtDate(item.date)}</div>
                <h2 className={styles.featureTitle}>{item.title}</h2>
                <div className={styles.featurePeople}>{item.people}</div>
                <div className={styles.rule} />
                <p className={styles.featureDesc}>{item.description}</p>
                {item.link && (
                    <a
                        className={styles.cta}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {item.category === 'MEDIA' ? 'READ MORE' : 'VIEW'} <span aria-hidden>→</span>
                    </a>
                )}
            </div>

            {/* Right: hero media + asset gallery */}
            <div className={`${styles.media} ${assets.length > 1 ? '' : styles.mediaSolo}`}>
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
                        <img className={styles.heroImg} src={heroSrc} alt={item.title} />
                    ) : (
                        <div className={styles.heroPlaceholder}>
                            <span>media · portrait</span>
                        </div>
                    )}

                    {!(isVideo && playing) && <span className={styles.heroShade} aria-hidden />}

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

                {assets.length > 1 && (
                    <div className={styles.gallery}>
                        <button
                            className={styles.galArrow}
                            onClick={prevThumb}
                            disabled={thumbStart === 0}
                            aria-label="Previous"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M15 6l-6 6 6 6" />
                            </svg>
                        </button>
                        <div className={styles.galViewport}>
                            <div
                                className={styles.galTrack}
                                style={{ transform: `translateX(-${thumbStart * THUMB_STEP}px)` }}
                            >
                                {assets.map((a, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.thumb} ${i === activeAsset ? styles.thumbActive : ''}`}
                                        onClick={() => setActiveAsset(i)}
                                    >
                                        <img src={a.type === 'image' ? a.src : item.image} alt="" />
                                        {a.type === 'video' && <span className={styles.thumbPlay} aria-hidden />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            className={styles.galArrow}
                            onClick={nextThumb}
                            disabled={thumbStart >= maxStart}
                            aria-label="Next"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
