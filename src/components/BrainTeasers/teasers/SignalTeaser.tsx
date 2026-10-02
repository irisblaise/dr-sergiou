'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import EegHeadArt from '../art/EegHeadArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

// 01 NEURO — "Find the signal". A noisy EEG trace and a rotary filter dial.
// As the dial nears the alpha band the noise falls away; inside it, the clean
// alpha wave's envelope traces a small drawing — the brain, in profile. Hold
// the dial in the band for ~1 s to solve. Reduced motion: no hold timer, the
// band solves on arrival.

const MIN_HZ = 1
const MAX_HZ = 40
const START_HZ = 30
const HOLD_MS = 1000
const SWEEP = 135 // dial travel either side of 12 o'clock, degrees

// ---------- the trace ----------
const TW = 320
const TH = 96
const MID = 58
const N = 260
const ALPHA_CYCLES = 22 // across the window

type Key = [number, number]
// Brain silhouette the clean wave's envelope traces: upper contour
// (frontal → parietal → occipital) and lower (temporal lobe, cerebellum).
const UPPER: Key[] = [
    [0.08, MID], [0.12, 38], [0.2, 23], [0.32, 14], [0.45, 10], [0.58, 11],
    [0.7, 15], [0.8, 23], [0.88, 35], [0.92, MID],
]
const LOWER: Key[] = [
    [0.08, MID], [0.15, 67], [0.25, 72], [0.38, 68], [0.5, 72], [0.62, 76],
    [0.72, 78], [0.8, 84], [0.88, 75], [0.92, MID],
]

function interp(keys: Key[], u: number): number {
    if (u <= keys[0][0] || u >= keys[keys.length - 1][0]) return MID
    for (let i = 1; i < keys.length; i++) {
        if (u <= keys[i][0]) {
            const [u0, y0] = keys[i - 1]
            const [u1, y1] = keys[i]
            const t = (u - u0) / (u1 - u0)
            const s = t * t * (3 - 2 * t) // smoothstep, for a drawn rather than faceted contour
            return y0 + (y1 - y0) * s
        }
    }
    return MID
}

// Deterministic "noise": a stack of incommensurate sines plus a hashed jitter.
function noise(i: number): number {
    const u = i / N
    const hash = Math.sin(i * 12.9898) * 43758.5453
    return (
        0.5 * Math.sin(u * 151 + 1.3) +
        0.35 * Math.sin(u * 389 + 0.4) +
        0.3 * Math.sin(u * 57 + 2.2) +
        0.45 * (hash - Math.floor(hash) - 0.5)
    )
}

const NOISE = Array.from({ length: N + 1 }, (_, i) => noise(i))

function tracePath(gain: number): string {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
        const u = i / N
        const up = interp(UPPER, u)
        const lo = interp(LOWER, u)
        const c = (up + lo) / 2
        const h = (lo - up) / 2
        const alpha = h * Math.sin(u * ALPHA_CYCLES * Math.PI * 2)
        const y = c + gain * alpha + (1 - gain) * (24 * NOISE[i] + 0.35 * alpha)
        pts.push(`${i ? 'L' : 'M'}${(u * TW).toFixed(2)} ${y.toFixed(2)}`)
    }
    return pts.join(' ')
}

const contourPath = (keys: Key[]) =>
    Array.from({ length: 81 }, (_, i) => {
        const u = 0.08 + (i / 80) * 0.84
        return `${i ? 'L' : 'M'}${(u * TW).toFixed(2)} ${interp(keys, u).toFixed(2)}`
    }).join(' ')

const UPPER_D = contourPath(UPPER)
const LOWER_D = contourPath(LOWER)

// ---------- the dial ----------
const hzToDeg = (hz: number) => -SWEEP + ((hz - MIN_HZ) / (MAX_HZ - MIN_HZ)) * SWEEP * 2
const clampHz = (hz: number) => Math.round(Math.min(MAX_HZ, Math.max(MIN_HZ, hz)) * 2) / 2

const DIAL_TICKS = Array.from({ length: MAX_HZ - MIN_HZ + 1 }, (_, i) => {
    const hz = MIN_HZ + i
    const major = hz === 1 || hz % 10 === 0
    const a = (hzToDeg(hz) * Math.PI) / 180
    const r0 = major ? 37 : 39.4
    const p = (r: number) => `${(Math.sin(a) * r).toFixed(2)} ${(-Math.cos(a) * r).toFixed(2)}`
    return { d: `M${p(r0)} L${p(42)}`, major, hz }
})

const KNURLS = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    return `M${(Math.sin(a) * 23).toFixed(2)} ${(-Math.cos(a) * 23).toFixed(2)} L${(Math.sin(a) * 27).toFixed(2)} ${(-Math.cos(a) * 27).toFixed(2)}`
}).join(' ')

