import type { AccoladeType } from '../../data/types'

interface Props {
    type: AccoladeType
    size?: number
    className?: string
}

// Line-style icons matching the editorial aesthetic.
// phd = graduation cap (mortarboard), award = prize medal.
export default function AccoladeIcon({ type, size = 16, className }: Props) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        className,
        'aria-hidden': true,
    }
    if (type === 'phd') {
        return (
            <svg {...common}>
                <path d="M12 4 2 9l10 5 10-5-10-5Z" />
                <path d="M6 11v4.5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5V11" />
                <path d="M22 9v5" />
            </svg>
        )
    }
    return (
        <svg {...common}>
            <circle cx="12" cy="9" r="5.5" />
            <path d="M8.6 13.4 7 21l5-2.7L17 21l-1.6-7.6" />
        </svg>
    )
}
