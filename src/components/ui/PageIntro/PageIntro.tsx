import type { ReactNode } from 'react'

// Pure primitive: renders the heading/eyebrow/paragraphs stack that opens
// every page. Every page still owns its own module.scss classes (spacing,
// max-width, and typography come from `styles/_typography.scss`'s shared
// mixins) — this component only owns the markup shape, so it takes no
// Sanity or CMS-shaped props, only the already-resolved strings (see
// `lib/pageIntro.ts` for the fallback logic that produces them).
interface Props {
    // ReactNode (not just string) so a page that needs to split its heading
    // on manual line breaks (Publications) can pre-render that itself.
    heading: ReactNode
    eyebrow: string
    paragraphs: string[]
    headingClassName: string
    eyebrowClassName: string
    paragraphClassName: string
}

export default function PageIntro({
    heading,
    eyebrow,
    paragraphs,
    headingClassName,
    eyebrowClassName,
    paragraphClassName,
}: Props) {
    return (
        <>
            <h1 className={headingClassName}>{heading}</h1>
            <div className={eyebrowClassName}>{eyebrow}</div>
            {paragraphs.map((paragraph, index) => (
                <p key={index} className={paragraphClassName}>
                    {paragraph}
                </p>
            ))}
        </>
    )
}
