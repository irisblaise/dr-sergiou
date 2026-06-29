'use client'

import { useCallback, useEffect, useRef } from 'react'
import { skills, skillsIntro } from '../../data/skills'
import type { SkillKey } from '../../data/types'
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

export default function Skills() {
    const wrapRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)

    const fit = useCallback(() => {
        const wrap = wrapRef.current
        const stage = stageRef.current
        if (!wrap || !stage) return
        const vw = wrap.clientWidth
        if (vw < 1) return // hidden (mobile layout active)
        const s = Math.min(1, (vw - 24) / STAGE_W)
        const tx = Math.max(0, (vw - STAGE_W * s) / 2)
        stage.style.transformOrigin = 'top left'
        stage.style.transform = `translateX(${tx}px) scale(${s})`
        wrap.style.height = `${STAGE_H * s}px`
    }, [])

    useEffect(() => {
        fit()
        const wrap = wrapRef.current
        if (!wrap || typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', fit)
            return () => window.removeEventListener('resize', fit)
        }
        // Only react to WIDTH changes (fit() sets the wrapper height, which would
        // otherwise re-trigger the observer → "ResizeObserver loop" warning).
        // Defer via rAF to break any synchronous notification loop.
        let lastWidth = -1
        let raf = 0
        const ro = new ResizeObserver((entries) => {
            const width = Math.round(entries[0].contentRect.width)
            if (width === lastWidth) return
            lastWidth = width
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(fit)
        })
        ro.observe(wrap)
        return () => {
            ro.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [fit])

    return (
        <div className={styles.page}>
            {/* ---------- Desktop: radial neuron map ---------- */}
            <div className={styles.stageWrap} ref={wrapRef}>
                <div className={styles.stage} ref={stageRef} style={{ width: STAGE_W, height: STAGE_H }}>
                    {/* Intro */}
                    <div className={styles.intro} style={{ left: 60, top: 150, width: 300 }}>
                        <h1 className={styles.heading}>{skillsIntro.heading}</h1>
                        <div className={styles.eyebrow}>{skillsIntro.eyebrow}</div>
                        <p className={styles.paragraph}>{skillsIntro.paragraph}</p>
                    </div>

                    {/* Centre piece */}
                    <div className={styles.aura} />
                    <img className={styles.neuron} src={neuron} alt="" />

                    {/* Nodes */}
                    {skills.map((s) => {
                        const n = NODES[s.key]
                        return (
                            <div
                                key={`node-${s.key}`}
                                className={styles.node}
                                style={{ left: n.left, top: n.top }}
                            >
                                <img src={s.image} alt={s.label} />
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
                                <img src={s.image} alt={s.label} />
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
