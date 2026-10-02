import styles from './Art.module.scss'

// 03 VR: a street of four distinct houses, each with its own cue — hedges,
// lights on, an open window, a car in the drive. Engraved: hatched roofs,
// ruled pavement, no fills. `bare` draws just the street and the house
// numbers, for after the glimpse has faded.

export const HOUSE_X = [16, 94, 172, 250] // left edge of each house, in viewBox units
// Cropped to the houses (roofs start at y≈33) with a little headroom for the pick marker.
export const STREET_VIEWBOX = '0 18 320 104'
const W = 54

function House({ x }: { x: number }) {
    const roofHatch = Array.from({ length: 6 }, (_, i) => {
        const t = (i + 1) / 7
        return `M${x - 3 + t * (W / 2 + 3)} ${58 - t * 24} L${x + W / 2 + t * (W / 2 + 3)} ${34 + t * 24}`
    }).join(' ')
    return (
        <g>
            <path className={styles.heavy} d={`M${x} 104 L${x} 58.4 L${x + W} 58 L${x + W} 104`} />
            <path className={styles.heavy} d={`M${x - 4} 58.6 L${x + W / 2} 33.6 L${x + W + 4} 58.2`} />
            <path className={styles.hatch} d={roofHatch} />
            {/* door */}
            <path className={styles.mid} d={`M${x + W / 2 - 5} 104 L${x + W / 2 - 5} 88 L${x + W / 2 + 5} 88 L${x + W / 2 + 5} 104`} />
            <circle className={styles.dot} cx={x + W / 2 + 3} cy={96.4} r={0.6} />
        </g>
    )
}

function Window({ x, y }: { x: number; y: number }) {
    return (
        <g>
            <path className={styles.mid} d={`M${x} ${y} L${x + 12} ${y} L${x + 12} ${y + 12} L${x} ${y + 12} Z`} />
            <path className={styles.fine} d={`M${x + 6} ${y} L${x + 6} ${y + 12} M${x} ${y + 6} L${x + 12} ${y + 6}`} />
        </g>
    )
}

export default function StreetArt({ bare = false }: { bare?: boolean }) {
    const [h1, h2, h3, h4] = HOUSE_X
    return (
        <svg
            className={styles.art}
            viewBox={STREET_VIEWBOX}
            role="img"
            aria-label={
                bare
                    ? 'An empty street with four numbered plots'
                    : 'A street of four houses: 1 behind tall hedges, 2 with its lights on, 3 with a window open, 4 with a car in the drive'
            }
        >
            {/* street + kerb */}
            <path className={styles.heavy} d="M4 104.2 C80 103.8 240 104.4 316 104" />
            <path className={styles.hatch} d={Array.from({ length: 26 }, (_, i) => `M${8 + i * 12} 108 L${4 + i * 12} 112`).join(' ')} />
            {HOUSE_X.map((x, i) => (
                <text key={i} className={styles.label} x={x + W / 2} y={120} textAnchor="middle" style={{ fontSize: 7 }}>
                    {i + 1}
                </text>
            ))}

            {!bare && (
                <>
                    {/* 1 — hedges */}
                    <House x={h1} />
                    <Window x={h1 + 6} y={66} />
                    <Window x={h1 + 36} y={66} />
                    <path
                        className={styles.mid}
                        d={`M${h1 - 6} 104 C${h1 - 8} 92 ${h1 - 2} 86 ${h1 + 4} 88 C${h1 + 6} 82 ${h1 + 14} 82 ${h1 + 16} 87 C${h1 + 20} 82 ${h1 + 26} 84 ${h1 + 24} 90 M${h1 + 30} 90 C${h1 + 30} 83 ${h1 + 38} 82 ${h1 + 40} 87 C${h1 + 44} 82 ${h1 + 52} 84 ${h1 + 52} 89 C${h1 + 58} 88 ${h1 + 62} 94 ${h1 + 60} 104`}
                    />
                    <path
                        className={styles.hatch}
                        d={Array.from({ length: 12 }, (_, i) => `M${h1 - 4 + i * 5.4} 103 L${h1 - 1 + i * 5.4} 92`).join(' ')}
                    />

                    {/* 2 — lights on: windows radiate */}
                    <House x={h2} />
                    <Window x={h2 + 6} y={66} />
                    <Window x={h2 + 36} y={66} />
                    <path
                        className={styles.fine}
                        d={[h2 + 12, h2 + 42]
                            .map(
                                (cx) =>
                                    `M${cx - 9} ${72} L${cx - 13} ${72} M${cx + 9} ${72} L${cx + 13} ${72} M${cx} ${63} L${cx} ${60} M${cx - 8} ${64} L${cx - 10} ${62} M${cx + 8} ${64} L${cx + 10} ${62}`,
                            )
                            .join(' ')}
                    />
                    <circle className={styles.dot} cx={h2 + 12} cy={72} r={1.4} />
                    <circle className={styles.dot} cx={h2 + 42} cy={72} r={1.4} />

                    {/* 3 — open window: sash raised, dark gap, curtain out */}
                    <House x={h3} />
                    <Window x={h3 + 6} y={66} />
                    <path className={styles.mid} d={`M${h3 + 36} 66 L${h3 + 48} 66 L${h3 + 48} 78 L${h3 + 36} 78 Z`} />
                    <path className={styles.mid} d={`M${h3 + 36} 63 L${h3 + 48} 63 L${h3 + 48} 69 L${h3 + 36} 69`} />
                    <path
                        className={styles.hatch}
                        d={Array.from({ length: 6 }, (_, i) => `M${h3 + 37 + i * 2} 77 L${h3 + 38 + i * 2} 70`).join(' ')}
                    />
                    <path className={styles.fine} d={`M${h3 + 48} 70 C${h3 + 54} 72 ${h3 + 53} 77 ${h3 + 58} 79`} />

                    {/* 4 — car in the drive */}
                    <House x={h4} />
                    <Window x={h4 + 6} y={66} />
                    <Window x={h4 + 36} y={66} />
                    {/* paper fill so the car sits in front of the house */}
                    <path
                        className={styles.heavy}
                        style={{ fill: 'var(--canvas)' }}
                        d={`M${h4 + 26} 101 L${h4 + 26} 95 C${h4 + 28} 92 ${h4 + 32} 91 ${h4 + 36} 91 L${h4 + 40} 85 L${h4 + 56} 85 L${h4 + 62} 91 C${h4 + 66} 91 ${h4 + 68} 93 ${h4 + 68} 96 L${h4 + 68} 101 Z`}
                    />
                    <path className={styles.fine} d={`M${h4 + 42} 86.6 L${h4 + 47} 86.6 L${h4 + 47} 91 L${h4 + 38} 91 Z M${h4 + 49} 86.6 L${h4 + 55} 86.6 L${h4 + 59.6} 91 L${h4 + 49} 91 Z`} />
                    <circle className={styles.mid} cx={h4 + 34} cy={101.6} r={3.4} />
                    <circle className={styles.mid} cx={h4 + 60} cy={101.6} r={3.4} />
                </>
            )}
        </svg>
    )
}
