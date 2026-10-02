'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import type { SkillKey } from '../../data/types'
import {
    ARMS,
    SOMA,
    type Pt,
    parsePolyline,
    pointAtFraction,
    polylineLength,
    round,
    toPathD,
} from './neuronGeometry'
import styles from './NeuronFiring.module.scss'

// The brain-teaser "firing" layer: new pink arm overlays (drawn, not cropped
// from the homepage pink layers), the pulse that travels from a solved arm
// into the cell body, and the cell-body glow once every arm is solved.
// Renders a <g> in the artwork's own 1000×1000 space, so it drops into the
// desktop stage's transformed group and the mobile figure's viewBox alike.
//
// Drawn to the art notes (docs/brain-teasers-art-notes.md): the artwork's
// tracks are double-contoured with ring segments along them, so each overlay
// is a main stroke plus an offset hairline contour and short hatch ticks —
// the hand-drawn feel lives in the paths, no runtime filters.

const SOMA_RIM = 118 // stop the trunk at the edge of the cell body, not its nucleus
const TICK_EVERY = 15
const TICK_HALF = 2.6
const CONTOUR_OFFSET = 3.4
const PULSE_SAMPLES = 28
const PULSE_S = 1.05

type ArmArt = {
    key: SkillKey
    trunk: string
    main: string
    contour: string
    ticks: string
    vias: Pt[]
    end: Pt
    /** Pulse keyframes, arm tip → soma. */
    inward: { x: number[]; y: number[] }
}

function unit(dx: number, dy: number): Pt {
    const l = Math.hypot(dx, dy) || 1
    return [dx / l, dy / l]
}

// Offsets a polyline sideways by `o`, averaging the normals of the two
// segments meeting at each vertex so the contour doesn't kink at corners.
function offsetPolyline(pts: Pt[], o: number): Pt[] {
    return pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)]
        const b = pts[Math.min(pts.length - 1, i + 1)]
        const [ux, uy] = unit(b[0] - a[0], b[1] - a[1])
        // Slight irregularity, like a hand-inked second line — deterministic
        // so server and client markup match.
        const wobble = o * (1 + 0.18 * Math.sin(i * 2.3))
        return [p[0] - uy * wobble, p[1] + ux * wobble]
    })
}

function hatchTicks(pts: Pt[]): string {
    const len = polylineLength(pts)
    const out: string[] = []
    for (let s = TICK_EVERY; s < len - 6; s += TICK_EVERY) {
        const [x, y] = pointAtFraction(pts, s / len)
        const [x2, y2] = pointAtFraction(pts, Math.min(1, (s + 1) / len))
        const [ux, uy] = unit(x2 - x, y2 - y)
        out.push(
            `M${round(x - uy * TICK_HALF)} ${round(y + ux * TICK_HALF)} L${round(x + uy * TICK_HALF)} ${round(y - ux * TICK_HALF)}`,
        )
    }
    return out.join(' ')
}

function buildArm(key: SkillKey, d: string, vias: number[]): ArmArt {
    const track = parsePolyline(d)
    const start = track[0]
    // Trunk: from the track's root, along the dendrite, to the soma's rim.
    const [ux, uy] = unit(SOMA[0] - start[0], SOMA[1] - start[1])
    const rim: Pt = [SOMA[0] - ux * SOMA_RIM, SOMA[1] - uy * SOMA_RIM]
    const full: Pt[] = [rim, ...track]
    const inwardPts: Pt[] = [...full].reverse().concat([SOMA])
    const samples = Array.from({ length: PULSE_SAMPLES }, (_, i) =>
        pointAtFraction(inwardPts, i / (PULSE_SAMPLES - 1)),
    )
    return {
        key,
        trunk: toPathD([rim, start]),
        main: toPathD(track),
        contour: toPathD(offsetPolyline(track, CONTOUR_OFFSET)),
        ticks: hatchTicks(full),
        vias: vias.map((f) => pointAtFraction(track, f).map(round) as Pt),
        end: track[track.length - 1],
        inward: { x: samples.map((p) => round(p[0])), y: samples.map((p) => round(p[1])) },
    }
}

const ARM_ART: ArmArt[] = ARMS.map((a) => buildArm(a.key, a.d, a.vias))

type Props = {
    solved: ReadonlySet<SkillKey>
    /** Bumped per arm each time it's solved — keys a fresh inward pulse. */
    pulses: Partial<Record<SkillKey, number>>
    /** Bumped when the last arm is solved — every arm fires outward at once. */
    fireCount: number
    allSolved: boolean
    reduced: boolean
}

