import styles from './loading.module.scss'

// Shown while a (site) route's server component awaits its Sanity fetch —
// without this, navigation has no feedback until the data resolves.
export default function Loading() {
    return (
        <div className={styles.wrap} role="status" aria-label="Loading">
            <div className={styles.pulse} aria-hidden />
        </div>
    )
}
