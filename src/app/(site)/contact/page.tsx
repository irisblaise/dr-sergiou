import type { Metadata } from 'next'
import Contact from '../../../views/Contact/Contact'

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Get in touch with Dr. Carmen-Silva Sergiou.',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contact — Dr. Carmen-Silva Sergiou',
        description: 'Get in touch with Dr. Carmen-Silva Sergiou.',
        url: '/contact',
    },
}

export default function Page() {
    return <Contact />
}
