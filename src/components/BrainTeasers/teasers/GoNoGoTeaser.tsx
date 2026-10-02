'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import HoverHandArt from '../art/HoverHandArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

// 05 BEHAVIOR — "Don't." A go/no-go task: tap every pink pulse, never the
// pale one. The pace tightens over the run; reaching the end solves it, and
// the score is how often you "lost control" (tapped a no-go).
//
// Reduced motion: no speed-up — a fixed, slower pace with a longer window.

const NOGO_RATE = 0.28
const START_INTERVAL = 1150
const END_INTERVAL = 560
const REDUCED_INTERVAL = 1500
const WINDOW_RATIO = 0.78
const REDUCED_WINDOW = 1200

type Stimulus = { id: number; go: boolean; x: number; y: number; hit: 'none' | 'caught' | 'slipped' }
type Phase = 'intro' | 'play' | 'done'

export default function GoNoGoTeaser({ teaser, onSolved }: TeaserProps<'gonogo'>) {
    const reduced = useReducedMotion()
    const [phase, setPhase] = useState<Phase>('intro')
    const [stim, setStim] = useState<Stimulus | null>(null)
    const [score, setScore] = useState({ lostControl: 0, caught: 0, goCount: 0 })
    const [progress, setProgress] = useState(0)
    const arenaRef = useRef<HTMLButtonElement>(null)
    const onSolvedRef = useRef(onSolved)
    useEffect(() => {
        onSolvedRef.current = onSolved
    })

    // The trial loop — a chain of timeouts, torn down if the panel closes or
    // another arm swaps this teaser out mid-run.
    useEffect(() => {
        if (phase !== 'play') return
        // START disappears once the run begins — keep keyboard focus on the arena.
        arenaRef.current?.focus()
        const timers: ReturnType<typeof setTimeout>[] = []
        const start = performance.now()
        let id = 0

        const trial = () => {
            const elapsed = performance.now() - start
            const t = Math.min(1, elapsed / teaser.durationMs)
            setProgress(t)
            if (elapsed >= teaser.durationMs) {
                setStim(null)
                setPhase('done')
                onSolvedRef.current()
                return
            }
            const interval = reduced ? REDUCED_INTERVAL : START_INTERVAL + (END_INTERVAL - START_INTERVAL) * t
            const visible = reduced ? REDUCED_WINDOW : interval * WINDOW_RATIO
            const go = id < 2 || Math.random() > NOGO_RATE // open with two easy go's
            if (go) setScore((s) => ({ ...s, goCount: s.goCount + 1 }))
            setStim({ id: ++id, go, x: 14 + Math.random() * 72, y: 18 + Math.random() * 64, hit: 'none' })
            timers.push(setTimeout(() => setStim(null), visible))
            timers.push(setTimeout(trial, interval))
        }
        timers.push(setTimeout(trial, 500))
        return () => timers.forEach(clearTimeout)
    }, [phase, reduced, teaser.durationMs])

    const respond = () => {
        if (phase !== 'play' || !stim || stim.hit !== 'none') return
        setStim({ ...stim, hit: stim.go ? 'caught' : 'slipped' })
        setScore((s) =>
            stim.go ? { ...s, caught: s.caught + 1 } : { ...s, lostControl: s.lostControl + 1 },
        )
    }

    const start = () => {
        setScore({ lostControl: 0, caught: 0, goCount: 0 })
        setProgress(0)
        setPhase('play')
    }

    return (
        <div className={styles.game}>
            <div className={styles.artRow}>
                <div className={styles.artHeader}>
                    <HoverHandArt />
                </div>
                <p className={styles.prompt}>{teaser.prompt}</p>
            </div>

            {phase === 'done' ? (
                <Reveal
                    result={
                        <Callout
                            label={`LOST CONTROL ${score.lostControl}×`}
                            sub={`${score.caught} / ${score.goCount} PINK PULSES CAUGHT`}
                            tone={score.lostControl === 0 ? 'fired' : 'ink'}
                        />
                    }
                    text={teaser.reveal}
                    region={teaser.region}
                    onPlayAgain={start}
                />
            ) : (
                <>
                    <div className={styles.gngMeta}>
                        <span>LOST CONTROL {score.lostControl}</span>
                        <span className={styles.gngTrack} aria-hidden>
                            <span className={styles.gngFill} style={{ transform: `scaleX(${progress})` }} />
                        </span>
                    </div>
                    <button
                        ref={arenaRef}
                        type="button"
                        className={styles.arena}
                        onPointerDown={(e) => {
                            // Pointer: respond on press, not release — reaction time matters.
                            if (e.pointerType !== 'mouse' || e.button === 0) respond()
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault()
                                respond()
                            }
                        }}
                        disabled={phase !== 'play'}
                        aria-label="Press when the pulse is pink. Hold back when it is pale."
                    >
                        <AnimatePresence>
                            {stim && (
                                <motion.svg
                                    key={stim.id}
                                    viewBox="-20 -20 40 40"
                                    className={[
                                        styles.cell,
                                        stim.go ? styles.cellGo : styles.cellNoGo,
                                        stim.hit === 'slipped' ? styles.cellSlipped : '',
                                    ].join(' ')}
                                    style={{ left: `${stim.x}%`, top: `${stim.y}%` }}
                                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: stim.hit === 'caught' && !reduced ? 1.35 : 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={reduced ? { duration: 0 } : { duration: 0.14 }}
                                    aria-hidden
                                >
                                    <path d="M-7 1 L-15 3 L-18 0 M7 -1 L15 -3 L18 0 M-3 7 L-5 15 M4 6.6 L7 14 M-4 -6.4 L-8 -13 M4 -6.6 L6 -14" />
                                    <circle r={7.5} />
                                    <circle className={styles.cellNucleus} r={2.6} cx={0.8} cy={-0.6} />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                        {phase === 'intro' && <span className={styles.arenaIdle}>PINK = GO · PALE = DON’T</span>}
                    </button>
                    <div className={styles.actions}>
                        <p className={styles.feedback} role="status">
                            {stim?.hit === 'slipped' ? 'That one was pale.' : ' '}
                        </p>
                        {phase === 'intro' && (
                            <ArrowLink className={styles.action} onClick={start}>
                                START
                            </ArrowLink>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
