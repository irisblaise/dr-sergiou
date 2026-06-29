'use client'

import { useEffect, useRef } from 'react'
import BrainAnimation from '../../components/BrainAnimation/brainAnimation'
import { heroIntro, passions } from '../../data/home'
import styles from './Home.module.scss'

const NS = 'http://www.w3.org/2000/svg'

export default function Home() {
    const wrapRef = useRef<HTMLDivElement>(null)
    const spineRef = useRef<SVGSVGElement>(null)
    const brainRef = useRef<HTMLDivElement>(null)

    // Emphasise the leading "Hello there," in Ink (first paragraph only).
    const [firstIntro, ...restIntro] = heroIntro
    const lead = 'Hello there,'
    const firstTail = firstIntro.startsWith(lead) ? firstIntro.slice(lead.length) : firstIntro

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // Mutable spine state shared between build + reveal.
        let spinePaths: SVGPathElement[] = []
        let spineNodes: SVGCircleElement[] = []
        let spineMain: SVGPathElement | null = null
        let spineClipRect: SVGRectElement | null = null
        let spineH = 0
        let spineTop = 0
        let spineSpan = 1
        let spineReady = false

        const buildSpine = () => {
            const wrap = wrapRef.current
            const svg = spineRef.current
            if (!wrap || !svg) {
                window.setTimeout(buildSpine, 120)
                return
            }
            const W = wrap.clientWidth
            const H = wrap.clientHeight
            if (H < 500 || W < 200) {
                window.setTimeout(buildSpine, 140)
                return
            }
            spineH = H
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
            svg.setAttribute('preserveAspectRatio', 'none')
            while (svg.firstChild) svg.removeChild(svg.firstChild)

            // Mobile uses a left-gutter thread (axis x=30); desktop centres the spine.
            const mobile = window.matchMedia('(max-width: 900px)').matches
            const centerX = mobile ? 30 : W * 0.5 - 16
            let seed = 4451
            const rng = () => {
                seed = (seed * 1664525 + 1013904223) >>> 0
                return seed / 4294967296
            }
            spinePaths = []
            spineNodes = []

            const GREEN = '#7aab96'
            const addPath = (d: string, w?: number, col?: string) => {
                const p = document.createElementNS(NS, 'path')
                p.setAttribute('d', d)
                p.setAttribute('fill', 'none')
                p.setAttribute('stroke', col || GREEN)
                p.setAttribute('stroke-width', (w || 1).toFixed(2))
                p.setAttribute('stroke-linecap', 'round')
                p.setAttribute('stroke-linejoin', 'round')
                svg.appendChild(p)
                spinePaths.push(p)
                return p
            }

            // section connection points — anchored to each No.X label
            const wr = wrap.getBoundingClientRect()
            const pts: { x: number; left: number; y: number; side: string; label: string }[] = []
            wrap.querySelectorAll<HTMLElement>('[data-side]').forEach((pt) => {
                const r = pt.getBoundingClientRect()
                const side = pt.dataset.side
                const x = (side === 'left' ? r.right : r.left) - wr.left
                const label = pt.firstElementChild
                const lr = label ? label.getBoundingClientRect() : r
                const y = lr.top + lr.height / 2 - wr.top
                pts.push({
                    x,
                    left: r.left - wr.left,
                    y,
                    side: side || 'left',
                    label: label ? (label.textContent || '').trim() : '',
                })
            })
            pts.sort((a, b) => a.y - b.y)

            // PCB greens + accent, matching the brain
            const G1 = '#3f5e50'
            const G2 = '#5d8a74'
            const SAGE = '#7aab96'
            const ACC =
                getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
                '#ED4C92'

            // end the spine just above the closing line
            let endY = H - 30
            const endEl = wrap.querySelector('[data-spine-end]')
            if (endEl) endY = endEl.getBoundingClientRect().top - wr.top - 8
            const maxY = endY
            const AXIS = centerX
            const COLR = mobile ? 0 : Math.min(42, W * 0.04)
            const LO = mobile ? 9 : centerX - COLR
            const HI = mobile ? 52 : centerX + COLR
            const clampC = (x: number) => Math.max(LO, Math.min(HI, x))

            const halo = (x: number, y: number, r: number, col?: string) => {
                const c = document.createElementNS(NS, 'circle')
                c.setAttribute('cx', x.toFixed(1))
                c.setAttribute('cy', y.toFixed(1))
                c.setAttribute('r', r.toFixed(1))
                c.setAttribute('fill', col || SAGE)
                c.setAttribute('opacity', '0')
                c.style.filter = 'blur(5px)'
                ;(c as any).__glow = true
                ;(c as any).__dur = (2.8 + rng() * 1.8).toFixed(2)
                svg.appendChild(c)
                spineNodes.push(c)
                return c
            }
            const pinkCore = (x: number, y: number, r: number) => {
                const c = document.createElementNS(NS, 'circle')
                c.setAttribute('cx', x.toFixed(1))
                c.setAttribute('cy', y.toFixed(1))
                c.setAttribute('r', r.toFixed(1))
                c.setAttribute('fill', ACC)
                ;(c as any).__pulse = true
                ;(c as any).__dur = (3 + rng() * 1.2).toFixed(2)
                svg.appendChild(c)
                spineNodes.push(c)
                return c
            }

            const route = (
                axis: number,
                amp: number,
                runMin: number,
                runVar: number,
                jogMin: number,
                jogVar: number,
                startX: number | null,
                startY: number,
            ) => {
                const sy = startY || 0
                const P = [{ x: startX == null ? axis : startX, y: sy }]
                let x = P[0].x
                let y = sy
                while (y < maxY) {
                    y = Math.min(maxY, y + (runMin + rng() * runVar))
                    P.push({ x, y })
                    if (y >= maxY) break
                    const dir = x < axis - amp ? 1 : x > axis + amp ? -1 : rng() < 0.5 ? -1 : 1
                    const adv = Math.min(maxY - y, jogMin + rng() * jogVar)
                    y += adv
                    x = clampC(x + dir * adv)
                    P.push({ x, y })
                }
                return P
            }

            const node = (x: number, y: number, r: number, mode: string, col?: string) => {
                const c = document.createElementNS(NS, 'circle')
                c.setAttribute('cx', x.toFixed(1))
                c.setAttribute('cy', y.toFixed(1))
                c.setAttribute('r', r.toFixed(1))
                c.setAttribute('fill', mode === 'fill' ? col || G1 : '#efeae0')
                c.setAttribute('stroke', col || G1)
                c.setAttribute('stroke-width', (r > 5 ? 1.7 : 1.4).toFixed(1))
                svg.appendChild(c)
                spineNodes.push(c)
                return c
            }
            const hook = (x: number, y: number, r: number) => {
                const a0 = rng() * Math.PI * 2
                const a1 = a0 + Math.PI * (0.85 + rng() * 0.5)
                addPath(
                    `M ${(x + Math.cos(a0) * r).toFixed(1)} ${(y + Math.sin(a0) * r).toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(x + Math.cos(a1) * r).toFixed(1)} ${(y + Math.sin(a1) * r).toFixed(1)}`,
                    1.0,
                    rng() < 0.5 ? SAGE : G2,
                )
            }

            // 1) main conductor — desktop begins at the brain base; mobile at the top
            let startSpineY = 0
            const brEl = brainRef.current
            if (brEl && !mobile) {
                const sr = brEl.getBoundingClientRect()
                startSpineY = sr.bottom - wr.top - 24
            }
            const cp = mobile
                ? route(AXIS, 8, 40, 70, 12, 22, AXIS, 0)
                : route(AXIS, 16, 50, 80, 16, 38, null, startSpineY)
            if (cp.length > 2) {
                cp[cp.length - 1].x = AXIS
                cp[cp.length - 2].x = AXIS
            }
            const spineXAt = (y: number) => {
                for (let i = 1; i < cp.length; i++) {
                    if (y <= cp[i].y) {
                        const a = cp[i - 1]
                        const b = cp[i]
                        const t = (y - a.y) / Math.max(1, b.y - a.y)
                        return a.x + (b.x - a.x) * t
                    }
                }
                return cp[cp.length - 1].x
            }
            let dM = ''
            for (let i = 0; i < cp.length; i++)
                dM += (i ? ' L ' : 'M ') + cp[i].x.toFixed(1) + ' ' + cp[i].y.toFixed(1)
            const pMain = addPath(dM, mobile ? 1.8 : 1.9, G1)
            spineMain = pMain

            // travelling pulses of light, clipped to the revealed span
            if (!reduced) {
                const Lm = pMain.getTotalLength() || 1
                const clipId = 'spineclip_' + (seed >>> 0).toString(36)
                const clip = document.createElementNS(NS, 'clipPath')
                clip.setAttribute('id', clipId)
                const crect = document.createElementNS(NS, 'rect')
                crect.setAttribute('x', '0')
                crect.setAttribute('y', '0')
                crect.setAttribute('width', W.toFixed(1))
                crect.setAttribute('height', '0')
                clip.appendChild(crect)
                svg.appendChild(clip)
                spineClipRect = crect
                const addPulse = (
                    len: number,
                    col: string,
                    w: number,
                    dur: number,
                    delay: number,
                    glow: boolean,
                ) => {
                    const q = document.createElementNS(NS, 'path')
                    q.setAttribute('d', dM)
                    q.setAttribute('fill', 'none')
                    q.setAttribute('stroke', col)
                    q.setAttribute('stroke-width', String(w))
                    q.setAttribute('stroke-linecap', 'round')
                    q.setAttribute('clip-path', `url(#${clipId})`)
                    q.style.strokeDasharray = `${len} ${Lm}`
                    if (glow) q.style.filter = `drop-shadow(0 0 5px ${col})`
                    q.animate(
                        [{ strokeDashoffset: Lm + len }, { strokeDashoffset: -len }],
                        { duration: dur, iterations: Infinity, easing: 'linear', delay },
                    )
                    svg.appendChild(q)
                }
                if (mobile) {
                    addPulse(22, ACC, 2.4, 5200, 0, true)
                    addPulse(13, SAGE, 1.7, 6900, 2400, false)
                } else {
                    addPulse(26, ACC, 2.6, 5200, 0, true)
                    addPulse(15, SAGE, 1.8, 6900, 2400, false)
                }
            }

            const branch = (y: number, dir: number, w?: number) => {
                const sx = spineXAt(y)
                let x = sx
                let yy = y
                let d = `M ${sx.toFixed(1)} ${y.toFixed(1)}`
                if (rng() < 0.55) {
                    const diag = 12 + rng() * 24
                    yy += diag
                    x = clampC(x + dir * diag)
                    d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`
                }
                const reach = clampC(x + dir * (20 + rng() * 42))
                if (rng() < 0.4) {
                    const jy = yy + (rng() < 0.5 ? -1 : 1) * (12 + rng() * 22)
                    const mx = clampC(x + (reach - x) * 0.5)
                    d += ` L ${mx.toFixed(1)} ${yy.toFixed(1)} L ${mx.toFixed(1)} ${jy.toFixed(1)} L ${reach.toFixed(1)} ${jy.toFixed(1)}`
                    yy = jy
                } else {
                    d += ` L ${reach.toFixed(1)} ${yy.toFixed(1)}`
                }
                addPath(d, w || 1.3, rng() < 0.82 ? G1 : G2)
                return { x: reach, y: yy }
            }

            if (mobile) {
                // connectors: jog out of the left gutter to each No.X label
                pts.forEach((pn) => {
                    const sx = spineXAt(pn.y)
                    const armX = Math.min(HI, pn.left - 8)
                    const jogY = pn.y + (rng() < 0.5 ? -1 : 1) * (5 + rng() * 7)
                    addPath(
                        `M ${sx.toFixed(1)} ${pn.y.toFixed(1)} L ${sx.toFixed(1)} ${jogY.toFixed(1)} L ${armX.toFixed(1)} ${jogY.toFixed(1)}`,
                        1.4,
                        G1,
                    )
                    halo(armX, jogY, 11, ACC)
                    node(armX, jogY, 5, 'ring', G1)
                    pinkCore(armX, jogY, 2.7)
                })
                // short branches off the gutter
                const BRm = Math.round(H / 130)
                for (let k = 0; k < BRm; k++) {
                    const yy = 44 + (k / BRm) * (maxY - 88) + (rng() - 0.5) * 30
                    const sx = spineXAt(yy)
                    const dir = sx < AXIS ? 1 : -1
                    const diag = 10 + rng() * 14
                    const jy = yy + diag
                    const mx = clampC(sx + dir * diag)
                    const reach = clampC(mx + dir * (8 + rng() * 16))
                    addPath(
                        `M ${sx.toFixed(1)} ${yy.toFixed(1)} L ${mx.toFixed(1)} ${jy.toFixed(1)} L ${reach.toFixed(1)} ${jy.toFixed(1)}`,
                        1.1,
                        rng() < 0.7 ? G1 : G2,
                    )
                    const big = rng() < 0.3
                    if (big) halo(reach, jy, 8)
                    node(
                        reach,
                        jy,
                        big ? 4.5 + rng() * 1.5 : 2.2 + rng() * 1.3,
                        big ? 'ring' : rng() < 0.5 ? 'fill' : 'ring',
                        big ? SAGE : G1,
                    )
                    if (rng() < 0.3) hook(clampC(sx - dir * (6 + rng() * 6)), yy - (5 + rng() * 7), 3 + rng() * 2.5)
                }
                // 45° ticks
                const TICKm = Math.round(H / 95)
                for (let k = 0; k < TICKm; k++) {
                    const yy = 34 + (k / TICKm) * (maxY - 68) + (rng() - 0.5) * 36
                    const sx = spineXAt(yy)
                    const dir = sx < AXIS ? 1 : -1
                    const len = 8 + rng() * 12
                    const ex = clampC(sx + dir * len)
                    const ey = yy + len
                    addPath(`M ${sx.toFixed(1)} ${yy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`, 1.0, G1)
                    if (rng() < 0.6) node(ex, ey, 1.8 + rng() * 1.2, rng() < 0.5 ? 'fill' : 'ring', G1)
                }
                // scattered hooks + rings
                const ORNm = Math.round(H / 140)
                for (let k = 0; k < ORNm; k++) {
                    const yy = 30 + (k / ORNm) * (maxY - 60) + (rng() - 0.5) * 36
                    const dir = rng() < 0.5 ? -1 : 1
                    const ox = clampC(spineXAt(yy) + dir * (10 + rng() * 18))
                    if (rng() < 0.55) hook(ox, yy, 3 + rng() * 3)
                    else node(ox, yy, 2 + rng() * 2, 'ring', rng() < 0.5 ? G1 : G2)
                }
            } else {
                // 1b) traces running alongside, then peeling off to a node
                const PAR = Math.max(1, Math.round(H / 720))
                for (let k = 0; k < PAR; k++) {
                    const dir = rng() < 0.5 ? -1 : 1
                    const off = dir * (5 + rng() * 5)
                    const y0 = 40 + rng() * (maxY * 0.72)
                    const yend = Math.min(maxY - 30, y0 + (70 + rng() * 150))
                    let d = ''
                    let started = false
                    for (let yy = y0; yy <= yend; yy += 16) {
                        const x = clampC(spineXAt(yy) + off)
                        d += (started ? ' L ' : 'M ') + x.toFixed(1) + ' ' + yy.toFixed(1)
                        started = true
                    }
                    const reach = clampC(spineXAt(yend) + off + dir * (22 + rng() * 34))
                    d += ` L ${reach.toFixed(1)} ${yend.toFixed(1)}`
                    addPath(d, 1.2, G1)
                    node(reach, yend, rng() < 0.5 ? 3 : 4.5, rng() < 0.5 ? 'fill' : 'ring', G1)
                }

                // 2) connectors out to each numbered section, landing on the No.X label
                pts.forEach((pn) => {
                    const dir = pn.side === 'left' ? -1 : 1
                    const sx = spineXAt(pn.y)
                    const lengthen = pn.label === 'No.5' ? 24 : 0
                    const endX = pn.x - dir * 18 + dir * lengthen
                    const mx = clampC(sx + dir * 18)
                    addPath(
                        `M ${sx.toFixed(1)} ${pn.y.toFixed(1)} L ${mx.toFixed(1)} ${pn.y.toFixed(1)} L ${endX.toFixed(1)} ${pn.y.toFixed(1)}`,
                        1.5,
                        G1,
                    )
                    halo(endX, pn.y, 12, ACC)
                    node(endX, pn.y, 6, 'ring', G1)
                    pinkCore(endX, pn.y, 3.2)
                })

                // 3) branches both sides ending in ring / filled nodes
                const BR = Math.round(H / 175)
                for (let k = 0; k < BR; k++) {
                    const yy = 46 + (k / BR) * (maxY - 92) + (rng() - 0.5) * 34
                    const dir = k % 2 === 0 ? -1 : 1
                    const e = branch(yy, dir, 1.3)
                    const big = rng() < 0.35
                    if (big) halo(e.x, e.y, 9)
                    node(
                        e.x,
                        e.y,
                        big ? 5 + rng() * 2.5 : 2.4 + rng() * 1.6,
                        big ? 'ring' : rng() < 0.5 ? 'fill' : 'ring',
                        big ? SAGE : G1,
                    )
                    if (rng() < 0.25) hook(clampC(e.x - dir * (8 + rng() * 8)), e.y - (6 + rng() * 8), 3 + rng() * 3)
                }

                // 4) short 45-degree ticks with tiny terminals
                const TICK = Math.round(H / 130)
                for (let k = 0; k < TICK; k++) {
                    const yy = 34 + (k / TICK) * (maxY - 68) + (rng() - 0.5) * 40
                    const dir = rng() < 0.5 ? -1 : 1
                    const sx = spineXAt(yy)
                    const len = 10 + rng() * 20
                    const ex = clampC(sx + dir * len)
                    const ey = yy + len * (rng() < 0.5 ? -1 : 1)
                    addPath(`M ${sx.toFixed(1)} ${yy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`, 1.1, G1)
                    if (rng() < 0.6) node(ex, ey, 2 + rng() * 1.4, rng() < 0.5 ? 'fill' : 'ring', G1)
                }

                // 5) scattered hooks + small rings
                const ORN = Math.round(H / 180)
                for (let k = 0; k < ORN; k++) {
                    const yy = 30 + (k / ORN) * (maxY - 60) + (rng() - 0.5) * 40
                    const dir = rng() < 0.5 ? -1 : 1
                    const ox = clampC(spineXAt(yy) + dir * (20 + rng() * 36))
                    if (rng() < 0.55) hook(ox, yy, 4 + rng() * 4)
                    else node(ox, yy, 3 + rng() * 3, 'ring', rng() < 0.5 ? G1 : G2)
                }
            }

            // 6) tail terminal at the very bottom
            const tailX = AXIS
            halo(tailX, maxY, mobile ? 11 : 12, ACC)
            node(tailX, maxY, mobile ? 5 : 6, 'ring', G1)
            pinkCore(tailX, maxY, mobile ? 2.7 : 3.2)

            // cache doc-Y for scroll reveal
            const sY = window.scrollY || 0
            let topY = Infinity
            let botY = -Infinity
            spinePaths.forEach((p) => {
                const L = p.getTotalLength() || 1
                ;(p as any).__L = L
                p.style.strokeDasharray = String(L)
                p.style.strokeDashoffset = reduced ? '0' : String(L)
                const r = p.getBoundingClientRect()
                ;(p as any).__docY = r.top + sY
                ;(p as any).__h = r.height
                if ((p as any).__docY < topY) topY = (p as any).__docY
                if ((p as any).__docY + (p as any).__h > botY) botY = (p as any).__docY + (p as any).__h
            })
            spineNodes.forEach((c) => {
                c.style.opacity = reduced ? '1' : '0'
                c.style.transition = 'opacity .45s ease'
                ;(c as any).__docY = c.getBoundingClientRect().top + sY
                if ((c as any).__docY < topY) topY = (c as any).__docY
                if ((c as any).__docY > botY) botY = (c as any).__docY
            })
            spineTop = topY
            spineSpan = Math.max(1, botY - topY)
            spineReady = true
            updateSpine()
        }

        const updateSpine = () => {
            if (reduced || !spineReady) return
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
            const prog = Math.min(1, Math.max(0, (window.scrollY || 0) / maxScroll))
            const trig = spineTop + prog * (spineSpan * 1.05)
            for (let i = 0; i < spinePaths.length; i++) {
                const p = spinePaths[i] as any
                const denom = Math.max(70, (p.__h || 0) + 40)
                const local = Math.max(0, Math.min(1, (trig - p.__docY) / denom))
                p.style.strokeDashoffset = (p.__L * (1 - local)).toFixed(1)
            }
            for (let i = 0; i < spineNodes.length; i++) {
                const c = spineNodes[i] as any
                const on = c.__docY < trig
                if (c.__glow) {
                    if (on) {
                        if (!c.__breathing) {
                            c.style.animation = `glowpulse ${c.__dur || '3.3'}s ease-in-out infinite`
                            c.__breathing = true
                        }
                    } else if (c.__breathing) {
                        c.style.animation = 'none'
                        c.style.opacity = '0'
                        c.__breathing = false
                    }
                } else if (c.__pulse) {
                    if (on) {
                        if (!c.__breathing) {
                            c.style.animation = `nodepulse ${c.__dur || '3.2'}s ease-in-out infinite`
                            c.__breathing = true
                        }
                    } else if (c.__breathing) {
                        c.style.animation = 'none'
                        c.style.opacity = '0'
                        c.__breathing = false
                    }
                } else {
                    c.style.opacity = on ? '1' : '0'
                }
            }
            if (spineClipRect && spineMain) {
                const p = spineMain as any
                const local = Math.max(0, Math.min(1, (trig - p.__docY) / Math.max(70, (p.__h || 0) + 40)))
                const SH = spineH || 0
                const revealedBottom = local * SH + 6
                const wrapRect = wrapRef.current ? wrapRef.current.getBoundingClientRect() : null
                let top = 0
                let bottom = revealedBottom
                if (wrapRect) {
                    top = Math.max(0, -wrapRect.top - 40)
                    bottom = Math.min(revealedBottom, -wrapRect.top + window.innerHeight + 40)
                }
                const h = Math.max(0, bottom - top)
                spineClipRect.setAttribute('y', top.toFixed(1))
                spineClipRect.setAttribute('height', h.toFixed(1))
            }
        }

        const onScroll = () => updateSpine()
        let rt: number | undefined
        const onResize = () => {
            window.clearTimeout(rt)
            rt = window.setTimeout(buildSpine, 250)
        }

        buildSpine()
        const t1 = window.setTimeout(buildSpine, 400)
        const t2 = window.setTimeout(buildSpine, 1100)
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildSpine)
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)

        return () => {
            window.clearTimeout(t1)
            window.clearTimeout(t2)
            window.clearTimeout(rt)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <div className={styles.page} id="top">
            <div className={styles.wash} aria-hidden />

            {/* Brain stage */}
            <div className={styles.stage} aria-hidden>
                <div className={styles.glow} />
                <div className={styles.brainHost}>
                    <BrainAnimation />
                </div>
                {/* zero-height marker at the brain's visual base — the spine grows from here */}
                <div className={styles.brainBase} ref={brainRef} />
            </div>

            {/* Hero header */}
            <header className={styles.header}>
                <div className={styles.heroInner}>
                    <h1 className={styles.headline}>
                        The Never
                        <br />
                        Ending Exploration
                        <br />
                        of the Brain.
                    </h1>

                    <div className={styles.intro}>
                        <p>
                            <span className={styles.lead}>{lead}</span>
                            {firstTail}
                        </p>
                        {restIntro.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    <a href="#no1" className={styles.scrollCue}>
                        CONTINUE&nbsp;EXPLORING
                        <span className={styles.cueLine}>
                            <span className={styles.cueDot} />
                        </span>
                    </a>
                </div>
            </header>

            {/* Sections + spine */}
            <div className={styles.wrap} ref={wrapRef}>
                <svg className={styles.spine} ref={spineRef} aria-hidden />

                {passions.map((p, i) => {
                    const textLeft = i % 2 === 0
                    return (
                        <section
                            key={p.section}
                            id={i === 0 ? 'no1' : undefined}
                            className={`${styles.section} ${i === 0 ? styles.sectionFirst : ''}`}
                        >
                            <div className={styles.grid}>
                                <div
                                    className={styles.spinepoint}
                                    data-side={textLeft ? 'left' : 'right'}
                                    style={{ order: textLeft ? 1 : 2 }}
                                >
                                    <div className={styles.num}>{p.number}</div>
                                    <h2 className={styles.h2}>{p.title}</h2>
                                    <p className={styles.para}>{p.description}</p>
                                </div>
                                <div className={styles.media} style={{ order: textLeft ? 2 : 1 }}>
                                    <div className={styles.card}>
                                        <span className={styles.caption}>
                                            brain visual {p.number}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })}

                <div className={styles.spineEnd} data-spine-end>
                    <div className={styles.spineEndText}>The exploration never ends.</div>
                </div>
            </div>
        </div>
    )
}
