'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import StreetArt, { HOUSE_X } from '../art/StreetArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

// 03 VR — "Case the joint". One timed look at a street of four houses, then
// it fades; pick the one you'd break into. There's no wrong answer — the
// reveal is about which cues you were weighing. Reduced motion: no timed
// fade, the visitor hides the street themselves.

type Phase = 'intro' | 'glimpse' | 'choose' | 'done'
const FADE_S = 0.6
const STREET_W = 320 // StreetArt's viewBox width
const HOUSE_W = 54

export default function GlimpseTeaser({ teaser, onSolved }: TeaserProps<'glimpse'>) {
    const reduced = useReducedMotion()
    const [phase, setPhase] = useState<Phase>('intro')
    const [pick, setPick] = useState<number | null>(null)
    const firstHouseRef = useRef<HTMLButtonElement>(null)

    // The glimpse: timed only with motion allowed.
    useEffect(() => {
        if (phase !== 'glimpse' || reduced) return
        const t = setTimeout(() => setPhase('choose'), teaser.glimpseMs)
        return () => clearTimeout(t)
    }, [phase, reduced, teaser.glimpseMs])

    // The button that started the glimpse is gone — focus the first house.
    useEffect(() => {
        if (phase === 'choose') firstHouseRef.current?.focus()
    }, [phase])

    const choose = (i: number) => {
        setPick(i)
        setPhase('done')
        onSolved()
    }

    const showStreet = phase === 'glimpse' || phase === 'done'

    return (
        <div className={styles.game}>
            <p className={styles.prompt}>{teaser.prompt}</p>

            <div className={styles.street}>
                {/* bare street underneath; the houses fade over it */}
                <div className={styles.streetLayer}>
                    <StreetArt bare />
                </div>
                <motion.div
                    className={styles.streetLayer}
                    initial={false}
                    animate={{ opacity: showStreet ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: phase === 'glimpse' ? 0.25 : FADE_S }}
                    aria-hidden={!showStreet}
                >
                    <StreetArt />
                </motion.div>

                {phase === 'choose' && (
                    <div className={styles.houseButtons}>
                        {HOUSE_X.map((x, i) => (
                            <button
                                key={i}
                                ref={i === 0 ? firstHouseRef : undefined}
                                type="button"
                                className={styles.houseButton}
                                style={{ left: `${(x / STREET_W) * 100}%`, width: `${(HOUSE_W / STREET_W) * 100}%` }}
                                onClick={() => choose(i)}
                            >
                                HOUSE {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {phase === 'done' && pick != null && (
                    <span
                        className={styles.houseMark}
                        style={{ left: `${((HOUSE_X[pick] + HOUSE_W / 2) / STREET_W) * 100}%` }}
                        aria-hidden
                    />
                )}
            </div>

            {phase === 'done' && pick != null ? (
                <Reveal
                    result={<Callout label={`HOUSE ${pick + 1}`} sub={teaser.options[pick]} tone="fired" />}
                    text={teaser.reveal}
                    region={teaser.region}
                    onPlayAgain={() => {
                        setPick(null)
                        setPhase('intro')
                    }}
                />
            ) : (
                <div className={styles.actions}>
                    <p className={styles.feedback} role="status">
                        {phase === 'glimpse'
                            ? reduced
                                ? 'Take your time. Hide the street when you’re ready.'
                                : 'Look closely…'
                            : phase === 'choose'
                              ? 'Which one?'
                              : `You get ${Math.round(teaser.glimpseMs / 1000)} seconds.`}
                    </p>
                    {phase === 'intro' && (
                        <ArrowLink className={styles.action} onClick={() => setPhase('glimpse')}>
                            LOOK
                        </ArrowLink>
                    )}
                    {phase === 'glimpse' && reduced && (
                        <ArrowLink className={styles.action} onClick={() => setPhase('choose')}>
                            HIDE THE STREET
                        </ArrowLink>
                    )}
                </div>
            )}
        </div>
    )
}
