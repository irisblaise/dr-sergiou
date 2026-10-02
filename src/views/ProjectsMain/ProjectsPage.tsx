'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Project } from '../../data/types'
import type { PageContent } from '../../sanity/lib/queries'
import { MOBILE_QUERY } from '../../styles/breakpoints'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'
import { useMatchMedia } from '../../lib/useMatchMedia'
import { resolvePageIntro } from '../../lib/pageIntro'
import PageIntro from '../../components/ui/PageIntro/PageIntro'
import ArrowLink from '../../components/ui/ArrowLink/ArrowLink'
import styles from './ProjectsPage.module.scss'

// Circuit-timeline geometry — see ProjectsTimeline.dc.html (design handoff).
// Desktop rows sit two content columns either side of a centred gutter;
// mobile stacks image+text into a single column right of a narrow left-hand
// gutter. Either way a row's height varies a lot per project (a longer
// abstract, an optional image), so guessing one fixed row height either
// wastes space for short entries or lets long ones overflow into their
// neighbours. Rows size to their own content instead (desktop with a
// minimum track height), and the conductor is drawn from each row's real
// measured position.
const ROW_MIN_H_DESKTOP = 400
const NODE_TRAIL = 80 // how far below a node its straight run continues before jogging
const TAIL = 200 // headroom below the last node for the tail terminal
const LEAD_IN = 40 // headroom above the first row's measured top

const GUTTER_W_DESKTOP = 190 // viewBox width — matches the 190px CSS gutter column exactly
const AXIS_DESKTOP = 95 // centre of the gutter, in viewBox units
const JOG_SPAN_DESKTOP = 36 // horizontal amplitude of the boxy jog between nodes, and its vertical run
const BR_NEAR_DESKTOP = 27
const BR_MID_DESKTOP = 49
const BR_FAR_DESKTOP = 85
const BR_VJOG_DESKTOP = 22
const BR_SIMPLE_DESKTOP = 35

const GUTTER_W_MOBILE = 72 // matches the 72px CSS gutter column exactly
const AXIS_MOBILE = 32
const JOG_SPAN_MOBILE = 13
const BR_NEAR_MOBILE = 10
const BR_MID_MOBILE = 18
const BR_FAR_MOBILE = 30
const BR_VJOG_MOBILE = 8
const BR_SIMPLE_MOBILE = 13

const DOT_GAP = 5

type Point = { x: number; y: number }

function pointsToPath(points: Point[]): string {
    return points.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}

// Trims a polyline to [yMin, yMax], interpolating new endpoints exactly on
// the boundary — used for the ghost rail, which is the main conductor
// shifted sideways and clipped a little shorter at both ends.
function clipPolyline(points: Point[], yMin: number, yMax: number): Point[] {
    const out: Point[] = []
    for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const prev = points[i - 1]
        if (prev) {
            if (prev.y < yMin && p.y >= yMin) {
                const t = (yMin - prev.y) / (p.y - prev.y)
                out.push({ x: prev.x + (p.x - prev.x) * t, y: yMin })
            }
            if (prev.y <= yMax && p.y > yMax) {
                const t = (yMax - prev.y) / (p.y - prev.y)
                out.push({ x: prev.x + (p.x - prev.x) * t, y: yMax })
                break
            }
        }
        if (p.y >= yMin && p.y <= yMax) out.push(p)
    }
    return out
}

type RowMetrics = { tops: number[]; bottoms: number[]; gridH: number }

