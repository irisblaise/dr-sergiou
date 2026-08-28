import type { Metadata } from 'next'
import SkillsRedesign from '../../../views/SkillsRedesign/SkillsRedesign'
import { getSkills } from '../../../sanity/lib/queries'

export const metadata: Metadata = {
    title: 'Skills',
    description:
        'Expertise across neuroscience, technology, and human behavior — branches of one connected network, applied to questions of justice and society.',
    alternates: { canonical: '/skills' },
    openGraph: {
        title: 'Skills — Dr. Carmen-Silva Sergiou',
        description: 'Expertise across neuroscience, technology, and human behavior.',
        url: '/skills',
    },
}

export default async function Page() {
    const skills = await getSkills()
    return <SkillsRedesign skills={skills} />
}
