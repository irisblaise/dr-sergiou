import styles from './Teasers.module.scss'

// Placeholder while a game's chunk loads — fills the panel's fixed body
// height, so nothing shifts when the game swaps in.
export default function TeaserLoading() {
    return <div className={styles.loading} aria-hidden />
}
