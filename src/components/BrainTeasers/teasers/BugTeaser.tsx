'use client'

import { useState } from 'react'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import SpecimenJarArt from '../art/SpecimenJarArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

// 02 CODING — "Spot the bug". Pick the line that crashes, then CHECK →.
// A wrong pick dims (never red) and stays dimmed; the right one fires pink.
export default function BugTeaser({ teaser, onSolved }: TeaserProps<'bug'>) {
    const [selected, setSelected] = useState<number | null>(null)
    const [ruledOut, setRuledOut] = useState<number[]>([])
    const [solved, setSolved] = useState(false)
    const [lastWrong, setLastWrong] = useState<number | null>(null)

    const check = () => {
        if (selected == null) return
        if (selected === teaser.bugLine) {
            setSolved(true)
            onSolved()
        } else {
            setRuledOut((r) => [...r, selected])
            setLastWrong(selected)
            setSelected(null)
        }
    }

    return (
        <div className={styles.game}>
            <div className={styles.artRow}>
                <div className={styles.artHeader}>
                    <SpecimenJarArt />
                </div>
                <p className={styles.prompt}>{teaser.prompt}</p>
            </div>

            <ol className={styles.code} aria-label="Code">
                {teaser.codeLines.map((line, i) => {
                    const n = i + 1
                    const out = ruledOut.includes(n)
                    const isBug = solved && n === teaser.bugLine
                    return (
                        <li key={n}>
                            <button
                                type="button"
                                className={[
                                    styles.codeLine,
                                    selected === n ? styles.codeLineSelected : '',
                                    out ? styles.codeLineDim : '',
                                    isBug ? styles.codeLineFired : '',
                                ].join(' ')}
                                aria-pressed={selected === n}
                                disabled={solved || out}
                                onClick={() => setSelected(n)}
                            >
                                <span className={styles.lineNo}>{n}</span>
                                <code className={styles.codeText}>{line}</code>
                            </button>
                        </li>
                    )
                })}
            </ol>

            {solved ? (
                <Reveal
                    result={
                        <Callout label={`LINE ${teaser.bugLine}`} sub="MATLAB INDEXES FROM 1" tone="fired" />
                    }
                    text={teaser.reveal}
                    region={teaser.region}
                />
            ) : (
                <div className={styles.actions}>
                    <p className={styles.feedback} role="status">
                        {lastWrong != null ? `Line ${lastWrong} runs fine. Try another.` : ' '}
                    </p>
                    <ArrowLink className={styles.action} onClick={check} disabled={selected == null}>
                        CHECK
                    </ArrowLink>
                </div>
            )}
        </div>
    )
}
