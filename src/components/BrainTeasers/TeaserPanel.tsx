'use client'

import { type ElementType, useEffect, useId, useRef } from 'react'
import type { Teaser } from '../../content/teasers'
import TeaserGame from './teasers/TeaserGame'
import styles from './TeaserPanel.module.scss'

type Props = {
    teaser: Teaser
    /** 1-based position in TEASER_ORDER, for the `TEASER 02 / 06` readout. */
    index: number
    total: number
    /** The skill's display label from Sanity, e.g. "CODING". */
    label: string
    onClose: () => void
    onSolved: () => void
    /** Radix Dialog needs its own Title component for the sheet; the popover uses a plain h2. */
    titleAs?: ElementType
}

const pad2 = (n: number) => String(n).padStart(2, '0')

// The one content component shared by the desktop popover and the mobile
// sheet: header readout, X button, title, and the lazily-loaded game.
export default function TeaserPanel({ teaser, index, total, label, onClose, onSolved, titleAs }: Props) {
    const Title = titleAs ?? 'h2'
    const titleId = useId()
    const ref = useRef<HTMLDivElement>(null)

    // Focus moves into the panel on open — and again when another arm swaps
    // its teaser in while the panel is already open.
    useEffect(() => {
        ref.current?.focus({ preventScroll: true })
    }, [teaser.branch])

    return (
        <div ref={ref} className={styles.panel} data-kind={teaser.kind} tabIndex={-1} aria-labelledby={titleId}>
            <div className={styles.head}>
                <span className={styles.readout}>
                    TEASER {pad2(index)} / {pad2(total)} &nbsp;·&nbsp;{' '}
                    <span className={styles.readoutSubject}>{label}</span>
                </span>
                <button type="button" className={styles.close} aria-label="Close teaser" onClick={onClose}>
                    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
                        <path d="M3 3 L13 13 M13 3 L3 13" />
                    </svg>
                </button>
            </div>
            <Title id={titleId} className={styles.title}>
                {teaser.title}
            </Title>
            <div className={styles.body}>
                {/* Keyed by branch: switching arms resets the unsolved game. */}
                <TeaserGame key={teaser.branch} teaser={teaser} onSolved={onSolved} />
            </div>
        </div>
    )
}
