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
        // Next only serves WebP by default; add AVIF (usually smaller for photos).
        formats: ['image/avif', 'image/webp'],
    },
}

export default withBundleAnalyzer(nextConfig)
