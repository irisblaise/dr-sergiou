import type { Metadata } from 'next'
import Projects from '../../../views/Projects/Projects'
import { getProjects } from '../../../sanity/lib/queries'

export const metadata: Metadata = {
    title: 'Projects',
    description:
        'Ongoing and past research projects led by Dr. Carmen-Silva Sergiou, spanning neuroscience, behaviour, and neuromodulation.',
    alternates: { canonical: '/projects' },
    openGraph: {
        title: 'Projects — Dr. Carmen-Silva Sergiou',
        description: 'Ongoing and past research projects led by Dr. Carmen-Silva Sergiou.',
        url: '/projects',
    },
}

export default async function Page() {
    const projects = await getProjects()
    return <Projects projects={projects} />
}
