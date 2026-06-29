import Skills from '../../../views/Skills/Skills'
import { getSkills } from '../../../sanity/lib/queries'

export default async function Page() {
    const skills = await getSkills()
    return <Skills skills={skills} />
}
