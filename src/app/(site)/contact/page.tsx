import type { Metadata } from 'next'
import Contact from '../../../views/Contact/Contact'

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

export default function Page() {
    return <Contact />
}
