'use client'

import { forwardRef } from 'react'
import type { Publication } from '../../data/types'
import AccoladeIcon from '../AccoladeIcon/AccoladeIcon'
import { getSpineCover } from './spinePalette'
import styles from './BookSpine.module.scss'

interface Props {
    publication: Publication
    index: number
    selected: boolean
    dimmed: boolean
    onSelect: () => void
}

const BookSpine = forwardRef<HTMLButtonElement, Props>(function BookSpine(
    { publication, index, selected, dimmed, onSelect },
    ref,
) {
    const { title, year, journal, accolade } = publication
    const cover = getSpineCover(index)
    return (
        <button
            ref={ref}
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={[
                styles.spine,
                selected ? styles.selected : '',
                dimmed ? styles.dimmed : '',
            ].join(' ')}
            style={{ ['--cover' as string]: cover.bg, ['--ink-on' as string]: cover.text }}
        >
            <span className={styles.topbar} aria-hidden />
            <span className={styles.year}>{year}</span>
            <span className={styles.rule} aria-hidden />
            <span className={styles.title}>{title}</span>
            <span className={styles.rule} aria-hidden />
            {accolade && (
                <span className={styles.accolade} title={accolade.label}>
                    <AccoladeIcon type={accolade.type} size={15} />
                </span>
            )}
            <span className={styles.journal}>{journal}</span>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
        </button>
    )
})

export default BookSpine
