import styles from './Art.module.scss'

// 02 CODING header: a brain in a specimen jar, labelled carmen_brain.mat.
// Engraving treatment per docs/brain-teasers-art-notes.md — doubled glass
// contour, vertical hatching for the jar's shaded side, gyri as contour
// lines, a stippled fluid line. Ink is currentColor (--ink via CSS).

// Shaded side of the glass: vertical strokes of uneven length, generated
// deterministically so the server and client markup match.
const JAR_HATCH = Array.from({ length: 6 }, (_, i) => {
    const x = 87 + i * 1.7
    const top = 52 + ((i * 7) % 5)
    const bottom = 110 - ((i * 5) % 6)
    return `M${x} ${top} L${x + 0.3} ${bottom}`
}).join(' ')

const LID_HATCH = [12, 14.5, 17, 19.5].map((y, i) => `M${30 + i} ${y} L${90 - i * 0.6} ${y + 0.2}`).join(' ')

const STIPPLE: [number, number, number][] = [
    [30, 50, 0.7], [38, 49.5, 0.5], [47, 50.4, 0.6], [56, 49.8, 0.5], [66, 50.2, 0.6],
    [75, 49.6, 0.5], [84, 50.3, 0.6], [91, 49.9, 0.5], [33, 54, 0.4], [79, 55, 0.4],
]

export default function SpecimenJarArt() {
    return (
        <svg
            className={styles.art}
            viewBox="0 0 120 132"
            role="img"
            aria-label="Engraving of a brain floating in a specimen jar labelled carmen_brain.mat"
        >
            {/* lid */}
            <path className={styles.heavy} d="M27 9 C45 7.4 75 7.6 93 9.2 L94 21.2 C75 22.6 45 22.4 26 21 Z" />
            <path className={styles.hatch} d={LID_HATCH} />
            {/* jar — outer and inner (glass thickness) contours */}
            <path
                className={styles.heavy}
                d="M30 22 L30.4 28 C24 30 20.2 34.5 20 40.5 L20.4 114 C20.6 119.4 24.4 122.2 30.2 122 L89.6 122.3 C95.8 122 99.6 119 99.8 113.6 L100 40 C99.6 34.2 96 30.4 89.6 28.2 L90 22"
            />
            <path className={styles.fine} d="M23.6 42 L23.9 113 C24.1 116.8 26.6 118.5 30.4 118.6 L89.8 118.8 C93.6 118.4 96.2 116.6 96.3 112.8 L96.5 42.4" />
            <path className={styles.fine} d="M27.5 46 L27.2 60 M27 66 L27.3 96" />
            <path className={styles.hatch} d={JAR_HATCH} />
            {/* fluid line + stipple */}
            <path className={styles.fine} d="M23.8 47 C36 48.6 52 45.6 66 47.2 C78 48.4 88 46 96.4 46.8" />
            {STIPPLE.map(([x, y, r], i) => (
                <circle key={i} className={styles.dot} cx={x} cy={y} r={r} />
            ))}
            {/* brain */}
            <path
                className={styles.mid}
                d="M37.6 76 C33.8 64.6 41.8 53.4 53.6 53.8 C57.8 47.6 69.6 47.8 73.8 54 C83.8 53.2 90 62 86.2 71.6 C90.4 79.6 84.4 89.2 74.2 87.4 C70.2 93.6 58.4 93.8 54.2 87.6 C44.2 91.4 35.8 85.2 37.6 76 Z"
            />
            <path
                className={styles.fine}
                d="M45.6 64.4 C49.6 60 53.8 66.6 57.8 62.4 M61.8 59.6 C66 55.4 71.8 61.8 76 58.2 M43.8 74.6 C48 70.4 52 76.8 56 72.6 C60 68.4 64.2 74.8 68.2 70.8 M70.4 66.8 C74.4 64.6 78.2 70.6 82.4 66.4 M49.8 82.4 C54 78.4 58.2 84.4 62.2 80.6 M66.2 80.2 C70.2 76.4 74.4 82.6 78.4 78.6 M60.4 53.4 C58.2 64.4 62.4 74.6 60.2 89.6"
            />
            <path className={styles.hatch} d="M80 76 L84 72.6 M78.6 80.4 L83 77 M76 84 L80.8 80.8 M72 86.4 L76.6 83.4" />
            {/* brainstem */}
            <path className={styles.mid} d="M65.6 88.6 C66.8 93 66 97 64.2 100.6 M60.8 90.4 C61.6 94.2 61 97.4 59.6 100.2" />
            {/* bubbles */}
            <circle className={styles.fine} cx={34} cy={62} r={1.6} />
            <circle className={styles.fine} cx={40} cy={57} r={1} />
            <circle className={styles.fine} cx={82} cy={98} r={1.3} />
            {/* label */}
            <path className={styles.mid} d="M33.6 103.4 L86.4 103 L86.8 115.6 L33.4 116 Z" />
            <text className={styles.label} x={60} y={111.6} textAnchor="middle">
                carmen_brain.mat
            </text>
        </svg>
    )
}