export default function NeuronFiring({ solved, pulses, fireCount, allSolved, reduced }: Props) {
    const gradId = `soma-glow-${useId().replace(/:/g, '')}`
    const draw = (delay = 0) =>
        reduced ? { duration: 0 } : { duration: 1.1, ease: [0.2, 0.85, 0.25, 1] as const, delay }
    const fade = (delay = 0) => (reduced ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' as const, delay })

    return (
        <g className={styles.root} aria-hidden>
            <defs>
                <radialGradient id={gradId}>
                    <stop offset="0%" className={styles.glowStop} stopOpacity={0.42} />
                    <stop offset="45%" className={styles.glowStop} stopOpacity={0.16} />
                    <stop offset="100%" className={styles.glowStop} stopOpacity={0} />
                </radialGradient>
            </defs>

            {/* Cell-body glow — steady once all six are solved. */}
            <motion.circle
                cx={SOMA[0]}
                cy={SOMA[1]}
                r={190}
                fill={`url(#${gradId})`}
                initial={false}
                animate={{ opacity: allSolved ? 1 : 0 }}
                transition={fade(reduced ? 0 : PULSE_S)}
            />

            {ARM_ART.map((arm) => {
                const on = solved.has(arm.key)
                return (
                    <g key={arm.key}>
                        {on && (
                            <g>
                                <motion.path
                                    d={`${arm.trunk} ${arm.main}`}
                                    className={styles.halo}
                                    initial={{ opacity: reduced ? 1 : 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={fade(0.3)}
                                />
                                <motion.path
                                    d={arm.trunk}
                                    className={styles.trunk}
                                    initial={{ pathLength: reduced ? 1 : 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={draw()}
                                />
                                <motion.path
                                    d={arm.main}
                                    className={styles.main}
                                    initial={{ pathLength: reduced ? 1 : 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={draw()}
                                />
                                <motion.path
                                    d={arm.contour}
                                    className={styles.contour}
                                    initial={{ pathLength: reduced ? 1 : 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={draw(0.15)}
                                />
                                <motion.path
                                    d={arm.ticks}
                                    className={styles.ticks}
                                    initial={{ opacity: reduced ? 1 : 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={fade(0.5)}
                                />
                                {arm.vias.map(([x, y], i) => (
                                    <motion.circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r={4}
                                        className={styles.via}
                                        initial={{ opacity: reduced ? 1 : 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={fade(0.4 + i * 0.12)}
                                    />
                                ))}
                                <motion.g
                                    initial={{ opacity: reduced ? 1 : 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={fade(0.2)}
                                >
                                    <circle cx={arm.end[0]} cy={arm.end[1]} r={17} className={styles.ringOuter} />
                                    <circle cx={arm.end[0]} cy={arm.end[1]} r={12.4} className={styles.ringMid} />
                                    <circle cx={arm.end[0]} cy={arm.end[1]} r={5.4} className={styles.ringCore} />
                                </motion.g>
                            </g>
                        )}

                        {/* Inward pulse: the solved arm fires into the cell body. */}
                        {!reduced && pulses[arm.key] ? (
                            <motion.g
                                key={`in-${pulses[arm.key]}`}
                                initial={{ x: arm.inward.x[0], y: arm.inward.y[0], opacity: 0 }}
                                animate={{ x: arm.inward.x, y: arm.inward.y, opacity: [0, 1, 1, 1, 0] }}
                                transition={{ duration: PULSE_S, ease: 'linear' }}
                            >
                                <circle r={14} className={styles.pulseHalo} />
                                <circle r={5.5} className={styles.pulseCore} />
                            </motion.g>
                        ) : null}

                        {/* "All six": every arm fires outward from the soma at once. */}
                        {!reduced && fireCount > 0 ? (
                            <motion.g
                                key={`out-${fireCount}`}
                                initial={{ x: arm.inward.x.at(-1), y: arm.inward.y.at(-1), opacity: 0 }}
                                animate={{
                                    x: [...arm.inward.x].reverse(),
                                    y: [...arm.inward.y].reverse(),
                                    opacity: [0, 1, 1, 1, 0],
                                }}
                                transition={{ duration: PULSE_S * 1.2, ease: 'linear', delay: PULSE_S }}
                            >
                                <circle r={14} className={styles.pulseHalo} />
                                <circle r={5.5} className={styles.pulseCore} />
                            </motion.g>
                        ) : null}
                    </g>
                )
            })}
        </g>
    )
}
