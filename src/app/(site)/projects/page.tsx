import type { Metadata } from 'next'
import ProjectsPage from '../../../views/ProjectsMain/ProjectsPage'
import { getPageContent, getProjects } from '../../../sanity/lib/queries'

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
    const [projects, pageContent] = await Promise.all([getProjects(), getPageContent('projects')])
    return <ProjectsPage projects={projects} pageContent={pageContent} />
}
