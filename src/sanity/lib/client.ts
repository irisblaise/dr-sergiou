import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Server-only read token. The dataset is public-mode but the project does not
// grant anonymous API reads, so document queries need a token. This is safe:
// every fetch happens in Server Components, and Next never exposes a non
// NEXT_PUBLIC_* env var to the browser bundle. (Asset/image CDN URLs are public
// regardless, so <img> tags work without it.)
const token = process.env.SANITY_API_READ_TOKEN

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    // Authenticated requests bypass the CDN; we cache via Next ISR instead.
    useCdn: false,
    perspective: 'published',
})
