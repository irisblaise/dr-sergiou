import Impact from '../../../views/Impact/Impact'
import { getAwards, getMedia } from '../../../sanity/lib/queries'

export default async function Page() {
    const [awards, media] = await Promise.all([getAwards(), getMedia()])
    return <Impact awards={awards} media={media} />
}
