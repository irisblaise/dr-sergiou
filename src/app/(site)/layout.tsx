import styles from '../layout.module.scss'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

// Site chrome — wraps every public page but NOT the /studio route (which lives
// outside this group and so only gets the bare root layout).
export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className={styles.bgGlow} aria-hidden />
            <Navbar />
            <main className={styles.main}>{children}</main>
            <Footer />
        </>
    )
}
