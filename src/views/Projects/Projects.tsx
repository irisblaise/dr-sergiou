'use client'

import { useEffect, useRef } from 'react'
import type { Project } from '../../data/types'
import styles from './Projects.module.scss'

const H = 1526 // fixed timeline canvas height (matches the design)

export default function Projects({ projects }: { projects: Project[] }) {
    const timelineRef = useRef<HTMLDivElement>(null)
    const railRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const cont = timelineRef.current
        const svg = railRef.current
        if (!cont || !svg) return

        const NS = 'http://www.w3.org/2000/svg'
        const G1 = '#3f5e50'
        const G2 = '#5d8a74'
        const SAGE = '#7aab96'
        const AXIS = 150
        const COLR = 24
        const clampC = (x: number) => Math.max(AXIS - COLR, Math.min(AXIS + COLR, x))

        // Reads the project rows, positions them off their node anchor, returns sorted node Ys.
        const positionRows = (): number[] => {
            const rows = Array.from(cont.querySelectorAll<HTMLElement>('[data-node]'))
            rows.forEach((r) => {
                const n = +(r.dataset.node || 0)
                if (n) r.style.top = n - 42 + 'px'
            })
            return rows
                .map((r) => +(r.dataset.node || 0))
                .filter(Boolean)
                .sort((a, b) => a - b)
        }

        // Delicate organic spine, in the spirit of the landing-page neuron spine.
        const buildSpine = () => {
            const nodeYs = positionRows()
            if (!nodeYs.length) {
                window.setTimeout(buildSpine, 120)
                return
            }
            const W = cont.clientWidth
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
            while (svg.firstChild) svg.removeChild(svg.firstChild)

            const ACC =
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--accent')
                    .trim() || '#ED4C92'

            // Deterministic LCG — organic look, identical every render.
            let seed = 4451
            const rng = () => {
                seed = (seed * 1664525 + 1013904223) >>> 0
                return seed / 4294967296
            }

            const path = (d: string, w: number, col: string, op?: number) => {
                const p = document.createElementNS(NS, 'path')
                p.setAttribute('d', d)
                p.setAttribute('fill', 'none')
                p.setAttribute('stroke', col)
                p.setAttribute('stroke-width', String(w))
                p.setAttribute('stroke-linecap', 'round')
                p.setAttribute('stroke-linejoin', 'round')
                if (op != null) p.setAttribute('opacity', String(op))
                svg.appendChild(p)
                return p
            }
            const circ = (
                x: number,
                y: number,
                r: number,
                attrs: Record<string, string | number>,
            ) => {
                const c = document.createElementNS(NS, 'circle')
                c.setAttribute('cx', x.toFixed(1))
                c.setAttribute('cy', y.toFixed(1))
                c.setAttribute('r', (+r).toFixed(1))
                for (const k in attrs) c.setAttribute(k, String(attrs[k]))
                svg.appendChild(c)
                return c
            }

            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            const top = 24
            const bot = H - 26

            // 1) single weaving conductor (vertical runs + gentle 45-deg jogs)
            const P = [{ x: AXIS, y: top }]
            let x = AXIS
            let y = top
            while (y < bot) {
                y = Math.min(bot, y + (44 + rng() * 72))
                P.push({ x, y })
                if (y >= bot) break
                const dir =
                    x < AXIS - COLR * 0.5 ? 1 : x > AXIS + COLR * 0.5 ? -1 : rng() < 0.5 ? -1 : 1
                const adv = Math.min(bot - y, 18 + rng() * 38)
                y += adv
                x = clampC(x + dir * adv)
                P.push({ x, y })
            }
            const xAt = (yy: number) => {
                for (let i = 1; i < P.length; i++) {
                    if (yy <= P[i].y) {
                        const a = P[i - 1]
                        const b = P[i]
                        const t = (yy - a.y) / Math.max(1, b.y - a.y)
                        return a.x + (b.x - a.x) * t
                    }
                }
                return P[P.length - 1].x
            }
            let dM = ''
            P.forEach((p, i) => (dM += (i ? ' L ' : 'M ') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)))
            const pMain = path(dM, 1.6, G1, 0.85)

            // 2) a faint parallel trace alongside
            let dP = ''
            P.forEach(
                (p, i) => (dP += (i ? ' L ' : 'M ') + (p.x + 6).toFixed(1) + ' ' + p.y.toFixed(1)),
            )
            path(dP, 1, SAGE, 0.3)

            // 2b) travelling pulses of light running down the conductor
            if (!reduced) {
                const L = pMain.getTotalLength() || 1
                const pulse = (
                    len: number,
                    col: string,
                    w: number,
                    dur: number,
                    delay: number,
                    glow: boolean,
                ) => {
                    const q = path(dM, w, col, 1)
                    q.setAttribute('stroke-linecap', 'round')
                    q.style.strokeDasharray = `${len} ${L}`
                    if (glow) q.style.filter = `drop-shadow(0 0 5px ${col})`
                    q.animate(
                        [{ strokeDashoffset: L + len }, { strokeDashoffset: -len }],
                        { duration: dur, iterations: Infinity, easing: 'linear', delay },
                    )
                    return q
                }
                pulse(22, ACC, 2.6, 5200, 0, true)
                pulse(13, SAGE, 1.8, 6900, 2400, false)
            }

            // 3) sparse 45-deg ticks with tiny terminals
            const TICK = Math.round(H / 82)
            for (let k = 0; k < TICK; k++) {
                const yy = top + (k / TICK) * (bot - top) + (rng() - 0.5) * 28
                const dir = rng() < 0.5 ? -1 : 1
                const sx = xAt(yy)
                const len = 8 + rng() * 15
                const ex = clampC(sx + dir * len)
                const ey = yy + (rng() < 0.5 ? -1 : 1) * len * 0.6
                path(`M ${sx.toFixed(1)} ${yy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`, 1, G1, 0.42)
                if (rng() < 0.5)
                    circ(ex, ey, 1.3 + rng() * 1.1, {
                        fill: rng() < 0.5 ? G1 : '#efeae0',
                        stroke: G1,
                        'stroke-width': 1,
                        opacity: 0.5,
                    })
            }

            // 4) scattered open hooks
            const ORN = Math.round(H / 165)
            for (let k = 0; k < ORN; k++) {
                const yy = top + (k / ORN) * (bot - top) + (rng() - 0.5) * 30
                const dir = rng() < 0.5 ? -1 : 1
                const ox = clampC(xAt(yy) + dir * (15 + rng() * 20))
                const r = 3 + rng() * 3
                const a0 = rng() * 6.28
                const a1 = a0 + 3.0
                path(
                    `M ${(ox + Math.cos(a0) * r).toFixed(1)} ${(yy + Math.sin(a0) * r).toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(ox + Math.cos(a1) * r).toFixed(1)} ${(yy + Math.sin(a1) * r).toFixed(1)}`,
                    1,
                    rng() < 0.5 ? SAGE : G2,
                    0.4,
                )
            }

            // 4b) branches peeling off the conductor out to small terminals
            const BR = Math.round(H / 108)
            for (let k = 0; k < BR; k++) {
                const yy = top + (k / BR) * (bot - top) + (rng() - 0.5) * 30
                const dir = k % 2 === 0 ? -1 : 1
                const sx = xAt(yy)
                let bx = sx
                let by = yy
                let d = `M ${sx.toFixed(1)} ${yy.toFixed(1)}`
                if (rng() < 0.6) {
                    const diag = 10 + rng() * 18
                    by += diag
                    bx = clampC(bx + dir * diag)
                    d += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`
                }
                const reach = clampC(bx + dir * (16 + rng() * 30))
                d += ` L ${reach.toFixed(1)} ${by.toFixed(1)}`
                path(d, 1.1, rng() < 0.8 ? G1 : G2, 0.5)
                const big = rng() < 0.3
                circ(reach, by, big ? 3 + rng() * 1.4 : 1.6 + rng() * 1.1, {
                    fill: big ? '#efeae0' : rng() < 0.5 ? G1 : '#efeae0',
                    stroke: rng() < 0.5 ? G1 : SAGE,
                    'stroke-width': 1.1,
                    opacity: 0.55,
                })
                if (rng() < 0.22) {
                    const r2 = 3 + rng() * 2.5
                    const a0 = rng() * 6.28
                    const a1 = a0 + 3.0
                    path(
                        `M ${(reach + Math.cos(a0) * r2).toFixed(1)} ${(by + Math.sin(a0) * r2).toFixed(1)} A ${r2.toFixed(1)} ${r2.toFixed(1)} 0 0 1 ${(reach + Math.cos(a1) * r2).toFixed(1)} ${(by + Math.sin(a1) * r2).toFixed(1)}`,
                        1,
                        SAGE,
                        0.4,
                    )
                }
            }

            // 5) per-project markers: year tick (left), branch to text (right), halo + ring + core
            nodeYs.forEach((ny, i) => {
                const sx = xAt(ny)
                path(`M ${sx.toFixed(1)} ${ny} L ${(AXIS - 62).toFixed(1)} ${ny}`, 1.2, G1, 0.45)
                const jy = ny + (rng() < 0.5 ? -1 : 1) * 8
                path(
                    `M ${sx.toFixed(1)} ${ny} L ${(AXIS + 30).toFixed(1)} ${ny} L ${(AXIS + 30).toFixed(1)} ${jy} L ${(AXIS + 56).toFixed(1)} ${jy}`,
                    1.2,
                    G1,
                    0.5,
                )
                const halo = circ(sx, ny, 13, { fill: ACC, opacity: 0.13 })
                halo.style.filter = 'blur(4px)'
                circ(sx, ny, 6, { fill: '#efeae0', stroke: G1, 'stroke-width': 1.7 })
                const core = circ(sx, ny, 3, { fill: ACC })
                if (i < 5)
                    core.style.animation = `nodepulse ${(3 + i * 0.25).toFixed(2)}s ease-in-out ${(i * 0.2).toFixed(2)}s infinite`
                else core.setAttribute('opacity', '.7')
            })

            // 6) tail terminal
            const tx = xAt(bot)
            const th = circ(tx, bot, 11, { fill: SAGE, opacity: 0.12 })
            th.style.filter = 'blur(4px)'
            circ(tx, bot, 3.4, { fill: '#efeae0', stroke: SAGE, 'stroke-width': 1.6 })
        }

        buildSpine()
        const t = window.setTimeout(buildSpine, 360)
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildSpine)
        const onResize = () => buildSpine()
        window.addEventListener('resize', onResize)

        return () => {
            window.clearTimeout(t)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.heading}>Projects</h1>
                <div className={styles.eyebrow}>A&nbsp;JOURNEY&nbsp;OF&nbsp;DISCOVERY</div>
                <p className={styles.blurb}>
                    From early questions to future possibilities. Each project builds on the last.
                </p>
            </header>

            <div className={styles.timeline} ref={timelineRef}>
                {/* Procedurally-drawn organic spine (buildSpine) */}
                <svg className={styles.rail} ref={railRef} aria-hidden />

                {/* Project rows — anchored to the same node Ys the spine markers use */}
                {projects.map((p, i) => (
                    <div
                        key={i}
                        className={styles.trow}
                        data-node={p.node}
                        style={{ top: p.node - 42 }}
                    >
                        <div className={styles.year}>{p.year}</div>
                        <div className={styles.text}>
                            <h3 className={styles.title}>{p.title}</h3>
                            <div className={styles.dates}>{p.dateRange}</div>
                            <p className={styles.desc}>{p.description}</p>
                            <a
                                className={styles.cta}
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                VIEW&nbsp;PROJECT <span aria-hidden>→</span>
                            </a>
                        </div>
                        <div className={styles.illu}>
                            {p.image ? (
                                <img src={p.image} alt={p.title} loading="lazy" />
                            ) : (
                                <div className={styles.placeholder}>
                                    <span>Brain · circuit sketch</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
