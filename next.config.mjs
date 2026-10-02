import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Sanity Studio (embedded at /studio) renders with styled-components.
    compiler: {
        styledComponents: true,
    },
    // SCSS lives in src/ alongside components; tell Sass where to resolve
    // `@import` / `@use` from so the existing partials keep working.
    sassOptions: {
        includePaths: ['./src'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
            },
            // Poster frames for YouTube assets in the Impact thumbnail strip.
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            },
        ],
        // WebP only: AVIF encodes ~50% slower, and that cost lands on whoever
        // first requests each size — the "images take a while on first visit"
        // delay. Sources are already WebP, so AVIF's size win here was small.
        // (Sanity images bypass this optimizer — see lib/sanityImageLoader.ts.)
        formats: ['image/webp'],
        // Local images are static imports with content-hashed URLs, so a long
        // TTL can't serve a stale file; it just stops variants going cold
        // every 4 hours (the default).
        minimumCacheTTL: 2678400, // 31 days
    },
}

export default withBundleAnalyzer(nextConfig)
