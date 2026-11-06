'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import styles from './error.module.scss'

// Route-group error boundary: catches any thrown error in a (site) page —
// most likely a Sanity fetch failure — and shows a branded fallback instead
// of Next's generic default error page. Server Components still need to
// throw (rather than swallow) for this to trigger.
export default function SiteError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className={styles.wrap}>
            <div className={styles.eyebrow}>Something went wrong</div>
            <h1 className={styles.heading}>This page couldn&apos;t load</h1>
            <p className={styles.body}>
                We hit a problem fetching this page&apos;s content. Try again, or head back to the homepage.
            </p>
            <div className={styles.actions}>
                <button type="button" className={styles.button} onClick={() => reset()}>
                    Try again
                </button>
                <Link href="/" className={styles.link}>
                    Back to home
                </Link>
            </div>
        </div>
    )
}
