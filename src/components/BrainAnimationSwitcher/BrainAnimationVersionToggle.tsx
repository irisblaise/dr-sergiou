'use client'

import { useBrainAnimationVersion } from './BrainAnimationVersionContext'
import styles from './BrainAnimationVersionToggle.module.scss'

// Temporary — see BrainAnimationSwitcher.tsx. Placed in the bottom-right
// corner of the hero header so it scrolls away with it, rather than staying
// pinned to the viewport for the whole page.
export default function BrainAnimationVersionToggle() {
    const [version, choose] = useBrainAnimationVersion()

    return (
        <div className={styles.toggle} role="group" aria-label="Brain animation version">
            <button
                type="button"
                className={`${styles.option} ${version === 'new' ? styles.active : ''}`}
                onClick={() => choose('new')}
            >
                New
            </button>
            <button
                type="button"
                className={`${styles.option} ${version === 'classic' ? styles.active : ''}`}
                onClick={() => choose('classic')}
            >
                Classic
            </button>
        </div>
    )
}