export default function ProjectsPage({
    projects,
    pageContent,
}: {
    projects: Project[]
    pageContent?: PageContent | null
}) {
    const railRef = useRef<SVGSVGElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const rowRefs = useRef<(HTMLDivElement | null)[]>([])
    const isMobile = useMatchMedia(MOBILE_QUERY)
    const [rowMetrics, setRowMetrics] = useState<RowMetrics | null>(null)
    const { heading, eyebrow, paragraphs: introParagraphs } = resolvePageIntro(pageContent, {
        heading: 'Projects',
        eyebrow: 'TRACE THE JOURNEY',
        intro: [
            'Ongoing and past research projects that connect neuroscience, behaviour, and technology to questions of justice and society.',
            'Each line of work reflects a different thread in the same wider field of inquiry — from research design to public impact.',
        ],
    })

    // Re-measure whenever the grid's own size changes (a resize, a row
    // reflowing because its text wrapped differently) and once more after
    // web fonts swap in, since that can shift line counts after first paint.
    useLayoutEffect(() => {
        const grid = gridRef.current
        if (!grid) return

        const measure = () => {
            const gridRect = grid.getBoundingClientRect()
            const tops: number[] = []
            const bottoms: number[] = []
            for (const el of rowRefs.current.slice(0, projects.length)) {
                if (!el) return
                // Desktop rows are `display: contents` (their figure and
                // article are the grid items), so they have no box of their
                // own — measure the union of their children instead. Both
                // are vertically centred in the track, so that union's
                // midpoint is the track's centre.
                const boxes = isMobile ? [el] : Array.from(el.children)
                let top = Infinity
                let bottom = -Infinity
                for (const b of boxes) {
                    const r = b.getBoundingClientRect()
                    top = Math.min(top, r.top)
                    bottom = Math.max(bottom, r.bottom)
                }
                tops.push(top - gridRect.top)
                bottoms.push(bottom - gridRect.top)
            }
            setRowMetrics({ tops, bottoms, gridH: gridRect.height })
        }

        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(grid)
        let cancelled = false
        document.fonts.ready.then(() => {
            if (!cancelled) measure()
        })
        return () => {
            cancelled = true
            ro.disconnect()
        }
    }, [isMobile, projects])

    // Desktop's rail is an overlay exactly the grid's height, so the viewBox
    // matches it 1:1; mobile's extends past the last row for the tail.
    const H = !rowMetrics
        ? 0
        : isMobile
          ? rowMetrics.bottoms[rowMetrics.bottoms.length - 1] + TAIL
          : rowMetrics.gridH

    useEffect(() => {
        const svg = railRef.current
        const n = projects.length
        if (!svg || !n) return
        if (!rowMetrics) return

        const GUTTER_W = isMobile ? GUTTER_W_MOBILE : GUTTER_W_DESKTOP
        const AXIS = isMobile ? AXIS_MOBILE : AXIS_DESKTOP
        const JOG_SPAN = isMobile ? JOG_SPAN_MOBILE : JOG_SPAN_DESKTOP
        const BR_NEAR = isMobile ? BR_NEAR_MOBILE : BR_NEAR_DESKTOP
        const BR_MID = isMobile ? BR_MID_MOBILE : BR_MID_DESKTOP
        const BR_FAR = isMobile ? BR_FAR_MOBILE : BR_FAR_DESKTOP
        const BR_VJOG = isMobile ? BR_VJOG_MOBILE : BR_VJOG_DESKTOP
        const BR_SIMPLE = isMobile ? BR_SIMPLE_MOBILE : BR_SIMPLE_DESKTOP

        const NS = 'http://www.w3.org/2000/svg'
        const root = getComputedStyle(document.documentElement)
        const read = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback
        const CANVAS = read('--canvas', '#efeae1')
        const G1 = read('--sage-deep', '#3f5e50')
        const G2 = read('--sage-mid', '#5d8a74')
        const SAGE = read('--sage', '#7aab96')
        const ACC = read('--accent', '#ed4c92')
        const PINK = read('--accent-mid', '#c8326f')
        const reduced = prefersReducedMotion()

        svg.setAttribute('viewBox', `0 0 ${GUTTER_W} ${H}`)
        while (svg.firstChild) svg.removeChild(svg.firstChild)

        // Every glow below is drawn as an explicit SVG <filter> — with a
        // filter region declared far bigger than the shape it applies to —
        // rather than a `blur()`/`drop-shadow()` CSS filter function. Safari
        // computes the CSS-filter shorthand's default filter region from
        // the shape's own tiny bounding box (roughly object bbox + 10%), so
        // on a 10-unit circle a 16px blur radius has nowhere near enough
        // room and gets clipped away entirely — the glow silently vanishes
        // and only the flat fill paints, in both real iOS Safari and
        // desktop Safari (Chrome doesn't clip the same way, which is why
        // this only ever showed up in Safari). Declaring the region
        // ourselves via an SVG filter sidesteps that; `sRGB` interpolation
        // matches the color space `blur()`/`drop-shadow()` use, since the
        // SVG filter default (linearRGB) would otherwise dull/shift ACC.
        const defs = document.createElementNS(NS, 'defs')
        svg.appendChild(defs)
        const blurFilter = (id: string, stdDeviation: number) => {
            const filter = document.createElementNS(NS, 'filter')
            filter.setAttribute('id', id)
            filter.setAttribute('color-interpolation-filters', 'sRGB')
            filter.setAttribute('x', '-500%')
            filter.setAttribute('y', '-500%')
            filter.setAttribute('width', '1100%')
            filter.setAttribute('height', '1100%')
            const blur = document.createElementNS(NS, 'feGaussianBlur')
            blur.setAttribute('stdDeviation', String(stdDeviation))
            filter.appendChild(blur)
            defs.appendChild(filter)
        }
        const dropShadowFilter = (id: string, color: string, stdDeviations: number[]) => {
            const filter = document.createElementNS(NS, 'filter')
            filter.setAttribute('id', id)
            filter.setAttribute('color-interpolation-filters', 'sRGB')
            filter.setAttribute('x', '-500%')
            filter.setAttribute('y', '-500%')
            filter.setAttribute('width', '1100%')
            filter.setAttribute('height', '1100%')
            for (const stdDeviation of stdDeviations) {
                const shadow = document.createElementNS(NS, 'feDropShadow')
                shadow.setAttribute('dx', '0')
                shadow.setAttribute('dy', '0')
                shadow.setAttribute('stdDeviation', String(stdDeviation))
                shadow.setAttribute('flood-color', color)
                filter.appendChild(shadow)
            }
            defs.appendChild(filter)
        }
        blurFilter('proj-blur-7', 7)
        blurFilter('proj-blur-8', 8)
        blurFilter('proj-blur-4', 4)
        dropShadowFilter('proj-dot-glow', ACC, [8, 16])

        const path = (d: string, w: number, col: string, op?: number) => {
            const p = document.createElementNS(NS, 'path')
            p.setAttribute('d', d)
            p.setAttribute('fill', 'none')
            p.setAttribute('stroke', col)
            p.setAttribute('stroke-width', String(w))
            if (op != null) p.setAttribute('stroke-opacity', String(op))
            svg.appendChild(p)
            return p
        }
        const circ = (x: number, y: number, r: number, attrs: Record<string, string | number>) => {
            const c = document.createElementNS(NS, 'circle')
            c.setAttribute('cx', x.toFixed(1))
            c.setAttribute('cy', y.toFixed(1))
            c.setAttribute('r', String(r))
            for (const k in attrs) c.setAttribute(k, String(attrs[k]))
            svg.appendChild(c)
            return c
        }

        const ys = rowMetrics.tops.map((t, i) => (t + rowMetrics.bottoms[i]) / 2)
        const top = Math.max(20, rowMetrics.tops[0] - LEAD_IN)
        const bottom = ys[n - 1] + TAIL

        // Main conductor: a straight run through every node, jogging out to
        // alternating sides in the gap between one node and the next.
        const P: Point[] = [{ x: AXIS, y: top }]
        const gapDir: number[] = []
        for (let i = 0; i < n; i++) {
            const y = ys[i]
            P.push({ x: AXIS, y: i < n - 1 ? y + NODE_TRAIL : bottom })
            if (i < n - 1) {
                const dir = i % 2 === 0 ? 1 : -1
                gapDir.push(dir)
                const nextY = ys[i + 1]
                const jogX = AXIS + dir * JOG_SPAN
                P.push({ x: jogX, y: y + NODE_TRAIL + JOG_SPAN })
                P.push({ x: jogX, y: nextY - NODE_TRAIL - JOG_SPAN })
                P.push({ x: AXIS, y: nextY - NODE_TRAIL })
            }
        }

        const dMain = pointsToPath(P)
        const mainPath = path(dMain, 1.6, G1, 0.8)
        circ(AXIS, top, 3, { fill: G1, 'fill-opacity': 0.8 })

        // Ghost rail — faint parallel shadow, offset and clipped shorter.
        const ghost = clipPolyline(P.map((p) => ({ x: p.x - 7, y: p.y })), top + 40, bottom - 45)
        if (ghost.length > 1) path(pointsToPath(ghost), 1, G1, 0.22)

        // Ambient sage pulse, drifting down the conductor on its own timer —
        // pathLength normalizes the dash math regardless of how long the
        // generated conductor actually is.
        if (!reduced) {
            const q = path(dMain, 1.6, SAGE, 1)
            q.setAttribute('pathLength', '2000')
            q.style.strokeDasharray = '40 2000'
            q.style.strokeLinecap = 'round'
            q.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -2060 }], {
                duration: 6900,
                iterations: Infinity,
                easing: 'linear',
            })
        }

        // One small decorative trace per gap, branching off the rail's
        // actual position there (the jog-offset "hold" segment, not the
        // central axis) so it visibly connects instead of floating free.
        gapDir.forEach((dir, gi) => {
            const y = (ys[gi] + NODE_TRAIL + JOG_SPAN + (ys[gi + 1] - NODE_TRAIL - JOG_SPAN)) / 2
            const railX = AXIS + dir * JOG_SPAN
            const d = -dir
            const far = railX + d * 21
            path(`M ${railX.toFixed(1)} ${y.toFixed(1)} H ${far.toFixed(1)}`, 1, G1, 0.35)
            circ(far + d * 5, y, 2, { fill: SAGE })
        })

        // Per-project: node halo/ring/core, plus a branch toward the figure
        // and a plainer one toward the article — the elaborate jogged trace
        // always points at whichever side holds the image.
        projects.forEach((_, i) => {
            const y = ys[i]
            const imageLeft = i % 2 === 0
            const vJog = i % 2 === 0 ? BR_VJOG : -BR_VJOG

            const elaborate = (dir: -1 | 1) => {
                const nearX = AXIS + dir * BR_NEAR
                const midX = AXIS + dir * BR_MID
                const farX = AXIS + dir * BR_FAR
                const jY = y + vJog
                path(
                    `M ${AXIS} ${y} H ${nearX.toFixed(1)} L ${midX.toFixed(1)} ${jY.toFixed(1)} H ${farX.toFixed(1)}`,
                    1,
                    G1,
                    0.55,
                )
                circ(farX + dir * DOT_GAP, jY, 4.4, { fill: 'none', stroke: G1, 'stroke-width': 1 })
                circ(farX + dir * DOT_GAP, jY, 1.7, { fill: G2 })
            }
            const simple = (dir: -1 | 1) => {
                const farX = AXIS + dir * BR_SIMPLE
                path(`M ${AXIS} ${y} H ${farX.toFixed(1)}`, 1, G1, 0.5)
                circ(farX + dir * DOT_GAP, y, 2.6, { fill: G2 })
            }

            // On mobile there's only one content column, right of the gutter,
            // so both branches always point that way regardless of which
            // side desktop would have put the image on.
            elaborate(isMobile ? 1 : imageLeft ? -1 : 1)
            simple(isMobile ? 1 : imageLeft ? 1 : -1)

            const op = Math.max(0.3, 0.55 - i * 0.05)
            const halo = circ(AXIS, y, 13, { fill: ACC, 'fill-opacity': op })
            halo.setAttribute('filter', 'url(#proj-blur-7)')
            circ(AXIS, y, 7.5, { fill: 'none', stroke: PINK, 'stroke-width': 1.2, 'stroke-opacity': 0.8 })
            circ(AXIS, y, 3.2, { fill: PINK })
        })

        // Tail terminal, at the very bottom of the conductor.
        const tailHalo = circ(AXIS, bottom, 11, { fill: SAGE, 'fill-opacity': 0.12 })
        tailHalo.setAttribute('filter', 'url(#proj-blur-4)')
        circ(AXIS, bottom, 3.4, { fill: CANVAS, stroke: SAGE, 'stroke-width': 1.6 })

        // Pink pulse — a glowing dot that rides the conductor in step with
        // how far down the whole page the user has scrolled, so it starts
        // at the very top of the path on load (scrollY 0) and is guaranteed
        // to reach the very end once the page is scrolled all the way down
        // (scrollY at its max) — tying it to the viewport's position over
        // the rail instead couldn't reach 1 if the page didn't have as much
        // scroll room below the rail as the rail itself was tall. Added last
        // so it always paints on top of the tail terminal it ends up sitting
        // on, rather than being hidden behind it.
        let cleanupScrollDot = () => {}
        if (!reduced) {
            // The halo/dot pair moves every scroll frame, so it's positioned
            // by translating a wrapping <g> rather than rewriting cx/cy on
            // the filtered circles directly — cheaper than touching two
            // filtered elements' geometry every frame. (The glow itself
            // disappearing in Safari was a separate, since-fixed bug — see
            // the filter-region comment above.)
            const dotGroup = document.createElementNS(NS, 'g')
            dotGroup.setAttribute('transform', `translate(${AXIS} ${top})`)
            svg.appendChild(dotGroup)
            const haloDot = document.createElementNS(NS, 'circle')
            haloDot.setAttribute('r', '15')
            haloDot.setAttribute('fill', ACC)
            haloDot.setAttribute('filter', 'url(#proj-blur-8)')
            dotGroup.appendChild(haloDot)
            const scrollDot = document.createElementNS(NS, 'circle')
            scrollDot.setAttribute('r', '5')
            scrollDot.setAttribute('fill', ACC)
            scrollDot.setAttribute('filter', 'url(#proj-dot-glow)')
            dotGroup.appendChild(scrollDot)
            const totalLen = mainPath.getTotalLength()
            const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
            let raf = 0
            const positionDot = () => {
                raf = 0
                const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll()))
                const pt = mainPath.getPointAtLength(progress * totalLen)
                dotGroup.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`)
            }
            const onScroll = () => {
                if (!raf) raf = requestAnimationFrame(positionDot)
            }
            positionDot()
            window.addEventListener('scroll', onScroll, { passive: true })
            window.addEventListener('resize', onScroll)
            cleanupScrollDot = () => {
                window.removeEventListener('scroll', onScroll)
                window.removeEventListener('resize', onScroll)
                if (raf) cancelAnimationFrame(raf)
            }
        }

        return cleanupScrollDot
    }, [H, projects, isMobile, rowMetrics])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <PageIntro
                    heading={heading}
                    eyebrow={eyebrow}
                    paragraphs={introParagraphs}
                    headingClassName={styles.heading}
                    eyebrowClassName={styles.eyebrow}
                    paragraphClassName={styles.blurb}
                />
            </header>

            <div
                className={styles.grid}
                ref={gridRef}
                style={
                    isMobile
                        ? undefined
                        : {
                              gridTemplateRows: `repeat(${Math.max(1, projects.length)}, minmax(${ROW_MIN_H_DESKTOP}px, auto))`,
                          }
                }
            >
                <svg className={styles.rail} ref={railRef} aria-hidden />

                {projects.map((p, i) => {
                    const imageLeft = i % 2 === 0

                    const figure = (
                        <figure
                            key="figure"
                            className={`${styles.figure} ${imageLeft ? styles.sideLeft : styles.sideRight}`}
                            style={{ gridRow: i + 1 }}
                        >
                            <div className={styles.frame}>
                                {p.image ? (
                                    <Image
                                        src={p.image}
                                        alt={p.imageAlt || p.title}
                                        fill
                                        sizes="(max-width: 900px) 100vw, clamp(320px, 30vw, 520px)"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <span>{p.imageAlt || p.title}</span>
                                    </div>
                                )}
                            </div>
                        </figure>
                    )

                    const article = (
                        <article
                            key="article"
                            className={`${styles.article} ${imageLeft ? styles.sideRight : styles.sideLeft}`}
                            style={{ gridRow: i + 1 }}
                        >
                            <div className={styles.year}>{p.year}</div>
                            <h2 className={styles.title}>{p.title}</h2>
                            <p className={styles.desc}>{p.description}</p>
                            <ArrowLink className={styles.cta} href={p.link} external>
                                EXPLORE&nbsp;PROJECT
                            </ArrowLink>
                        </article>
                    )

                    return (
                        <div
                            key={i}
                            className={styles.row}
                            style={{ gridRow: i + 1 }}
                            ref={(el) => {
                                rowRefs.current[i] = el
                            }}
                        >
                            {imageLeft ? [figure, article] : [article, figure]}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
