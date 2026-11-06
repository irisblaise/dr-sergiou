import type { ReactNode } from 'react'

// Pure primitive: the pill-shaped filter/tab toggle button (Impact's mobile
// MEDIA/AWARDS tabs and chip strip, Publications' topic filter chips). Each
// page still owns its base/active class names — styled via the shared
// `pill-toggle`/`pill-toggle-active` mixins in `styles/_pill.scss` — and its
// own layout (width, padding, flex); this only owns the active-state markup.
interface Props {
    active: boolean
    onClick: () => void
    className: string
    activeClassName: string
    children: ReactNode
}

export default function Chip({ active, onClick, className, activeClassName, children }: Props) {
    return (
        <button className={`${className} ${active ? activeClassName : ''}`} onClick={onClick}>
            {children}
        </button>
    )
}
