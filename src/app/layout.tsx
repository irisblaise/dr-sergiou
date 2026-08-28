import type { Metadata, Viewport } from 'next'
import '../fonts/fonts.css'
import '../styles/global.scss'
import { getSiteSettings } from '../sanity/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.carmensergiou.com'
const DEFAULT_TITLE = 'Dr. Carmen-Silva Sergiou'
const DEFAULT_DESCRIPTION =
    'Neuroscientist and behavioural researcher — portfolio, publications, and impact.'

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings()
    const title = settings?.defaultSeo?.metaTitle || DEFAULT_TITLE
    const description = settings?.defaultSeo?.metaDescription || DEFAULT_DESCRIPTION
    const ogImage = settings?.defaultSeo?.ogImage

    return {
        metadataBase: new URL(SITE_URL),
        title: { default: title, template: `%s — ${DEFAULT_TITLE}` },
        description,
        manifest: '/manifest.json',
        robots: { index: true, follow: true },
        openGraph: {
            type: 'website',
            siteName: DEFAULT_TITLE,
            title,
            description,
            url: SITE_URL,
            images: ogImage
                ? [{ url: ogImage, width: 1200, height: 630, alt: settings?.defaultSeo?.ogImageAlt || title }]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#000000',
}

// Minimal root layout: only <html>/<body> + global styles. The site chrome
// (Navbar/Footer/background) lives in the (site) route group so it never wraps
// the embedded Studio at /studio.
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
