import Link from 'next/link'
import styles from './error.module.scss'

export default function NotFound() {
    return (
        <div className={styles.wrap}>
            <div className={styles.eyebrow}>404</div>
            <h1 className={styles.heading}>Page not found</h1>
            <p className={styles.body}>The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
            <div className={styles.actions}>
                <Link href="/" className={styles.button}>
                    Back to home
                </Link>
            </div>
        </div>
    )
}
