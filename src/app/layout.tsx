import type { Metadata, Viewport } from 'next'
import '../fonts/fonts.css'
import '../styles/global.scss'

export const metadata: Metadata = {
    title: 'Dr. Carmen-Silva Sergiou',
    description: 'A online portfolio from Dr. Carmen Silva Sergiou',
    manifest: '/manifest.json',
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
