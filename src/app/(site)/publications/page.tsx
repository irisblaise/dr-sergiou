import Publications from '../../../views/Publications/Publications'
import { getPublications } from '../../../sanity/lib/queries'

export default async function Page() {
    const publications = await getPublications()
    return <Publications publications={publications} />
}
