import styles from './Art.module.scss'

// 06 FORENSIC, "brain scan" card: a hand-drawn axial (horizontal) slice —
// cortex outline, the longitudinal fissure, gyri as contour lines, and the
// lateral ventricles' butterfly at the centre.

const GYRI_LEFT =
    'M18 30 C22 26 26 32 30 28 M14 44 C19 40 22 47 27 43 M16 58 C20 54 24 60 28 56 M22 70 C26 66 30 72 34 68 M24 20 C28 17 31 22 35 19 M30 36 C33 33 36 38 39 35 M28 50 C32 47 35 52 39 49 M32 62 C35 59 38 64 41 61'

const GYRI_RIGHT = GYRI_LEFT.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${100 - Number(x)} ${y}`)

export default function AxialSliceArt() {
    return (
        <svg className={styles.art} viewBox="0 0 100 90" role="img" aria-label="Hand-drawn axial slice of a brain">
            <path
                className={styles.heavy}
                d="M50 4 C30 3.6 12 14 8.6 36 C6 54 12 74 30 83 C38 87 46 86.6 50 84.4 C54 86.8 62 87.2 70 83 C88 74 94 54 91.4 36 C88 14 70 3.6 50 4 Z"
            />
            <path className={styles.fine} d="M50 4.6 C49.2 20 50.6 34 49.6 46 C50.4 60 49.4 72 50 84" />
            <path className={styles.fine} d={GYRI_LEFT} />
            <path className={styles.fine} d={GYRI_RIGHT} />
            {/* lateral ventricles */}
            <path className={styles.mid} d="M48.6 34 C44 36 41.6 42 43 48 C44.4 54 46.4 58 48.8 60 M51.4 34 C56 36 58.4 42 57 48 C55.6 54 53.6 58 51.2 60" />
            <path className={styles.hatch} d="M45 42 L47.4 40.6 M44.8 46 L47.6 44.4 M45.6 50 L48 48.6 M55 42 L52.6 40.6 M55.2 46 L52.4 44.4 M54.4 50 L52 48.6" />
            <path className={styles.hatch} d="M76 18 L80 22 M80 24 L84 28 M83 32 L86.6 35.6 M18 62 L22 66 M14 54 L17.6 57.6" />
        </svg>
    )
}
