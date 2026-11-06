'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import styles from './Teasers.module.scss'

type Props = {
    /** The game's own result line (score, the right answer…). */
    result?: ReactNode
    /** Optional opening line, set apart above the text. */
    heading?: string
    text: string
    onPlayAgain?: () => void
    /** Label for the onPlayAgain action; defaults to PLAY AGAIN. */
    againLabel?: string
}

// Every reveal: the game's result, then Carmen's first-person line. Stays on
// screen until the visitor presses X.
export default function Reveal({ result, heading, text, onPlayAgain, againLabel = 'PLAY AGAIN' }: Props) {
    const reduced = useReducedMotion()
    return (
        <motion.div
            className={styles.reveal}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
            role="status"
        >
            {result && <div className={styles.result}>{result}</div>}
            {heading && <p className={styles.revealHeading}>{heading}</p>}
            <p className={styles.revealText}>{text}</p>
            {onPlayAgain && (
                <ArrowLink className={styles.action} onClick={onPlayAgain}>
                    {againLabel}
                </ArrowLink>
            )}
        </motion.div>
    )
}
