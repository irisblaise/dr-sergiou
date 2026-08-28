import type { Metadata } from 'next'
import Home from '../../../views/Home/Home'
import { getHome, getSiteSettings } from '../../../sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
    const home = await getHome()
    const title = home?.seo?.metaTitle || home?.heroHeadline || 'Dr. Carmen-Silva Sergiou'
    const description =
        home?.seo?.metaDescription ||
        home?.heroIntro?.[0] ||
        'Neuroscientist and behavioural researcher — portfolio, publications, and impact.'
    const ogImage = home?.seo?.ogImage

    return {
        title,
        description,
        alternates: { canonical: '/classic' },
        robots: { index: false, follow: false },
        openGraph: {
            title,
            description,
            url: '/classic',
            images: ogImage ? [{ url: ogImage, alt: home?.seo?.ogImageAlt || title }] : undefined,
        },
        twitter: { title, description, images: ogImage ? [ogImage] : undefined },
    }
}

export default async function Page() {
    const [home, settings] = await Promise.all([getHome(), getSiteSettings()])

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Dr. Carmen-Silva Sergiou',
        jobTitle: 'Neuroscientist',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.carmensergiou.com',
        description: home?.seo?.metaDescription || home?.heroIntro?.[0],
        sameAs: settings?.socialLinks?.length ? settings.socialLinks : undefined,
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Home home={home} />
        </>
    )
}
