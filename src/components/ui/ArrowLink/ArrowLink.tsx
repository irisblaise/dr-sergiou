import type { ReactNode } from 'react'

// Pure primitive: the "LABEL →" link used to close out a project row, an
// impact detail, a layer of exploration, and a publication's mobile card.
// Each page still owns its own class (styling has drifted a little between
// instances — that's a separate visual-QA call, not something to flatten
// here) and its own href/visibility logic; this only owns the shared markup
// shape and the external-link attribute pair.
interface Props {
    href: string
    children: ReactNode
    className: string
    external?: boolean
}

export default function ArrowLink({ href, children, className, external }: Props) {
    return (
        <a
            className={className}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
        >
            {children} <span aria-hidden>→</span>
        </a>
    )
}
