'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, type PanInfo } from 'framer-motion'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import AxialSliceArt from '../art/AxialSliceArt'
import EvidenceTagArt from '../art/EvidenceTagArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

const SWIPE_PX = 80
const pad2 = (n: number) => String(n).padStart(2, '0')

// 06 FORENSIC — "Myth or Fact?". Three evidence-tag cards: swipe, press
// ← / →, or use the buttons. Each card flips to a one-line correction.
export default function SwipeTeaser({ teaser, onSolved }: TeaserProps<'swipe'>) {
    const reduced = useReducedMotion()
    const [index, setIndex] = useState(0)
    const [answers, setAnswers] = useState<boolean[]>([]) // what the visitor said: true = fact
    const [done, setDone] = useState(false)
    const total = teaser.statements.length
    const card = teaser.statements[Math.min(index, total - 1)]
    const flipped = answers.length > index
    const said = answers[index]
    const correct = flipped && said === card.isFact
    const score = answers.filter((a, i) => a === teaser.statements[i].isFact).length

    const answer = (isFact: boolean) => {
        if (flipped || done) return
        setAnswers((a) => [...a, isFact])
    }

    const next = () => {
        if (index < total - 1) {
            setIndex(index + 1)
        } else {
            setDone(true)
            onSolved()
        }
    }

    // ← / → as the keyboard equivalent of swiping, while this card is face up.
    const answerRef = useRef(answer)
    useEffect(() => {
        answerRef.current = answer
    })
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') answerRef.current(false)
            else if (e.key === 'ArrowRight') answerRef.current(true)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > SWIPE_PX) answer(true)
        else if (info.offset.x < -SWIPE_PX) answer(false)
    }

    if (done) {
        return (
            <div className={styles.game}>
                <p className={styles.prompt}>{teaser.prompt}</p>
                <div className={styles.swipeDone}>
                    <Reveal
                        result={
                            <Callout
                                label={`${score} / ${total} CORRECT`}
                                sub="CASE CLOSED"
                                tone={score === total ? 'fired' : 'ink'}
                            />
                        }
                        text={teaser.reveal}
                        region={teaser.region}
                    />
                </div>
            </div>
        )
    }

    const flipTransition = reduced ? { duration: 0 } : { duration: 0.6, ease: [0.2, 0.85, 0.25, 1] as const }

    return (
        <div className={styles.game}>
            <p className={styles.prompt}>{teaser.prompt}</p>

            <div className={styles.cardStage}>
                {/* the rest of the evidence, stacked behind */}
                {Array.from({ length: total - index - 1 }, (_, k) => (
                    <div
                        key={k}
                        className={styles.cardBehind}
                        style={{ transform: `translate(${(k + 1) * 5}px, ${(k + 1) * -5}px)` }}
                        aria-hidden
                    >
                        <EvidenceTagArt />
                    </div>
                ))}

                <motion.div
                    key={index}
                    className={styles.cardDrag}
                    drag={flipped ? false : 'x'}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={onDragEnd}
                    initial={{ opacity: reduced ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.35 }}
                >
                    <motion.div
                        className={styles.cardFlip}
                        initial={false}
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={flipTransition}
                    >
                        <div className={styles.cardFace} aria-hidden={flipped}>
                            <EvidenceTagArt />
                            <div className={styles.cardContent}>
                                <span className={styles.cardLabel}>
                                    EXHIBIT {pad2(index + 1)} / {pad2(total)}
                                </span>
                                <p className={styles.cardText}>{card.text}</p>
                            </div>
                            {card.illustration === 'axial-slice' && (
                                <div className={styles.cardIllustration}>
                                    <AxialSliceArt />
                                </div>
                            )}
                        </div>
                        <div className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!flipped}>
                            <EvidenceTagArt />
                            <div className={styles.cardContent}>
                                <Callout
                                    label={card.isFact ? 'FACT' : 'MYTH'}
                                    sub={correct ? 'YOU GOT IT' : `YOU SAID ${said ? 'FACT' : 'MYTH'}`}
                                    tone={correct ? 'fired' : 'dim'}
                                />
                                <p className={styles.cardText}>{card.explanation}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className={styles.swipeActions}>
                {flipped ? (
                    <ArrowLink className={styles.action} onClick={next}>
                        {index < total - 1 ? 'NEXT EXHIBIT' : 'CLOSE THE CASE'}
                    </ArrowLink>
                ) : (
                    <>
                        <button type="button" className={styles.action} onClick={() => answer(false)}>
                            <span aria-hidden>←</span> MYTH
                        </button>
                        <span className={styles.swipeHint}>SWIPE OR ← / →</span>
                        <ArrowLink className={styles.action} onClick={() => answer(true)}>
                            FACT
                        </ArrowLink>
                    </>
                )}
            </div>
        </div>
    )
}
