'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Region } from '../../../content/teasers'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import Callout from './Callout'
import styles from './Teasers.module.scss'

type Props = {
    /** The game's own result line (score, the right answer…). */
    result?: ReactNode
    text: string
    region: Region
    onPlayAgain?: () => void
}

// Every reveal: Carmen's first-person line, then the brain region that did
// the work, in the homepage label format (`VS — REWARD VALUATION`). Stays on
// screen until the visitor presses X.
export default function Reveal({ result, text, region, onPlayAgain }: Props) {
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
            <p className={styles.revealText}>{text}</p>
            <Callout label={region.code} sub={region.label} tone="fired" className={styles.revealRegion} />
            {onPlayAgain && (
                <ArrowLink className={styles.action} onClick={onPlayAgain}>
                    PLAY AGAIN
                </ArrowLink>
            )}
        </motion.div>
    )
}