export default function SignalTeaser({ teaser, onSolved }: TeaserProps<'signal'>) {
    const reduced = useReducedMotion()
    const [hz, setHz] = useState(START_HZ)
    const [solved, setSolved] = useState(false)
    const dialRef = useRef<SVGSVGElement>(null)
    const [lo, hi] = teaser.targetBand
    const inBand = hz >= lo && hz <= hi
    const centre = (lo + hi) / 2
    // How much of the alpha passes the filter: 1 inside the band, falling off outside it.
    const gain = inBand ? 1 : Math.exp(-(((hz - centre) / ((hi - lo) * 0.9)) ** 2))

    const onSolvedRef = useRef(onSolved)
    useEffect(() => {
        onSolvedRef.current = onSolved
    })

    const solve = () => {
        setSolved(true)
        onSolvedRef.current()
    }

    // Reduced motion: no hold timer — arriving in the band solves it.
    const tune = (next: number) => {
        const v = clampHz(next)
        setHz(v)
        if (reduced && !solved && v >= lo && v <= hi) solve()
    }

    // Otherwise: hold the dial in the band for ~1 s.
    useEffect(() => {
        if (solved || !inBand || reduced) return
        const t = setTimeout(() => {
            setSolved(true)
            onSolvedRef.current()
        }, HOLD_MS)
        return () => clearTimeout(t)
    }, [inBand, solved, reduced])

    const setFromPointer = (e: PointerEvent<SVGSVGElement>) => {
        const r = dialRef.current?.getBoundingClientRect()
        if (!r) return
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const deg = Math.max(-SWEEP, Math.min(SWEEP, (Math.atan2(dx, -dy) * 180) / Math.PI))
        tune(MIN_HZ + ((deg + SWEEP) / (SWEEP * 2)) * (MAX_HZ - MIN_HZ))
    }

    const onKey = (e: KeyboardEvent) => {
        const step: Record<string, number> = {
            ArrowUp: 0.5, ArrowRight: 0.5, ArrowDown: -0.5, ArrowLeft: -0.5, PageUp: 5, PageDown: -5,
        }
        if (e.key in step) tune(hz + step[e.key])
        else if (e.key === 'Home') tune(MIN_HZ)
        else if (e.key === 'End') tune(MAX_HZ)
        else return
        e.preventDefault()
    }

    return (
        <div className={styles.game}>
            <div className={styles.artRow}>
                <div className={styles.artHeader}>
                    <EegHeadArt />
                </div>
                <p className={styles.prompt}>{teaser.prompt}</p>
            </div>

            <svg className={styles.trace} viewBox={`0 0 ${TW} ${TH}`} role="img" aria-label={inBand ? 'A clean alpha wave, shaped like a brain in profile' : 'A noisy EEG trace'}>
                <path className={styles.traceBaseline} d={`M0 ${MID} L${TW} ${MID}`} />
                <motion.path
                    className={styles.traceContour}
                    d={`${UPPER_D} ${LOWER_D}`}
                    initial={false}
                    animate={{ opacity: solved ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.8 }}
                />
                <path className={`${styles.traceLine} ${solved ? styles.traceLineFired : ''}`} d={tracePath(gain)} />
            </svg>

            {solved ? (
                <Reveal
                    result={<Callout label="ALPHA" sub={`${lo}–${hi} HZ · FOUND AT ${hz.toFixed(1)} HZ`} tone="fired" />}
                    text={teaser.reveal}
                    region={teaser.region}
                />
            ) : (
                <div className={styles.dialRow}>
                    <svg
                        ref={dialRef}
                        className={styles.dial}
                        viewBox="-50 -50 100 100"
                        role="slider"
                        tabIndex={0}
                        aria-label="Filter frequency"
                        aria-valuemin={MIN_HZ}
                        aria-valuemax={MAX_HZ}
                        aria-valuenow={hz}
                        aria-valuetext={`${hz.toFixed(1)} hertz`}
                        onKeyDown={onKey}
                        onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture(e.pointerId)
                            setFromPointer(e)
                        }}
                        onPointerMove={(e) => {
                            if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromPointer(e)
                        }}
                    >
                        <circle className={styles.dialRing} r={44.5} />
                        {DIAL_TICKS.map((t) => (
                            <path key={t.hz} className={t.major ? styles.dialTickMajor : styles.dialTick} d={t.d} />
                        ))}
                        {/* the band lights pink only once you're in it */}
                        {inBand && (
                            <motion.path
                                className={styles.dialHold}
                                d={(() => {
                                    const a0 = (hzToDeg(lo) * Math.PI) / 180
                                    const a1 = (hzToDeg(hi) * Math.PI) / 180
                                    return `M${(Math.sin(a0) * 46.5).toFixed(2)} ${(-Math.cos(a0) * 46.5).toFixed(2)} A46.5 46.5 0 0 1 ${(Math.sin(a1) * 46.5).toFixed(2)} ${(-Math.cos(a1) * 46.5).toFixed(2)}`
                                })()}
                                initial={{ pathLength: reduced ? 1 : 0 }}
                                animate={{ pathLength: 1 }}
                                transition={reduced ? { duration: 0 } : { duration: HOLD_MS / 1000, ease: 'linear' }}
                            />
                        )}
                        <circle className={styles.dialKnob} r={27} />
                        <path className={styles.dialKnurl} d={KNURLS} />
                        <circle className={styles.dialCap} r={19} />
                        <g style={{ transform: `rotate(${hzToDeg(hz)}deg)` }}>
                            <path className={styles.dialPointer} d="M0 -5 L0 -17.5" />
                        </g>
                    </svg>
                    <div className={styles.dialReadout}>
                        <span className={inBand ? styles.dialHzOn : styles.dialHz}>{hz.toFixed(1)} HZ</span>
                        <span className={styles.dialHint}>DRAG OR USE ← / →</span>
                        <span className={styles.dialScale}>1 · 10 · 20 · 30 · 40</span>
                    </div>
                </div>
            )}
        </div>
    )
}
