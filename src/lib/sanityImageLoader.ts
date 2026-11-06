import type { ImageLoader } from 'next/image'

// Sanity's CDN resizes and re-encodes on its own edge (and caches every
// variant there), so CMS images skip Next's optimizer entirely. Routing them
// through /_next/image meant the first visitor to each page paid for Vercel
// downloading the full-size original upload and re-encoding it on the spot.
const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality ?? 75))
    url.searchParams.set('fit', 'max') // never upscale past the original
    url.searchParams.set('auto', 'format') // WebP/AVIF per the browser's Accept
    return url.toString()
}

// `src` may also be a local fallback or a YouTube poster — those keep the
// default Next loader.
export function sanityLoaderFor(src: string): ImageLoader | undefined {
    return src.startsWith('https://cdn.sanity.io/images/') ? sanityImageLoader : undefined
}
