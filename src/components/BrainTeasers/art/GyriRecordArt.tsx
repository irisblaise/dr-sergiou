import styles from './Art.module.scss'

// 04 MUSIC header: a record whose grooves are drawn as brain gyri — each
// groove a ring with its own slow folds, so the disc reads as a cortex seen
// from above — plus the tonearm resting on it. Generated deterministically
// (no randomness) so server and client markup match.

function grooveRing(r: number, i: number): string {
    const folds = 7 + (i % 5) * 2
    const amp = 0.7 + (i % 3) * 0.3
    const phase = i * 1.7
    const steps = 96
    const pts: string[] = []
    for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * Math.PI * 2
        const rr = r + amp * Math.sin(folds * t + phase) + 0.4 * Math.sin(3 * t + i)
        pts.push(`${s ? 'L' : 'M'}${(rr * Math.cos(t)).toFixed(2)} ${(rr * Math.sin(t)).toFixed(2)}`)
    }
    return pts.join(' ')
}

const GROOVES = Array.from({ length: 9 }, (_, i) => grooveRing(20 + i * 3.6, i)).join(' ')

export default function GyriRecordArt() {
    return (
        <svg className={styles.art} viewBox="-60 -60 124 120" role="img" aria-label="Engraving of a record whose grooves are drawn as brain folds, with a tonearm">
            <circle className={styles.heavy} r={53} />
            <circle className={styles.fine} r={51} />
            <path className={styles.fine} d={GROOVES} />
            {/* label + spindle */}
            <circle className={styles.mid} r={15.6} />
            <circle className={styles.heavy} r={1.8} />
            <text className={styles.label} y={-6.4} textAnchor="middle" style={{ fontSize: 3.3, letterSpacing: '0.08em' }}>
                VENTROMEDIAL
            </text>
            {/* sheen — two hatched arcs where the light catches the vinyl */}
            <path className={styles.hatch} d="M-40 -26 C-34 -36 -24 -44 -12 -47 M-43 -20 C-37 -32 -27 -40 -15 -44 M30 34 C24 40 16 44 8 46" />
            {/* tonearm */}
            <circle className={styles.mid} cx={54} cy={-50} r={5.4} />
            <circle className={styles.fine} cx={54} cy={-50} r={2.2} />
            <path className={styles.heavy} d="M51.4 -45.6 C46 -32 36 -22 26.4 -15.4" />
            <path className={styles.mid} d="M27.4 -18.4 L21 -12.4 L24.2 -9 L30 -14.2" />
        </svg>
    )
}
