/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // SCSS lives in src/ alongside components; tell Sass where to resolve
    // `@import` / `@use` from so the existing partials keep working.
    sassOptions: {
        includePaths: ['./src'],
    },
}

export default nextConfig
