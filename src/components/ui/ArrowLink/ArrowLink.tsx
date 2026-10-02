import type { MouseEvent, ReactNode } from 'react'

// Pure primitive: the "LABEL →" link used to close out a project row, an
// impact detail, a layer of exploration, and a publication's mobile card.
// Each page still owns its own class (styling has drifted a little between
// instances — that's a separate visual-QA call, not something to flatten
// here) and its own href/visibility logic; this only owns the shared markup
// shape and the external-link attribute pair.
//
// Pass `onClick` instead of `href` for an in-page action (the brain teasers'
// `CHECK →` / `PLAY AGAIN →`) — same markup shape, rendered as a <button>.
type Props = {
    children: ReactNode
    className: string
} & (
    | { href: string; external?: boolean; onClick?: never; disabled?: never }
    | { onClick: (e: MouseEvent<HTMLButtonElement>) => void; disabled?: boolean; href?: never; external?: never }
)

export default function ArrowLink(props: Props) {
    const { children, className } = props
    if (props.onClick) {
        return (
            <button type="button" className={className} onClick={props.onClick} disabled={props.disabled}>
                {children} <span aria-hidden>→</span>
            </button>
        )
    }
    return (
        <a
            className={className}
            href={props.href}
            target={props.external ? '_blank' : undefined}
            rel={props.external ? 'noopener noreferrer' : undefined}
        >
            {children} <span aria-hidden>→</span>
        </a>
    )
}
