'use client'

import type { Publication } from '../../data/types'
import AccoladeIcon from '../AccoladeIcon/AccoladeIcon'
import styles from './DetailCard.module.scss'

interface Props {
    publication: Publication
    left: number
    onClose: () => void
}

export default function DetailCard({ publication, left, onClose }: Props) {
    const { year, kind, title, authors, journal, abstract, link, pdf, accolade } = publication
    const readHref = pdf || link
    return (
        <div className={styles.anchor} style={{ left }}>
            <div className={styles.card} role="dialog" aria-label={title}>
                <button className={styles.close} onClick={onClose} aria-label="Close">
                    ×
                </button>
                <div className={styles.year}>{year}</div>
                <div className={styles.kind}>{kind}</div>
                {accolade && (
                    <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                            <AccoladeIcon type={accolade.type} size={13} />
                            {accolade.label}
                        </span>
                    </div>
                )}
                <div className={styles.diamond} aria-hidden>
                    <span /> ◆ <span />
                </div>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.authors}>{authors}</div>
                <div className={styles.journal}>{journal}</div>
                {abstract ? (
                    <p className={styles.abstract}>{abstract}</p>
                ) : (
                    <p className={styles.abstractMuted}>Abstract available in the full publication.</p>
                )}
                {readHref && (
                    <a
                        className={styles.read}
                        href={readHref}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        READ&nbsp;{pdf ? 'PAPER' : 'ABSTRACT'} <span aria-hidden>→</span>
                    </a>
                )}
            </div>
        </div>
    )
}
