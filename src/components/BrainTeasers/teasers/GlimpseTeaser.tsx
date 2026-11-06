'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import StreetArt, { HOUSE_X } from '../art/StreetArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

// 03 VR — "Scout the target". One timed look at a street of four houses, then
// it fades; pick the one you'd break into. Each house carries a cue from the
// Virtual Burglary Study: cover and easy access are good picks (and solve the
// teaser), signs that someone's home are not (TRY AGAIN). Reduced motion: no
// timed fade, the visitor hides the street themselves.

type Phase = 'intro' | 'ready' | 'glimpse' | 'choose' | 'done'
const READY_MS = 2500 // the "look at the details" cue before the street shows
const FADE_S = 0.6
const STREET_W = 320 // StreetArt's viewBox width
const HOUSE_W = 54

export default function GlimpseTeaser({ teaser, onSolved }: TeaserProps<'glimpse'>) {
    const reduced = useReducedMotion()
    const [phase, setPhase] = useState<Phase>('intro')
    const [pick, setPick] = useState<number | null>(null)
    const firstHouseRef = useRef<HTMLButtonElement>(null)

    // After LOOK: a short cue, then the street.
    useEffect(() => {
        if (phase !== 'ready') return
        const t = setTimeout(() => setPhase('glimpse'), READY_MS)
        return () => clearTimeout(t)
    }, [phase])

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
        if (teaser.houses[i].good) onSolved()
    }

    const showStreet = phase === 'glimpse' || phase === 'done'
    const seconds = Math.round(teaser.glimpseMs / 1000)

    return (
        <div className={styles.game}>
            <p className={styles.prompt}>{teaser.prompt}</p>

            {phase === 'intro' ? (
                // Nothing of the street before LOOK — the one glimpse is the game.
                <ol className={styles.glimpseSteps}>
                    <li>
                        <span>
                            Press <strong>LOOK</strong>.{' '}
                            {reduced
                                ? 'A street of four houses appears and stays until you hide it.'
                                : `A street of four houses appears for ${seconds} seconds.`}
                        </span>
                    </li>
                    <li>
                        <span>Take in every house: what’s around it, what’s open, who might be home.</span>
                    </li>
                    <li>
                        <span>The houses disappear. Pick the one you’d break into.</span>
                    </li>
                </ol>
            ) : phase === 'ready' ? (
                <p className={styles.glimpseReady}>Look at the details of the houses and make your choice.</p>
            ) : (
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
                            className={`${styles.houseMark} ${teaser.houses[pick].good ? '' : styles.houseMarkMiss}`}
                            style={{ left: `${((HOUSE_X[pick] + HOUSE_W / 2) / STREET_W) * 100}%` }}
                            aria-hidden
                        />
                    )}
                </div>
            )}

            {phase === 'done' && pick != null ? (
                <Reveal
                    result={
                        <Callout
                            label={`HOUSE ${pick + 1}`}
                            sub={teaser.houses[pick].label}
                            tone={teaser.houses[pick].good ? 'fired' : 'dim'}
                        />
                    }
                    heading={teaser.houses[pick].good ? teaser.goodHeading : teaser.badHeading}
                    text={teaser.houses[pick].text}
                    onPlayAgain={() => {
                        setPick(null)
                        setPhase('intro')
                    }}
                    againLabel={teaser.houses[pick].good ? 'PLAY AGAIN' : 'TRY AGAIN'}
                />
            ) : (
                <div className={styles.actions}>
                    <p className={styles.feedback} role="status">
                        {phase === 'ready'
                            ? 'Get ready…'
                            : phase === 'glimpse'
                              ? reduced
                                  ? 'Take your time. Hide the street when you’re ready.'
                                  : 'Look closely…'
                              : phase === 'choose'
                                ? 'Which one?'
                                : reduced
                                  ? 'Ready when you are.'
                                  : `You get ${seconds} seconds.`}
                    </p>
                    {phase === 'intro' && (
                        <ArrowLink className={styles.action} onClick={() => setPhase('ready')}>
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
