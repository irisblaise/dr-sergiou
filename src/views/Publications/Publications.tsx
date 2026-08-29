'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PageContent } from '../../sanity/lib/queries'
import { ALL_TOPICS, type Topic, type Publication } from '../../data/types'
import BookSpine from '../../components/BookSpine/BookSpine'
import { getSpineCover } from '../../components/BookSpine/spinePalette'
import DetailCard from '../../components/DetailCard/DetailCard'
import AccoladeIcon from '../../components/AccoladeIcon/AccoladeIcon'
import styles from './Publications.module.scss'

const CARD_WIDTH = 332
const RAIL_DOTS = 16

export default function Publications({
    publications,
    pageContent,
}: {
    publications: Publication[]
    pageContent?: PageContent | null
}) {
    const heading = pageContent?.heading ?? 'Publications'
    const eyebrow = pageContent?.eyebrow ?? 'RESEARCH THAT BUILDS UNDERSTANDING AND DRIVES CHANGE.'
    const introParagraphs = pageContent?.intro?.length ? pageContent.intro : [
        'A collection of peer-reviewed articles, book chapters and reviews on neuroscience, behavior, and forensic science.',
    ]
    // Stats derived from the publications themselves (via each entry's
    // `authorship`/`kind`), so they stay accurate as items are added/edited in the Studio.
    const countKind = (k: Publication['kind']) =>
        publications.filter((p) => p.kind === k).length
    const stats = [
        { value: String(publications.length), label: 'PUBLICATIONS' },
        {
            value: String(publications.filter((p) => p.authorship === 'First author').length),
            label: 'FIRST AUTHOR',
        },
        { value: String(countKind('BOOK CHAPTER')), label: 'BOOK CHAPTERS' },
    ]

    const [filters, setFilters] = useState<Set<Topic>>(new Set())
    const [selected, setSelected] = useState(-1)
    const [cardLeft, setCardLeft] = useState(0)

    const areaRef = useRef<HTMLDivElement>(null)
    const shelfRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)
    const spineRefs = useRef<(HTMLButtonElement | null)[]>([])
    const drag = useRef({ down: false, startX: 0, startLeft: 0, dragged: false })
    // Mirror of `selected` for the once-attached wheel/pointer listeners.
    const selectedRef = useRef(selected)
    useEffect(() => {
        selectedRef.current = selected
    }, [selected])

    const locked = selected >= 0

    const isVisible = useCallback(
        (i: number) =>
            filters.size === 0 || publications[i].topics.some((t) => filters.has(t)),
        [filters, publications],
    )

    const toggleTopic = (t: Topic) => {
        setSelected(-1)
        setFilters((prev) => {
            const next = new Set(prev)
            if (next.has(t)) next.delete(t)
            else next.add(t)
            return next
        })
    }

    const updateRail = useCallback(() => {
        const shelf = shelfRef.current
        const track = trackRef.current
        const thumb = thumbRef.current
        if (!shelf || !track || !thumb) return
        const max = shelf.scrollWidth - shelf.clientWidth
        const ratio = max > 2 ? Math.max(0, Math.min(1, shelf.scrollLeft / max)) : 0
        thumb.style.left = `${ratio * track.clientWidth}px`
    }, [])

    const positionCard = useCallback(() => {
        const area = areaRef.current
        const spine = selected >= 0 ? spineRefs.current[selected] : null
        if (!area || !spine) return
        const a = area.getBoundingClientRect()
        const s = spine.getBoundingClientRect()
        const center = s.left - a.left + s.width / 2
        setCardLeft(Math.max(12, Math.min(center - CARD_WIDTH / 2, a.width - CARD_WIDTH - 12)))
    }, [selected])

    useLayoutEffect(() => {
        positionCard()
    }, [positionCard])

    // Wheel (vertical → horizontal). Disabled while a book is open.
    useEffect(() => {
        const shelf = shelfRef.current
        if (!shelf) return
        const onWheel = (e: WheelEvent) => {
            if (selectedRef.current >= 0) return
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                shelf.scrollLeft += e.deltaY
                e.preventDefault()
            }
        }
        shelf.addEventListener('wheel', onWheel, { passive: false })
        return () => shelf.removeEventListener('wheel', onWheel)
    }, [])

    // Pointer drag to pan. Disabled while a book is open.
    useEffect(() => {
        const shelf = shelfRef.current
        if (!shelf) return
        const onDown = (e: PointerEvent) => {
            if (selectedRef.current >= 0) return
            drag.current = {
                down: true,
                startX: e.clientX,
                startLeft: shelf.scrollLeft,
                dragged: false,
            }
        }
        const onMove = (e: PointerEvent) => {
            if (!drag.current.down) return
            const dx = e.clientX - drag.current.startX
            if (Math.abs(dx) > 5) drag.current.dragged = true
            shelf.scrollLeft = drag.current.startLeft - dx
        }
        const onUp = () => {
            drag.current.down = false
            setTimeout(() => (drag.current.dragged = false), 0)
        }
        shelf.addEventListener('pointerdown', onDown)
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        return () => {
            shelf.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }
    }, [])

    // Recompute rail on mount, resize, and font load.
    useEffect(() => {
        const raf = requestAnimationFrame(updateRail)
        const onResize = () => {
            updateRail()
            positionCard()
        }
        window.addEventListener('resize', onResize)
        let cancelled = false
        document.fonts?.ready?.then(() => {
            if (!cancelled) updateRail()
        })
        return () => {
            cancelAnimationFrame(raf)
            cancelled = true
            window.removeEventListener('resize', onResize)
        }
    }, [updateRail, positionCard])

    // Filtering collapses spines → reset scroll and re-measure after the transition.
    useEffect(() => {
        const shelf = shelfRef.current
        if (shelf) shelf.scrollLeft = 0
        updateRail()
        const t = setTimeout(updateRail, 480)
        return () => clearTimeout(t)
    }, [filters, updateRail])

    const onShelfScroll = () => {
        updateRail()
        positionCard()
    }

    const handleSelect = (i: number) => {
        if (drag.current.dragged) return
        setSelected((cur) => (cur === i ? -1 : i))
    }

    return (
        <div className={styles.page}>
            {/* Intro panel */}
            <aside className={styles.intro}>
                <h1 className={styles.heading}>
                    {heading.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            {index < heading.split('\n').length - 1 && <br />}
                        </span>
                    ))}
                </h1>
                <div className={styles.eyebrow}>{eyebrow}</div>
                {introParagraphs.map((paragraph, index) => (
                    <p key={index} className={styles.blurb}>
                        {paragraph}
                    </p>
                ))}

                <div className={styles.stats}>
                    {stats.map((s) => (
                        <div key={s.label} className={styles.stat}>
                            <div className={styles.statValue}>{s.value}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.filterMeta}>
                    <span>FILTER&nbsp;BY&nbsp;TOPIC</span>
                    <span className={styles.swipeHint}>SWIPE&nbsp;FOR&nbsp;MORE</span>
                </div>

                <div className={styles.chips}>
                    <button
                        className={`${styles.chip} ${filters.size === 0 ? styles.chipActive : ''}`}
                        onClick={() => {
                            setFilters(new Set())
                            setSelected(-1)
                        }}
                    >
                        All
                    </button>
                    {ALL_TOPICS.map((t) => (
                        <button
                            key={t}
                            className={`${styles.chip} ${filters.has(t) ? styles.chipActive : ''}`}
                            onClick={() => toggleTopic(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Shelf + rail */}
            <div className={styles.shelfCol}>
                <div className={styles.shelfArea} ref={areaRef}>
                    <div
                        className={`${styles.shelf} ${locked ? styles.locked : ''}`}
                        ref={shelfRef}
                        onScroll={onShelfScroll}
                    >
                        <div className={styles.shelfTrack}>
                            {publications.map((p, i) => (
                                <BookSpine
                                    key={i}
                                    ref={(el) => {
                                        spineRefs.current[i] = el
                                    }}
                                    publication={p}
                                    index={i}
                                    selected={selected === i}
                                    dimmed={!isVisible(i)}
                                    onSelect={() => handleSelect(i)}
                                />
                            ))}
                        </div>
                    </div>

                    {selected >= 0 && isVisible(selected) && (
                        <DetailCard
                            publication={publications[selected]}
                            left={cardLeft}
                            onClose={() => setSelected(-1)}
                        />
                    )}
                </div>

                {/* Read-only scroll rail */}
                <div className={styles.railWrap}>
                    <div className={styles.railTrack} ref={trackRef}>
                        <div className={styles.railLine} />
                        <div className={styles.railDots}>
                            {Array.from({ length: RAIL_DOTS }).map((_, i) => (
                                <span key={i} />
                            ))}
                        </div>
                        <div className={styles.railThumb} ref={thumbRef} />
                    </div>
                    <div className={styles.railCaption}>SCROLL&nbsp;HORIZONTALLY&nbsp;TO&nbsp;EXPLORE</div>
                </div>
            </div>

            {/* Mobile: vertical card list (shelf is replaced below the breakpoint) */}
            <div className={styles.mobileList}>
                {publications.map((p, i) => {
                    const cover = getSpineCover(i)
                    return isVisible(i) ? (
                        <div
                            key={i}
                            className={`${styles.mCard} ${selected === i ? styles.mCardOpen : ''}`}
                        >
                            <span
                                className={styles.mSpine}
                                style={{ ['--cover' as string]: cover.bg, ['--ink-on' as string]: cover.text }}
                            >
                                <span className={styles.mYear}>{p.year}</span>
                                <span className={styles.mRule} aria-hidden />
                                {p.accolade && (
                                    <span className={styles.mAccolade} title={p.accolade.label}>
                                        <AccoladeIcon type={p.accolade.type} size={14} />
                                    </span>
                                )}
                                <span className={styles.mIndex}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                            </span>

                            <div className={styles.mContent}>
                                <button
                                    className={styles.mCardMain}
                                    onClick={() => setSelected((cur) => (cur === i ? -1 : i))}
                                    aria-expanded={selected === i}
                                >
                                    {p.accolade && (
                                        <span className={styles.mBadge}>
                                            <AccoladeIcon type={p.accolade.type} size={12} />
                                            {p.accolade.label}
                                        </span>
                                    )}
                                    <span className={styles.mTitle}>{p.title}</span>
                                    <span className={styles.mJournal}>{p.journal}</span>
                                    {selected === i && (
                                        <>
                                            <span className={styles.mAuthors}>{p.authors}</span>
                                            <span className={styles.mAbstract}>
                                                {p.abstract ||
                                                    'Abstract available in the full publication.'}
                                            </span>
                                        </>
                                    )}
                                    {selected !== i && (
                                        <span className={styles.mExpand}>TAP TO EXPAND</span>
                                    )}
                                </button>
                                {selected === i && (p.pdf || p.link) && (
                                    <a
                                        className={styles.mRead}
                                        href={p.pdf || p.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        READ&nbsp;{p.pdf ? 'PAPER' : 'ABSTRACT'}{' '}
                                        <span aria-hidden>→</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : null
                })}
            </div>
        </div>
    )
}
