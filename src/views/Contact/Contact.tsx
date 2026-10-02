'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import type { PageContent } from '../../sanity/lib/queries'
import { CARD_QUERY } from '../../styles/breakpoints'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'
import { useRecomputeOnResize } from '../../lib/useRecomputeOnResize'
import { resolvePageIntro } from '../../lib/pageIntro'
import PageIntro from '../../components/ui/PageIntro/PageIntro'
import ArrowLink from '../../components/ui/ArrowLink/ArrowLink'
import portrait from '../../../public/assets/contact/carmen.webp'
import styles from './Contact.module.scss'

// Conductor geometry — see contact-neuro-photo.html (design handoff): a
// signal leaves the eyebrow, descends past the intro paragraph, runs flat
// through her two hands (picking up transfer nodes on the way), climbs a
// jogged vertical, and fans out from one junction into four branches, one
// per contact row. Unlike the handoff's prototype (a fixed 1440px canvas
// scaled uniformly), this port measures the real fluid layout directly, the
// same way ProjectsPage's timeline conductor does — the geometry is
// recomputed from live DOM rects rather than carried by a CSS transform.
const SVG_NS = 'http://www.w3.org/2000/svg'

// Hand positions as fractions of the portrait's rendered box. Carmen's
// hands sit close to the fractions the handoff tuned for its own cutout
// (~.49/.36 and ~.69/.37) since this sketch shares the same gesture — if
// the portrait is ever re-cropped, these two points need retuning — along
// with their copies in Contact.module.scss's --portrait-w / .blurb sizing.
const HAND_LEFT = { fx: 0.478, fy: 0.342 }
const HAND_RIGHT = { fx: 0.688, fy: 0.406 }

const DESCENT_CORNER = 32 // first 45° corner off the eyebrow
const ASCENT_JOG = 34 // amplitude of the ascent's double jog
const BRANCH_ELBOW = 10 // branch's final elbow into its row
const GHOST_OFFSET = 7 // ghost rail's offset from its parent run
const STUB_LEN = 21
const STUB_DOT = 26
const JUNCTION_CLEAR_NEAR = 48 // junction's minimum clearance from the exit hand
const JUNCTION_CLEAR_FAR = 104 // junction's minimum clearance from the nearest row label
const HAND_CORNER_CLEAR = 40 // entry hand's minimum distance past the descent's last corner
const JUNCTION_CLEAR_MIN = 40 // hard floor: the junction never gets closer to a label than this
const ENDPOINT_INSET = 4.4 // branch stops short by the endpoint ring's radius
const SAGE_SPEED = 0.146 // px/ms, ambient drift
const PINK_SPEED = 0.107 // px/ms, primary-contact charge
const SAGE_STAGGER = 1900
const PINK_DELAY = 2600
const HOVER_PULSE_MS = 1600

const FORNEUROTECH_URL = 'https://www.forneurotech.com/'

const DEFAULT_PRIMARY_VALUE = 'Research collaborations, talks and enquiries.'
const DEFAULT_PRIMARY_HREF = 'mailto:cs.sergiou@gmail.com'
const DEFAULT_FORNEUROTECH_VALUE = 'Interested in forensic neurotechnology?'
const DEFAULT_FORNEUROTECH_NOTE =
    'Explore the community website to follow the symposium, network and emerging research as the field evolves.'
const DEFAULT_FORNEUROTECH_HREF = 'mailto:forneurotech.network@gmail.com'
const DEFAULT_POSITION = 'Postdoctoral researcher'
const DEFAULT_INSTITUTION = 'Amsterdam UMC — Youth at Risk'
const DEFAULT_SOCIALS = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/carmensergiou' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0002-8107-5615' },
] as const

const emailLabel = (href: string) => href.replace(/^mailto:/i, '').toUpperCase()

type Point = { x: number; y: number }

function pointsToPath(points: Point[]): string {
    return points.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}

