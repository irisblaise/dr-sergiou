import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.carmensergiou.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/projects', '/publications', '/skills', '/impact', '/contact']
    return routes.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.7,
    }))
}
