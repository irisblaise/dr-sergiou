'use client'

import { motion, useReducedMotion } from 'framer-motion'
import styles from './Teasers.module.scss'

type Props = {
    label: string
    sub?: string
    /** fired = pink (correct / active); dim = a wrong answer, never red; ink = neutral. */
    tone?: 'fired' | 'dim' | 'ink'
    className?: string
}

// The homepage region-callout language (LayersOfExploration's markers):
// small dot, thin leader line, uppercase mono label plus a subline. Used for
// targets, answers and results, and to close every reveal with its region.
export default function Callout({ label, sub, tone = 'ink', className }: Props) {
    const reduced = useReducedMotion()
    return (
        <div className={`${styles.callout} ${styles[`callout_${tone}`]} ${className ?? ''}`}>
            <svg className={styles.calloutLeader} viewBox="0 0 40 10" aria-hidden>
                <circle cx="3.5" cy="5" r="2.6" />
                <motion.path
                    d="M7 5 L40 5"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
                />
            </svg>
            <div>
                <div className={styles.calloutLabel}>{label}</div>
                {sub && <div className={styles.calloutSub}>{sub}</div>}
            </div>
        </div>
    )
}
