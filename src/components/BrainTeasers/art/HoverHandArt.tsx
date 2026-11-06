'use client'

import { motion, useReducedMotion } from 'framer-motion'
import styles from './Art.module.scss'

// 05 BEHAVIOR header: a hand, index finger hovering mid-hesitation over a
// single inked cell body. Contour + cross-contour hatching, like the
// homepage head. Under reduced motion the finger simply holds still.

// Shading along the underside of the curled fingers and the finger's
// shadow side — short, slightly fanned strokes.
const HAND_HATCH = [
    'M83 58.6 L85.4 55.6', 'M86.4 60.4 L89 57', 'M90 61.6 L92.6 58.2', 'M94.2 62.4 L96.4 59.4',
    'M101.6 63.4 L103.8 60.2', 'M105.4 64.6 L107.8 61', 'M109.6 65.6 L111.6 62.4', 'M113.6 65.4 L115.4 62.6',
    'M73.6 47 L75.6 48.4', 'M73.4 52 L75.4 53.2', 'M73.2 57 L75.2 58', 'M73.2 62 L75 62.8', 'M73 67 L74.8 67.6',
].join(' ')

const WRIST_HATCH = [
    'M92 14 L96.4 18', 'M95.6 11.6 L100.4 16', 'M99.4 9.4 L104.6 14', 'M103.6 7.4 L108.6 12.2',
    'M108 5.6 L112.4 10',
].join(' ')

export default function HoverHandArt() {
    const reduced = useReducedMotion()
    return (
        <svg
            className={styles.art}
            viewBox="0 0 160 112"
            role="img"
            aria-label="Engraving of a hand with its index finger hovering, hesitating, above a small cell"
        >
            <motion.g
                animate={reduced ? undefined : { y: [0, -1.6, 0.4, -1, 0] }}
                transition={reduced ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* wrist / forearm */}
                <path className={styles.heavy} d="M64.4 30.6 C67 20.4 76.4 10.8 89.6 5.4 M118.6 50.2 C121.6 37.6 125.4 23.4 130.6 9.4" />
                <path className={styles.hatch} d={WRIST_HATCH} />
                {/* thumb */}
                <path
                    className={styles.heavy}
                    d="M64.4 30.6 C58.6 33.6 54.2 39.8 55.6 45.6 C57 50.6 62.6 49.6 64.2 45"
                />
                <path className={styles.fine} d="M57.6 42.2 C59 44 61.2 44.4 62.6 43.6" />
                {/* index finger, extended down */}
                <path
                    className={styles.heavy}
                    d="M64.2 45 C63.2 55 62.4 64.4 63.8 73.6 C64.8 79.4 70.4 81.4 73.4 77.8 C75.6 71.8 75.4 58.4 76.4 44"
                />
                <path className={styles.fine} d="M66 72.6 C66.8 76.2 70.6 77.2 72.8 74.4" />
                <path className={styles.fine} d="M64.2 52.4 C67.2 53.4 72.4 53.4 75.4 51.6 M64 62.8 C67 63.8 71.2 63.8 74.4 62.2" />
                {/* curled fingers / back of hand */}
                <path
                    className={styles.heavy}
                    d="M76.4 44 C80.4 40 88 40 92 44.2 C96 40.2 104 41 106.2 46.2 C110.4 43 117.4 45 118.6 50.2 C122.6 51.8 124.2 58 120.4 62.8 C116.2 67.8 106.4 66.4 100.2 62.2 C94.2 66.4 84.2 64.6 80 58.2"
                />
                <path className={styles.mid} d="M92 44.2 C91.4 50 92.8 56.4 95.6 60.8 M106.2 46.2 C106.6 52 108.4 57.4 111.4 61" />
                <path className={styles.fine} d="M86 47.6 C87.6 46.6 89.4 46.8 90.6 48 M100.6 49.2 C102 48.2 104 48.4 105 49.6 M113 52.4 C114.4 51.6 116 52 116.8 53.2" />
                <path className={styles.hatch} d={HAND_HATCH} />
            </motion.g>

            {/* the hesitation gap */}
            <path className={styles.fine} d="M69.4 83.4 L69.2 85.6 M69.2 88 L69 90.2" />

            {/* a single no-go/go cell body waiting below — inked, not yet fired */}
            <circle className={styles.mid} cx={69} cy={98} r={6.2} />
            <circle className={styles.fine} cx={69.6} cy={97.4} r={2.2} />
            <path
                className={styles.fine}
                d="M62.8 98 L55 99.4 L50 97.6 M75.2 97.4 L83 96 L88 98.4 M66 103.4 L63.2 109 M72.4 103.2 L75.6 108.6 M64.6 93.4 L60.4 88.6 M74 93.6 L77.6 89"
            />
            <circle className={styles.dot} cx={67.2} cy={99.6} r={0.5} />
            <circle className={styles.dot} cx={71.4} cy={100.2} r={0.4} />
            <circle className={styles.dot} cx={66.8} cy={96} r={0.4} />
            {/* surface line */}
            <path className={styles.hatch} d="M30 109.4 C60 109 100 109.8 132 109.2" />
        </svg>
    )
}
