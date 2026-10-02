import styles from './Art.module.scss'

// 01 NEURO header: a small anatomical head in profile wearing an EEG
// electrode cap — the cap's meridians drawn as contour lines, electrodes as
// small inked rings, the wires bundling off the back of the head. Hatching
// on the shadow side of the face and neck, per the art notes.

const ELECTRODES: [number, number][] = [
    [60, 21.6], [46.4, 25.4], [74, 25.6], [34.2, 35.6], [52.4, 32.4], [70, 32.6],
    [86, 37.2], [29.8, 47.8], [48, 42.2], [66.4, 41.4], [84.4, 44.6],
]

const SHADOW_HATCH = [
    'M86 64 L89 61.4', 'M86.6 69 L90.4 65.8', 'M85.8 74 L89.4 71', 'M84 79 L88 75.6', 'M81.6 84 L85.8 80.6',
    'M36 82 L39.4 79.4', 'M38 87 L41.6 84.2', 'M40.4 91.4 L44 88.6',
].join(' ')

export default function EegHeadArt() {
    return (
        <svg className={styles.art} viewBox="0 0 110 110" role="img" aria-label="Engraving of a head in profile wearing an EEG electrode cap">
            {/* head + neck */}
            <path
                className={styles.heavy}
                d="M31 92.4 C26.4 80.6 22.2 70.2 22.4 56 C22.6 31.6 40.2 16 62 15.8 C82.4 15.8 96.2 30 96 48.2 C95.8 54 94 57.8 96.2 62 L101 69.6 C102 71.8 100.4 73 98.2 73 L96.2 74 C97.2 77 96.2 79 95 80 C96 82.2 95 84 93 85 C93.2 90 90.2 92.2 84.4 92 L76.2 92.2 L76.6 104.4"
            />
            <path className={styles.heavy} d="M31 92.4 L32.6 104.6" />
            {/* ear + jaw + eye */}
            <path className={styles.mid} d="M48.4 57.6 C44 53.6 43.6 64.4 48.2 66.4 M52 74 C58 80 68 83 76.2 82" />
            <path className={styles.fine} d="M84.6 55.6 C86.4 54.6 88.4 54.8 89.6 56" />
            {/* cap: edge, meridians, latitude */}
            <path className={styles.mid} d="M23.6 54.2 C40 46 76 43.6 94.2 46.4" />
            <path
                className={styles.fine}
                d="M60 16.2 C56.4 30 54.2 42 54 48.4 M40.4 22 C40.2 32 40 42 38.2 50.2 M80 21.6 C78.4 32 78.2 40 80.2 46 M28 36.4 C46 30 78 30 92 34"
            />
            {ELECTRODES.map(([x, y], i) => (
                <g key={i}>
                    <circle className={styles.mid} cx={x} cy={y} r={2.7} />
                    <circle className={styles.dot} cx={x} cy={y} r={0.9} />
                </g>
            ))}
            {/* wires bundling off the back */}
            <path
                className={styles.fine}
                d="M29.8 50.6 C22 58 17.6 72 13.6 88 M34.2 38.4 C24.2 47.6 17.8 62 11.8 82 M46.4 28.2 C30 34 19 54 10 76"
            />
            <path className={styles.hatch} d={SHADOW_HATCH} />
        </svg>
    )
}
