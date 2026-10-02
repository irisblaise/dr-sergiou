import styles from './Art.module.scss'

// 06 FORENSIC: the card frame — a case-file index card cut like an
// evidence tag, with a reinforced string hole and its string. Decorative:
// the statement itself is real text laid over it. Ruled lines are hairline
// so the text above them stays legible.

const RULES = Array.from({ length: 7 }, (_, i) => {
    const y = 66 + i * 18
    // Each ruled line drifts a fraction off level, like a printed card.
    return `M18 ${y} L${302 - (i % 3)} ${y + (i % 2 ? 0.4 : -0.3)}`
}).join(' ')

export default function EvidenceTagArt() {
    return (
        <svg className={styles.art} viewBox="0 0 320 200" preserveAspectRatio="none" aria-hidden>
            <path className={styles.heavy} d="M22 6.4 L299.6 6 L314 20.4 L313.6 194 L6.2 194.2 L6 20.2 Z" vectorEffect="non-scaling-stroke" />
            <path className={styles.fine} d="M24.4 11 L297.6 10.6 L309.4 22.4 L309 189.4 L10.8 189.6 L10.6 22.4 Z" vectorEffect="non-scaling-stroke" />
            <path className={styles.hatch} d={RULES} vectorEffect="non-scaling-stroke" />
            <path className={styles.hatch} d="M52 52 L52.3 186" vectorEffect="non-scaling-stroke" />
            {/* string hole + reinforcing ring + string */}
            <circle className={styles.mid} cx={30} cy={30} r={11} vectorEffect="non-scaling-stroke" />
            <circle className={styles.heavy} cx={30} cy={30} r={6} vectorEffect="non-scaling-stroke" />
            <path className={styles.mid} d="M27 27 C20 14 12 4 -2 -6 M31.4 25 C28 12 30 2 36 -8" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}
