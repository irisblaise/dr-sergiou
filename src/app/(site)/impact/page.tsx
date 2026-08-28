import type { Metadata } from 'next'
import Impact from '../../../views/Impact/Impact'
import { getAwards, getMedia } from '../../../sanity/lib/queries'

export const metadata: Metadata = {
    title: 'Impact',
    description:
        'Media coverage, interviews, and awards reflecting the reach of Dr. Carmen-Silva Sergiou\'s research.',
    alternates: { canonical: '/impact' },
    openGraph: {
        title: 'Impact — Dr. Carmen-Silva Sergiou',
        description: "Media coverage, interviews, and awards reflecting the reach of Dr. Carmen-Silva Sergiou's research.",
        url: '/impact',
    },
}

export default async function Page() {
    const [awards, media] = await Promise.all([getAwards(), getMedia()])
    return <Impact awards={awards} media={media} />
}
