import Home from '../../views/Home/Home'
import { getHome } from '../../sanity/lib/queries'

export default async function Page() {
    const home = await getHome()
    return <Home home={home} />
}
