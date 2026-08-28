'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { skillsIntro } from '../../data/skills'
import type { Skill, SkillKey } from '../../data/types'
const neuron = '/assets/handoff/neuron-pink.png'
import styles from './Skills.module.scss'

const STAGE_W = 1400
const STAGE_H = 880

// Node image-slot positions (top-left corner) in the 1400×880 stage.
const NODES: Record<SkillKey, { left: number; top: number }> = {
    neuro: { left: 447, top: 150 },
    coding: { left: 835, top: 175 },
    forensic: { left: 320, top: 410 },
    vr: { left: 940, top: 410 },
    behavior: { left: 430, top: 635 },
    music: { left: 810, top: 635 },
}

// Outboard text labels — left column right-aligned, right column left-aligned.
const LABELS: Record<SkillKey, { left: number; top: number; width: number; align: 'left' | 'right' }> = {
    neuro: { left: 230, top: 150, width: 205, align: 'right' },
    coding: { left: 1000, top: 200, width: 200, align: 'left' },
    forensic: { left: 90, top: 445, width: 200, align: 'right' },
    vr: { left: 1108, top: 445, width: 200, align: 'left' },
    behavior: { left: 170, top: 648, width: 240, align: 'right' },
    music: { left: 975, top: 648, width: 240, align: 'left' },
}

export default function Skills({ skills }: { skills: Skill[] }) {
    const wrapRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)

    const fit = useCallback(() => {
        const wrap = wrapRef.current
        const stage = stageRef.current
        if (!wrap || !stage) return
        // The map div (.stageWrap) is a flex child that fills the space below the
        // intro; contain the stage within that box (by width OR height) and centre.
        const vw = wrap.clientWidth
        const vh = wrap.clientHeight
        if (vw < 1 || vh < 1) return // hidden (mobile layout active)
        const s = Math.min(1, (vw - 24) / STAGE_W, (vh - 24) / STAGE_H)
        const tx = Math.max(0, (vw - STAGE_W * s) / 2)
        const ty = Math.max(0, (vh - STAGE_H * s) / 2)
        stage.style.transformOrigin = 'top left'
        stage.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
    }, [])

    useEffect(() => {
        fit()
        // fit() only sets the stage transform (never the wrap size), so observing
        // the wrap can't loop. Refit on any viewport/layout change.
        let raf = 0
        const onResize = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(fit)
        }
        window.addEventListener('resize', onResize)
        const ro =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
        if (ro && wrapRef.current) ro.observe(wrapRef.current)
        return () => {
            window.removeEventListener('resize', onResize)
            ro?.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [fit])

    return (
        <div className={styles.page}>
            {/* Intro — normal element at the standard page-intro position (not
                scaled with the map), matching the other pages. */}
            <div className={styles.intro}>
                <h1 className={styles.heading}>{skillsIntro.heading}</h1>
                <div className={styles.eyebrow}>{skillsIntro.eyebrow}</div>
                <p className={styles.paragraph}>{skillsIntro.paragraph}</p>
            </div>

            {/* ---------- Desktop: radial neuron map ---------- */}
            <div className={styles.stageWrap} ref={wrapRef}>
                <div className={styles.stage} ref={stageRef} style={{ width: STAGE_W, height: STAGE_H }}>
                    {/* Radial cluster — shifted right of the intro via .cluster */}
                    <div className={styles.cluster}>
                        {/* Centre piece */}
                        <div className={styles.aura} />
                        <Image
                            className={styles.neuron}
                            src={neuron}
                            alt=""
                            width={1024}
                            height={1024}
                        />

                        {/* Nodes */}
                        {skills.map((s) => {
                            const n = NODES[s.key]
                            return (
                                <div
                                    key={`node-${s.key}`}
                                    className={styles.node}
                                    style={{ left: n.left, top: n.top }}
                                >
                                    <div className={styles.nodeImgWrap}>
                                        <Image
                                            src={s.image}
                                            alt={s.imageAlt || s.label}
                                            fill
                                            sizes="150px"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: 'left top',
                                                mixBlendMode: 'multiply',
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}

                        {/* Labels */}
                        {skills.map((s) => {
                            const l = LABELS[s.key]
                            return (
                                <div
                                    key={`label-${s.key}`}
                                    className={styles.label}
                                    style={{ left: l.left, top: l.top, width: l.width, textAlign: l.align }}
                                >
                                    <div className={styles.labelTitle}>{s.label}</div>
                                    <div className={styles.labelDetail}>{s.detail}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ---------- Mobile: vertical timeline ---------- */}
            <div className={styles.mobile}>
                <header className={styles.mHeader}>
                    <h1 className={styles.mHeading}>{skillsIntro.heading}</h1>
                    <div className={styles.eyebrow}>{skillsIntro.eyebrow}</div>
                    <p className={styles.mParagraph}>{skillsIntro.paragraph}</p>
                </header>

                <div className={styles.timeline}>
                    <span className={styles.timelineLine} aria-hidden />
                    {skills.map((s, i) => (
                        <div
                            key={s.key}
                            className={`${styles.row} ${i === skills.length - 1 ? styles.rowLast : ''}`}
                        >
                            <span className={styles.mNode}>
                                <Image src={s.image} alt={s.imageAlt || s.label} fill sizes="56px" />
                            </span>
                            <span className={styles.mText}>
                                <span className={styles.mLabel}>{s.label}</span>
                                <span className={styles.mDetail}>{s.detail}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