export default function Contact({ pageContent }: { pageContent?: PageContent | null }) {
    const { heading, eyebrow, paragraphs: introParagraphs } = resolvePageIntro(pageContent, {
        heading: 'Get in touch',
        eyebrow: "LET'S CONNECT",
        intro: [
            'For research collaborations, talks, interviews or anything at the crossroads of neuro & technology — reach out via any of the channels below.',
        ],
    })

    const details = pageContent?.contactDetails ?? []
    const primary = details[0]
    const forneurotech = details[1]
    const position = pageContent?.position ?? DEFAULT_POSITION
    const institution = pageContent?.institution ?? DEFAULT_INSTITUTION
    const socialLinks = pageContent?.socialLinks?.length ? pageContent.socialLinks : DEFAULT_SOCIALS

    const primaryHref = primary?.href ?? DEFAULT_PRIMARY_HREF
    const forneurotechHref = forneurotech?.href ?? DEFAULT_FORNEUROTECH_HREF
    const [instMain, instEm] = institution.split('—').map((s) => s.trim())

    const pageRef = useRef<HTMLDivElement>(null)
    const leftRef = useRef<HTMLDivElement>(null)
    const portraitRef = useRef<HTMLImageElement>(null)
    const wireRef = useRef<SVGSVGElement>(null)
    const row0Ref = useRef<HTMLDivElement>(null)
    const row1Ref = useRef<HTMLDivElement>(null)
    const row2Ref = useRef<HTMLDivElement>(null)
    const row3Ref = useRef<HTMLDivElement>(null)
    const label0Ref = useRef<HTMLDivElement>(null)
    const label1Ref = useRef<HTMLDivElement>(null)
    const label2Ref = useRef<HTMLDivElement>(null)
    const label3Ref = useRef<HTMLDivElement>(null)

    const build = useCallback(() => {
        const svg = wireRef.current
        const page = pageRef.current
        const left = leftRef.current
        const portraitEl = portraitRef.current
        if (!svg || !page || !left || !portraitEl) return

        while (svg.firstChild) svg.removeChild(svg.firstChild)
        // Clear last run's centring shift so the measurements below start
        // from the CSS-placed portrait.
        portraitEl.style.translate = ''
        // Mobile stacks into one column and drops the conductor entirely
        // (see Contact.module.scss's card-layout query) — the anchors below
        // don't correspond to anything meaningful once the grid collapses.
        if (window.matchMedia(CARD_QUERY).matches) return

        const rows = [row0Ref.current, row1Ref.current, row2Ref.current, row3Ref.current]
        const labels = [label0Ref.current, label1Ref.current, label2Ref.current, label3Ref.current]
        if (rows.some((r) => !r) || labels.some((l) => !l)) return

        const eyebrowEl = left.getElementsByClassName(styles.eyebrow)[0]
        const introEl = left.getElementsByClassName(styles.blurb)[0]
        if (!eyebrowEl || !introEl) return

        const mr = page.getBoundingClientRect()
        const rect = (el: Element) => {
            const b = el.getBoundingClientRect()
            return { x: b.left - mr.left, y: b.top - mr.top, w: b.width, h: b.height }
        }

        const root = getComputedStyle(document.documentElement)
        const token = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback
        const ACC = token('--accent', '#ed4c92')
        const PINK = token('--accent-mid', '#c02d69')
        const G1 = token('--sage-deep', '#3f5e50')
        const G2 = token('--sage-mid', '#5d8a74')
        const SAGE = token('--sage', '#7aab96')
        const CANVAS = token('--canvas', '#efeae1')
        const reduced = prefersReducedMotion()

        svg.setAttribute('viewBox', `0 0 ${mr.width} ${mr.height}`)

        // Explicit SVG <filter> defs rather than CSS blur()/drop-shadow() —
        // see ProjectsPage.tsx's identical comment: Safari clips the CSS
        // filter shorthand to a filter region sized off the shape's own
        // tiny bounding box, so the glow silently vanishes there (Chrome
        // doesn't clip the same way).
        const defs = document.createElementNS(SVG_NS, 'defs')
        svg.appendChild(defs)
        const blurFilter = (id: string, stdDeviation: number) => {
            const filter = document.createElementNS(SVG_NS, 'filter')
            filter.setAttribute('id', id)
            filter.setAttribute('color-interpolation-filters', 'sRGB')
            filter.setAttribute('x', '-500%')
            filter.setAttribute('y', '-500%')
            filter.setAttribute('width', '1100%')
            filter.setAttribute('height', '1100%')
            const blur = document.createElementNS(SVG_NS, 'feGaussianBlur')
            blur.setAttribute('stdDeviation', String(stdDeviation))
            filter.appendChild(blur)
            defs.appendChild(filter)
        }
        const dropShadowFilter = (id: string, color: string, stdDeviation: number) => {
            const filter = document.createElementNS(SVG_NS, 'filter')
            filter.setAttribute('id', id)
            filter.setAttribute('color-interpolation-filters', 'sRGB')
            filter.setAttribute('x', '-300%')
            filter.setAttribute('y', '-300%')
            filter.setAttribute('width', '700%')
            filter.setAttribute('height', '700%')
            const shadow = document.createElementNS(SVG_NS, 'feDropShadow')
            shadow.setAttribute('dx', '0')
            shadow.setAttribute('dy', '0')
            shadow.setAttribute('stdDeviation', String(stdDeviation))
            shadow.setAttribute('flood-color', color)
            filter.appendChild(shadow)
            defs.appendChild(filter)
        }
        blurFilter('contact-blur-7', 7)
        blurFilter('contact-blur-4', 4)
        dropShadowFilter('contact-glow-accent', ACC, 6)

        const path = (d: string, w: number, col: string, op?: number) => {
            const p = document.createElementNS(SVG_NS, 'path')
            p.setAttribute('d', d)
            p.setAttribute('fill', 'none')
            p.setAttribute('stroke', col)
            p.setAttribute('stroke-width', String(w))
            p.setAttribute('stroke-linecap', 'round')
            p.setAttribute('stroke-linejoin', 'round')
            if (op != null) p.setAttribute('stroke-opacity', String(op))
            svg.appendChild(p)
            return p
        }
        const circ = (x: number, y: number, r: number, attrs: Record<string, string | number>) => {
            const c = document.createElementNS(SVG_NS, 'circle')
            c.setAttribute('cx', x.toFixed(1))
            c.setAttribute('cy', y.toFixed(1))
            c.setAttribute('r', String(r))
            for (const k in attrs) c.setAttribute(k, String(attrs[k]))
            svg.appendChild(c)
            return c
        }

        const pinkNode = (x: number, y: number, s = 1) => {
            const h = circ(x, y, 13 * s, { fill: ACC, 'fill-opacity': 0.45 })
            h.setAttribute('filter', 'url(#contact-blur-7)')
            circ(x, y, 7.5 * s, { fill: 'none', stroke: PINK, 'stroke-width': 1.2, 'stroke-opacity': 0.8 })
            circ(x, y, 3.2 * s, { fill: PINK })
        }
        const sageNode = (x: number, y: number) => {
            circ(x, y, 4.4, { fill: 'none', stroke: G1, 'stroke-width': 1 })
            circ(x, y, 1.7, { fill: G2 })
        }
        const terminal = (x: number, y: number) => {
            const h = circ(x, y, 11, { fill: SAGE, 'fill-opacity': 0.12 })
            h.setAttribute('filter', 'url(#contact-blur-4)')
            circ(x, y, 3.4, { fill: CANVAS, stroke: SAGE, 'stroke-width': 1.6 })
        }
        const ghost = (points: Point[], dx: number, dy: number) =>
            path(pointsToPath(points.map((p) => ({ x: p.x + dx, y: p.y + dy }))), 1, G1, 0.22)
        const stub = (x: number, y: number, dir: 1 | -1) => {
            path(`M ${x.toFixed(1)} ${y.toFixed(1)} H ${(x + dir * STUB_LEN).toFixed(1)}`, 1, G1, 0.35)
            circ(x + dir * STUB_DOT, y, 2, { fill: SAGE })
        }
        const vstub = (x: number, y: number, dir: 1 | -1) => {
            path(`M ${x.toFixed(1)} ${y.toFixed(1)} V ${(y + dir * STUB_LEN).toFixed(1)}`, 1, G1, 0.35)
            circ(x, y + dir * STUB_DOT, 2, { fill: SAGE })
        }

        // One-off hover pulse: normalised via pathLength so the dash math
        // doesn't care how long the branch it's riding actually is.
        const travel = (d: string, col: string) => {
            if (reduced) return null
            const q = path(d, 1.6, col, 0.9)
            q.setAttribute('pathLength', '2000')
            q.style.strokeDasharray = '60 2000'
            q.setAttribute('filter', 'url(#contact-glow-accent)')
            q.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -2060 }], {
                duration: HOVER_PULSE_MS,
                iterations: Infinity,
                easing: 'linear',
            })
            return q
        }
        // Ambient drift: speed expressed in px/ms (via getTotalLength) so
        // every dot moves at the same rate regardless of its branch length.
        const travelPx = (
            d: string,
            col: string,
            len: number,
            w: number,
            speed: number,
            delay: number,
            glow: boolean,
            op = 1,
        ) => {
            if (reduced) return
            const q = path(d, w, col, op)
            const L = q.getTotalLength() || 1
            q.style.strokeDasharray = `${len} ${L}`
            if (glow) q.setAttribute('filter', 'url(#contact-glow-accent)')
            q.animate([{ strokeDashoffset: len }, { strokeDashoffset: -L }], {
                duration: (L + len) / speed,
                iterations: Infinity,
                easing: 'linear',
                delay,
            })
        }

        // ---------- measurements ----------
        const E = rect(eyebrowEl)
        const IN = rect(introEl)
        const P = rect(portraitEl)
        const A = rows.map((row, i) => {
            const b = rect(labels[i]!)
            return { x: b.x - 16, y: b.y + b.h / 2, el: row! }
        })

        const sx = E.x + E.w + 18
        const sy = E.y + E.h / 2
        const dc = DESCENT_CORNER
        const vx1 = Math.max(sx + dc + 70, IN.x + IN.w + 24)
        const minAx = Math.min(...A.map((a) => a.x))
        const jxFar = minAx - JUNCTION_CLEAR_FAR

        // Centre her hands on the flat hand run, which spans from the
        // descent's last corner (vx1) to the ascent's first (jx - 32). Both
        // ends come from measured text, so this can't be done in CSS — the
        // portrait is nudged here instead. Clamped so the entry hand doesn't
        // hug the descent corner and the exit hand doesn't crowd the junction.
        const handsMid = P.x + (P.w * (HAND_LEFT.fx + HAND_RIGHT.fx)) / 2
        const minShift = vx1 + HAND_CORNER_CLEAR - (P.x + P.w * HAND_LEFT.fx)
        const maxShift = jxFar - JUNCTION_CLEAR_NEAR - (P.x + P.w * HAND_RIGHT.fx)
        const shift = Math.min(Math.max((vx1 + jxFar - 32) / 2 - handsMid, minShift), Math.max(minShift, maxShift))
        portraitEl.style.translate = `${shift.toFixed(1)}px 0`
        P.x += shift

        const hl = { x: P.x + P.w * HAND_LEFT.fx, y: P.y + P.h * HAND_LEFT.fy }
        const hr = { x: P.x + P.w * HAND_RIGHT.fx, y: P.y + P.h * HAND_RIGHT.fy }
        const HY = (hl.y + hr.y) / 2

        // Never let the junction reach the labels — if the exit hand crowds
        // the right column, the near-hand clearance gives way first.
        const jx = Math.min(Math.max(hr.x + JUNCTION_CLEAR_NEAR, jxFar), minAx - JUNCTION_CLEAR_MIN)
        const jy = (A[1].y + A[2].y) / 2

        // ---------- 1. descent: eyebrow -> entry hand ----------
        const yA = Math.max(sy + dc + 60, IN.y + IN.h + 16)
        const JW = Math.max(44, Math.min(104, (HY - yA - 100) / 2))
        const vx2 = vx1 - JW
        // The double jog needs room between the intro's bottom and the hands;
        // when the window is short on it, drop straight down instead of
        // letting the jog fold back on itself.
        const useDescentJog = HY - yA >= JW * 2 + 20
        const descentPts: Point[] = useDescentJog
            ? [
                  { x: sx, y: sy },
                  { x: vx1 - dc, y: sy },
                  { x: vx1, y: sy + dc },
                  { x: vx1, y: yA },
                  { x: vx2, y: yA + JW },
                  { x: vx2, y: HY - JW },
                  { x: vx2 + JW, y: HY },
                  { x: hl.x, y: HY },
              ]
            : [
                  { x: sx, y: sy },
                  { x: vx1 - dc, y: sy },
                  { x: vx1, y: sy + dc },
                  { x: vx1, y: HY },
                  { x: hl.x, y: HY },
              ]
        const d1 = pointsToPath(descentPts)
        path(d1, 1.6, G1, 0.8)
        ghost(descentPts.slice(0, useDescentJog ? 6 : 4), -GHOST_OFFSET, 0)
        stub(vx1, (sy + dc + (useDescentJog ? yA : HY)) / 2, 1)
        if (useDescentJog) stub(vx2, (yA + JW + (HY - JW)) / 2, -1)
        terminal(sx, sy)

        // ---------- 2. hand run ----------
        const d2 = pointsToPath([
            { x: hl.x, y: HY },
            { x: hr.x, y: HY },
        ])
        path(d2, 1.6, G1, 0.8)
        ghost(
            [
                { x: hl.x + 14, y: HY + GHOST_OFFSET },
                { x: hr.x - 14, y: HY + GHOST_OFFSET },
            ],
            0,
            0,
        )
        vstub(hl.x + (hr.x - hl.x) * 0.39, HY, 1)
        vstub(hl.x + (hr.x - hl.x) * 0.61, HY, -1)
        ;[0.28, 0.5, 0.72].forEach((t) => sageNode(hl.x + (hr.x - hl.x) * t, HY))
        ;[hl, hr].forEach((p) => pinkNode(p.x, HY, 0.9))

        // ---------- 3. ascent: exit hand -> junction ----------
        const JOG = ASCENT_JOG
        const rise = HY - 32 - jy
        const useJog = rise > JOG * 3 + 60
        const jogA = jy + rise * 0.62
        const jogB = (jogA - JOG + jy + JOG) / 2
        const ascentPts: Point[] = useJog
            ? [
                  { x: hr.x, y: HY },
                  { x: jx - 32, y: HY },
                  { x: jx, y: HY - 32 },
                  { x: jx, y: jogA },
                  { x: jx - JOG, y: jogA - JOG },
                  { x: jx - JOG, y: jogB },
                  { x: jx, y: jogB - JOG },
                  { x: jx, y: jy },
              ]
            : [
                  { x: hr.x, y: HY },
                  { x: jx - 32, y: HY },
                  { x: jx, y: HY - 32 },
                  { x: jx, y: jy },
              ]
        const d3 = pointsToPath(ascentPts)
        path(d3, 1.6, G1, 0.8)
        ghost(ascentPts.slice(2), -GHOST_OFFSET, 0)
        stub(jx, useJog ? (HY - 32 + jogA) / 2 : (HY - 32 + jy) / 2, 1)
        if (useJog) stub(jx - JOG, (jogA - JOG + jogB) / 2, -1)

        const trunk = d1 + ' ' + d2.replace('M', 'L') + ' ' + d3.replace('M', 'L')

        // ---------- 4. junction -> four branches ----------
        pinkNode(jx, jy, 1.15)
        const endX = Math.min(...A.map((a) => a.x))
        const avail = Math.max(34, endX - 9 - jx)
        const LEG = BRANCH_ELBOW
        const below = A.filter((a) => a.y > jy).sort((p, q) => p.y - q.y)
        const above = A.filter((a) => a.y <= jy).sort((p, q) => q.y - p.y)
        const plan = [
            ...below.map((a, i) => ({ a, dir: 1 as const, o: avail * (0.46 - i * 0.14) })),
            ...above.map((a, i) => ({ a, dir: -1 as const, o: avail * (0.4 - i * 0.14) })),
        ]

        const branchPaths: string[] = []
        const primaryEl = rows[0]

        plan.forEach(({ a, dir, o: oRaw }) => {
            const o = Math.max(10, Math.min(oRaw, Math.abs(a.y - jy) - LEG - 6))
            const colx = jx + o
            const jogy = a.y - dir * LEG
            const d = pointsToPath([
                { x: jx, y: jy },
                { x: colx, y: jy + dir * o },
                { x: colx, y: jogy },
                { x: colx + LEG, y: a.y },
                { x: a.x - ENDPOINT_INSET, y: a.y },
            ])
            const trace = path(d, 1.6, G1, 0.62)
            branchPaths.push(d)

            if (Math.abs(jy + dir * o - jogy) > 34) {
                ghost(
                    [
                        { x: colx - GHOST_OFFSET, y: jy + dir * o + 8 },
                        { x: colx - GHOST_OFFSET, y: jogy - 8 },
                    ],
                    0,
                    0,
                )
            } else if (a.x - 14 - (colx + LEG + 6) > 30) {
                ghost(
                    [
                        { x: colx + LEG + 6, y: a.y + GHOST_OFFSET },
                        { x: a.x - 14, y: a.y + GHOST_OFFSET },
                    ],
                    0,
                    0,
                )
            }

            const ring = circ(a.x, a.y, 4.4, { fill: 'none', stroke: G1, 'stroke-width': 1 })
            const core = circ(a.x, a.y, 1.7, { fill: G2 })
            ring.style.transition = core.style.transition = 'stroke .3s ease, fill .3s ease'

            let live: SVGPathElement | null = null
            const onEnter = () => {
                trace.setAttribute('stroke', PINK)
                trace.setAttribute('stroke-opacity', '0.9')
                ring.setAttribute('stroke', PINK)
                core.setAttribute('fill', PINK)
                if (!live) live = travel(d, ACC)
            }
            const onLeave = () => {
                trace.setAttribute('stroke', G1)
                trace.setAttribute('stroke-opacity', '0.62')
                ring.setAttribute('stroke', G1)
                core.setAttribute('fill', G2)
                if (live) {
                    live.remove()
                    live = null
                }
            }
            // Assigned as properties, not addEventListener: build() reruns
            // on resize/fonts-ready, and addEventListener would stack a new
            // handler (and a new pulse) on every rerun. Also wired to
            // focusin/focusout (untyped on HTMLDivElement, hence the cast)
            // so keyboard focus on a row's link matches hover.
            const focusable = a.el as HTMLDivElement & Record<'onfocusin' | 'onfocusout', ((ev: FocusEvent) => void) | null>
            a.el.onmouseenter = onEnter
            a.el.onmouseleave = onLeave
            focusable.onfocusin = onEnter
            focusable.onfocusout = onLeave
        })

        // Ambient sage drift, one per destination, sharing the trunk.
        branchPaths.forEach((bd, i) =>
            travelPx(trunk + ' ' + bd.replace('M', 'L'), SAGE, 40, 1.6, SAGE_SPEED, i * SAGE_STAGGER, false, 1),
        )
        // Pink charge, reserved for the primary-contact branch.
        const primaryIndex = plan.findIndex((p) => p.a.el === primaryEl)
        const primaryBranch = branchPaths[primaryIndex] ?? branchPaths[0]
        if (primaryBranch) {
            travelPx(trunk + ' ' + primaryBranch.replace('M', 'L'), ACC, 16, 1.8, PINK_SPEED, PINK_DELAY, true, 0.9)
        }
    }, [])

    useRecomputeOnResize(build)

    return (
        <div className={styles.page} ref={pageRef}>
            <svg className={styles.wireFront} ref={wireRef} aria-hidden="true" />

            <div className={styles.left} ref={leftRef}>
                <PageIntro
                    heading={heading}
                    eyebrow={eyebrow}
                    paragraphs={introParagraphs}
                    headingClassName={styles.heading}
                    eyebrowClassName={styles.eyebrow}
                    paragraphClassName={styles.blurb}
                />
                <Image
                    ref={portraitRef}
                    className={styles.portrait}
                    src={portrait}
                    alt="Illustrated portrait of Carmen Sergiou"
                    width={1536}
                    height={1024}
                    // .portrait's displayed width tops out well under the source
                    // asset (column-derived, ≤ min(906px, ~62vw) desktop;
                    // clamp(220px, 66vw, 340px) below bp-card/1024px) — without
                    // `sizes` Next assumes the full 1536px width on every
                    // viewport, including mobile.
                    sizes="(max-width: 1024px) 340px, min(906px, 62vw)"
                    priority
                />
            </div>

            <div className={styles.right}>
                <div className={styles.row} ref={row0Ref}>
                    <div className={styles.k} ref={label0Ref}>
                        {primary?.label ?? 'PRIMARY CONTACT'}
                    </div>
                    <div className={styles.v}>{DEFAULT_PRIMARY_VALUE}</div>
                    <a className={styles.ctaLink} href={primaryHref}>
                        {emailLabel(primaryHref)}
                    </a>
                </div>

                <div className={styles.row} ref={row1Ref}>
                    <div className={styles.k} ref={label1Ref}>
                        CURRENT POSITION
                    </div>
                    <div className={styles.v}>{position}</div>
                    <div className={styles.n}>
                        {instMain}
                        {instEm ? (
                            <>
                                {' '}
                                — <em>{instEm}</em>
                            </>
                        ) : null}
                    </div>
                </div>

                <div className={styles.row} ref={row2Ref}>
                    <div className={styles.k} ref={label2Ref}>
                        {forneurotech?.label ?? 'FORNEUROTECH NETWORK'}
                    </div>
                    <div className={styles.v}>{forneurotech?.value ?? DEFAULT_FORNEUROTECH_VALUE}</div>
                    <div className={styles.n}>{forneurotech?.note ?? DEFAULT_FORNEUROTECH_NOTE}</div>
                    <div className={styles.ctaRow}>
                        <ArrowLink className={styles.ctaLink} href={FORNEUROTECH_URL} external>
                            VISIT FORNEUROTECH
                        </ArrowLink>
                        <a className={styles.ctaLink} href={forneurotechHref}>
                            {emailLabel(forneurotechHref)}
                        </a>
                    </div>
                </div>

                <div className={`${styles.row} ${styles.rowLast}`} ref={row3Ref}>
                    <div className={styles.k} ref={label3Ref}>
                        LET&apos;S GET SOCIAL
                    </div>
                    <div className={styles.v}>Find me online</div>
                    <div className={styles.socials}>
                        {socialLinks.map((s) => (
                            <a
                                key={`${s.label ?? 'social'}-${s.href ?? 'item'}`}
                                className={styles.socialLink}
                                href={s.href ?? '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {s.label?.toUpperCase()}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
