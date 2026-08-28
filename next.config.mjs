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
        ],
    },
}

export default nextConfig
