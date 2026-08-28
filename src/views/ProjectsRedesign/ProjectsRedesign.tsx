'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Project } from '../../data/types'
import styles from './ProjectsRedesign.module.scss'

// Circuit-timeline geometry — see ProjectsTimeline.dc.html (design handoff).
// Every project row is a fixed 400px grid track; the node for that row sits
// at its vertical centre, so the SVG conductor lines up with the content
// purely through arithmetic (no DOM measuring needed, unlike the old
// organic-spine version).
const ROW_H = 400
const NODE_LEAD = ROW_H * 0.76 // how far above a node its straight run ideally starts
const NODE_TRAIL = 80 // how far below a node its straight run continues before jogging
const JOG_SPAN = 36 // horizontal amplitude of the boxy jog between nodes, and its vertical run
const TAIL = 200 // headroom below the last node for the tail terminal
const AXIS = 95 // centre of the 190-wide timeline gutter (viewBox units)
const GUTTER_W = 190

// Branch-stub reach, in viewBox units — identical for every row, mirrored
// left/right depending on which side that row's image sits on.
const BR_NEAR = 27
const BR_MID = 49
const BR_FAR = 85
const BR_VJOG = 22
const BR_SIMPLE = 35
const DOT_GAP = 5

const nodeY = (index: number) => ROW_H / 2 + index * ROW_H
const gridHeight = (count: number) => Math.max(1, count) * ROW_H

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

export default function ProjectsRedesign({ projects }: { projects: Project[] }) {
    const railRef = useRef<SVGSVGElement>(null)
    const H = gridHeight(projects.length)

    useEffect(() => {
        const svg = railRef.current
        const n = projects.length
        if (!svg || !n) return

        const NS = 'http://www.w3.org/2000/svg'
        const root = getComputedStyle(document.documentElement)
        const read = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback
        const CANVAS = read('--canvas', '#efeae1')
        const G1 = read('--sage-deep', '#3f5e50')
        const G2 = read('--sage-mid', '#5d8a74')
        const SAGE = read('--sage', '#7aab96')
        const ACC = read('--accent', '#ed4c92')
        const PINK = read('--accent-mid', '#c8326f')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        svg.setAttribute('viewBox', `0 0 ${GUTTER_W} ${H}`)
        while (svg.firstChild) svg.removeChild(svg.firstChild)

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

        const ys = projects.map((_, i) => nodeY(i))
        const top = Math.max(20, ys[0] - NODE_LEAD)
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
        path(dMain, 1.6, G1, 0.8)
        circ(AXIS, top, 3, { fill: G1, 'fill-opacity': 0.8 })

        // Ghost rail — faint parallel shadow, offset and clipped shorter.
        const ghost = clipPolyline(P.map((p) => ({ x: p.x - 7, y: p.y })), top + 40, bottom - 45)
        if (ghost.length > 1) path(pointsToPath(ghost), 1, G1, 0.22)

        // Two pulses of light travelling the conductor, drifting apart over
        // time — pathLength normalizes the dash math regardless of how long
        // the generated conductor actually is.
        if (!reduced) {
            const pulse = (dasharray: string, col: string, w: number, dur: number, glow: boolean) => {
                const q = path(dMain, w, col, 1)
                q.setAttribute('pathLength', '2000')
                q.style.strokeDasharray = dasharray
                q.style.strokeLinecap = 'round'
                if (glow) q.style.filter = `drop-shadow(0 0 5px ${col})`
                q.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -2060 }], {
                    duration: dur,
                    iterations: Infinity,
                    easing: 'linear',
                })
            }
            pulse('70 2000', ACC, 2, 5200, true)
            pulse('40 2000', SAGE, 1.6, 6900, false)
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

            elaborate(imageLeft ? -1 : 1)
            simple(imageLeft ? 1 : -1)

            if (i === 0) {
                const halo = circ(AXIS, y, 20, { fill: ACC })
                halo.style.filter = 'blur(9px)'
                halo.style.transformOrigin = `${AXIS}px ${y}px`
                if (!reduced) halo.style.animation = 'haloThrob 3.4s ease-in-out infinite'
                circ(AXIS, y, 9, { fill: 'none', stroke: ACC, 'stroke-width': 1.4, 'stroke-opacity': 0.9 })
                const core = circ(AXIS, y, 4, { fill: ACC })
                core.style.transformOrigin = `${AXIS}px ${y}px`
                if (!reduced) core.style.animation = 'nodepulse 1.9s ease-in-out infinite'
            } else {
                const op = Math.max(0.3, 0.55 - i * 0.05)
                const halo = circ(AXIS, y, 13, { fill: ACC, 'fill-opacity': op })
                halo.style.filter = 'blur(7px)'
                circ(AXIS, y, 7.5, { fill: 'none', stroke: PINK, 'stroke-width': 1.2, 'stroke-opacity': 0.8 })
                circ(AXIS, y, 3.2, { fill: PINK })
            }
        })

        // Tail terminal, at the very bottom of the conductor.
        const tailHalo = circ(AXIS, bottom, 11, { fill: SAGE, 'fill-opacity': 0.12 })
        tailHalo.style.filter = 'blur(4px)'
        circ(AXIS, bottom, 3.4, { fill: CANVAS, stroke: SAGE, 'stroke-width': 1.6 })
    }, [H, projects])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.heading}>Projects</h1>
                <div className={styles.eyebrow}>TRACE&nbsp;THE&nbsp;JOURNEY</div>
                <p className={styles.blurb}>
                    A selection of milestones along the path of research, discovery, and real-world
                    impact.
                </p>
            </header>

            <div
                className={styles.grid}
                style={{ height: H, gridTemplateRows: `repeat(${Math.max(1, projects.length)}, ${ROW_H}px)` }}
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
                            <a className={styles.cta} href={p.link} target="_blank" rel="noopener noreferrer">
                                EXPLORE&nbsp;PROJECT <span aria-hidden>→</span>
                            </a>
                        </article>
                    )

                    return (
                        <div key={i} className={styles.row}>
                            {imageLeft ? [figure, article] : [article, figure]}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
