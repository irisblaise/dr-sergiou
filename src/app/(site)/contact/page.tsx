import type { Metadata } from 'next'
import Contact from '../../../views/Contact/Contact'
import { getPageContent } from '../../../sanity/lib/queries'

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Reach Dr. Carmen-Silva Sergiou for research collaborations, talks, interviews, or anything at the crossroads of neuroscience and technology.',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contact — Dr. Carmen-Silva Sergiou',
        description:
            'Reach Dr. Carmen-Silva Sergiou for research collaborations, talks, interviews, or anything at the crossroads of neuroscience and technology.',
        url: '/contact',
    },
}

export default async function Page() {
    const pageContent = await getPageContent('contact')
    return <Contact pageContent={pageContent} />
}
