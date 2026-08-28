import type { Metadata } from 'next'
import Publications from '../../../views/Publications/Publications'
import { getPublications } from '../../../sanity/lib/queries'

export const metadata: Metadata = {
    title: 'Publications',
    description:
        "Peer-reviewed articles, reviews, and book chapters on forensic neuroscience and neuromodulation — browse Dr. Carmen-Silva Sergiou's research by topic.",
    alternates: { canonical: '/publications' },
    openGraph: {
        title: 'Publications — Dr. Carmen-Silva Sergiou',
        description:
            "Peer-reviewed articles, reviews, and book chapters on forensic neuroscience and neuromodulation — browse Dr. Carmen-Silva Sergiou's research by topic.",
        url: '/publications',
    },
}

export default async function Page() {
    const publications = await getPublications()

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: publications.map((p, i) => ({
            '@type': 'ScholarlyArticle',
            position: i + 1,
            name: p.title,
            author: p.authors,
            datePublished: String(p.year),
            isPartOf: p.journal,
            url: p.link || undefined,
        })),
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Publications publications={publications} />
        </>
    )
}
