import Projects from '../../../views/Projects/Projects'
import { getProjects } from '../../../sanity/lib/queries'

export default async function Page() {
    const projects = await getProjects()
    return <Projects projects={projects} />
}
