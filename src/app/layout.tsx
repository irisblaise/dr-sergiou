import type { Metadata, Viewport } from 'next'
import '../fonts/fonts.css'
import '../styles/global.scss'
import styles from './layout.module.scss'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <div className={styles.bgGlow} aria-hidden />
                <Navbar />
                <main className={styles.main}>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
