import type { Metadata } from 'next'
import Skills from '../../../../views/Skills/Skills'
import { getSkills } from '../../../../sanity/lib/queries'

export const metadata: Metadata = {
    title: 'Skills',
    description:
        'Areas of expertise across neuroscience, forensic behaviour, VR, and neuromodulation.',
    alternates: { canonical: '/classic/skills' },
    robots: { index: false, follow: false },
    openGraph: {
        title: 'Skills — Dr. Carmen-Silva Sergiou',
        description: 'Areas of expertise across neuroscience, forensic behaviour, VR, and neuromodulation.',
        url: '/classic/skills',
    },
}

export default async function Page() {
    const skills = await getSkills()
    return <Skills skills={skills} />
}
