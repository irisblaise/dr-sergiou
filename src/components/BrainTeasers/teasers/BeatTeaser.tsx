'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ArrowLink from '../../ui/ArrowLink/ArrowLink'
import GyriRecordArt from '../art/GyriRecordArt'
import Callout from './Callout'
import Reveal from './Reveal'
import type { TeaserProps } from './registry'
import styles from './Teasers.module.scss'

// 04 MUSIC — "Wait for the drop". A build-up runs toward the drop; tap
// exactly when it hits. The neuron pulses on every beat (onPulse). Sound is
// opt-in: without it you follow the ink waveform building toward the drop
// marker. Reduced motion: no sweeping playhead — a beat countdown instead.

const BPM = 120
const BEAT_MS = 60000 / BPM
const DROP_AT = 0.75 // the drop sits ¾ of the way along the waveform
const HIT_WINDOW_MS = 300

type Phase = 'intro' | 'play' | 'hit' | 'miss'

// ---------- waveform (deterministic, ink line) ----------
const WW = 320
const WH = 80
const WMID = 40

const WAVE = (() => {
    const pts: string[] = []
    const n = 640
    let phase = 0
    for (let i = 0; i <= n; i++) {
        const u = i / n
        const build = Math.min(1, u / DROP_AT)
        // the riser: frequency and amplitude climb toward the drop, then a heavy, steady groove
        const freq = u < DROP_AT ? 0.12 + 0.5 * build ** 2 : 0.34
        phase += freq
        const amp = u < DROP_AT ? 2.5 + 20 * build ** 2.2 : 30 + 3 * Math.sin(u * 140)
        const jitter = Math.sin(i * 7.31) * (u < DROP_AT ? 1 + build * 2 : 3)
        pts.push(`${i ? 'L' : 'M'}${(u * WW).toFixed(2)} ${(WMID + amp * Math.sin(phase) + jitter).toFixed(2)}`)
    }
    return pts.join(' ')
})()

// ---------- opt-in sound: a short build-up synthesised with Web Audio ----------
// Placeholder until a licensed (or Carmen's own) loop exists — pass it as
// `audioSrc` and that file plays instead. Nothing third-party ships.
function playSynthBuild(ctx: AudioContext, dropAtMs: number, totalMs: number) {
    const t0 = ctx.currentTime + 0.05
    const drop = t0 + dropAtMs / 1000
    const end = t0 + totalMs / 1000
    const out = ctx.createGain()
    out.gain.value = 0.55
    out.connect(ctx.destination)

    const kick = (at: number, level: number) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.frequency.setValueAtTime(150, at)
        o.frequency.exponentialRampToValueAtTime(45, at + 0.18)
        g.gain.setValueAtTime(level, at)
        g.gain.exponentialRampToValueAtTime(0.001, at + 0.3)
        o.connect(g).connect(out)
        o.start(at)
        o.stop(at + 0.32)
    }

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const snare = (at: number, level: number) => {
        const src = ctx.createBufferSource()
        src.buffer = noiseBuf
        const f = ctx.createBiquadFilter()
        f.type = 'highpass'
        f.frequency.value = 1800
        const g = ctx.createGain()
        g.gain.setValueAtTime(level, at)
        g.gain.exponentialRampToValueAtTime(0.001, at + 0.09)
        src.connect(f).connect(g).connect(out)
        src.start(at)
        src.stop(at + 0.1)
    }

    // four-on-the-floor up to the drop, with a snare roll that tightens
    const beats = Math.round(dropAtMs / BEAT_MS)
    for (let b = 0; b < beats; b++) {
        const at = t0 + (b * BEAT_MS) / 1000
        kick(at, 0.35)
        const subdiv = b >= beats - 2 ? 4 : b >= beats - 4 ? 2 : b % 2 ? 1 : 0
        for (let s = 0; s < subdiv; s++) snare(at + (s * BEAT_MS) / 1000 / subdiv, 0.08 + (0.14 * b) / beats)
    }

    // riser: filtered noise sweeping up into the drop
    const riser = ctx.createBufferSource()
    riser.buffer = noiseBuf
    riser.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 4
    bp.frequency.setValueAtTime(300, t0)
    bp.frequency.exponentialRampToValueAtTime(7000, drop)
    const rg = ctx.createGain()
    rg.gain.setValueAtTime(0.0001, t0)
    rg.gain.exponentialRampToValueAtTime(0.22, drop - 0.02)
    rg.gain.setValueAtTime(0, drop)
    riser.connect(bp).connect(rg).connect(out)
    riser.start(t0)
    riser.stop(drop)

    // the drop: heavy kicks and a sub bass
    for (let at = drop; at < end; at += BEAT_MS / 1000) kick(at, 0.75)
    const sub = ctx.createOscillator()
    const sg = ctx.createGain()
    sub.frequency.value = 55
    sg.gain.setValueAtTime(0.5, drop)
    sg.gain.exponentialRampToValueAtTime(0.001, end)
    sub.connect(sg).connect(out)
    sub.start(drop)
    sub.stop(end)
}

export default function BeatTeaser({ teaser, onSolved, onPulse }: TeaserProps<'beat'>) {
    const reduced = useReducedMotion()
    const totalMs = teaser.dropAtMs / DROP_AT
    const totalBeats = Math.round(teaser.dropAtMs / BEAT_MS)
    const [phase, setPhase] = useState<Phase>('intro')
    const [sound, setSound] = useState(false)
    const [beat, setBeat] = useState(0)
    const [offset, setOffset] = useState<number | null>(null)
    const [run, setRun] = useState(0)
    const startRef = useRef(0)
    const arenaRef = useRef<HTMLButtonElement>(null)
    const audioRef = useRef<{ ctx?: AudioContext; el?: HTMLAudioElement }>({})
    const cb = useRef({ onSolved, onPulse })
    useEffect(() => {
        cb.current = { onSolved, onPulse }
    })

    const stopAudio = () => {
        audioRef.current.ctx?.close().catch(() => {})
        audioRef.current.el?.pause()
        audioRef.current = {}
    }
    useEffect(() => stopAudio, [])

    // The run: a beat clock (pulses the neuron) and an end-of-track timeout.
    useEffect(() => {
        if (phase !== 'play') return
        arenaRef.current?.focus()
        startRef.current = performance.now()
        const tick = setInterval(() => {
            setBeat((b) => b + 1)
            cb.current.onPulse?.()
        }, BEAT_MS)
        const end = setTimeout(() => {
            setPhase((p) => (p === 'play' ? 'miss' : p))
        }, totalMs + 150)
        return () => {
            clearInterval(tick)
            clearTimeout(end)
        }
    }, [phase, run, totalMs])

    const start = () => {
        stopAudio()
        if (sound) {
            if (teaser.audioSrc) {
                const el = new Audio(teaser.audioSrc)
                el.play().catch(() => {})
                audioRef.current = { el }
            } else {
                const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
                if (Ctx) {
                    const ctx = new Ctx()
                    playSynthBuild(ctx, teaser.dropAtMs, totalMs)
                    audioRef.current = { ctx }
                }
            }
        }
        setBeat(0)
        setOffset(null)
        setRun((r) => r + 1)
        setPhase('play')
    }

    const tap = () => {
        if (phase !== 'play') return
        const off = performance.now() - startRef.current - teaser.dropAtMs
        setOffset(off)
        if (Math.abs(off) <= HIT_WINDOW_MS) {
            setPhase('hit')
            cb.current.onSolved()
        } else {
            setPhase('miss')
            stopAudio()
        }
    }

    const beatsLeft = Math.max(0, totalBeats - beat)
    const missText =
        offset == null
            ? 'The drop came and went.'
            : `${offset < 0 ? 'Early' : 'Late'} by ${(Math.abs(offset) / 1000).toFixed(2)} s.`

    return (
        <div className={styles.game}>
            <div className={styles.artRow}>
                <div className={styles.artHeader}>
                    <GyriRecordArt />
                </div>
                <p className={styles.prompt}>{teaser.prompt}</p>
            </div>

            <button
                ref={arenaRef}
                type="button"
                className={styles.wave}
                disabled={phase !== 'play'}
                onPointerDown={(e) => {
                    if (e.pointerType !== 'mouse' || e.button === 0) tap()
                }}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        tap()
                    }
                }}
                aria-label="Tap when the drop hits"
            >
                <svg viewBox={`0 0 ${WW} ${WH}`} preserveAspectRatio="none" aria-hidden>
                    <path className={styles.waveLine} d={WAVE} />
                    <path className={styles.waveDrop} d={`M${WW * DROP_AT} 2 L${WW * DROP_AT} ${WH - 2}`} />
                </svg>
                <span className={styles.waveDropLabel} style={{ left: `${DROP_AT * 100}%` }} aria-hidden>
                    DROP
                </span>

                {/* the not-yet-played part, veiled; the veil's left edge is the playhead */}
                {phase === 'play' && !reduced && (
                    <motion.span
                        key={run}
                        className={styles.waveVeil}
                        initial={{ x: '0%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: totalMs / 1000, ease: 'linear' }}
                    />
                )}
                {phase === 'intro' && <span className={styles.waveVeilStatic} />}
                {phase === 'play' && reduced && (
                    <span className={styles.waveCount} aria-live="off">
                        {beatsLeft > 0 ? `DROP IN ${beatsLeft}` : 'DROP'}
                    </span>
                )}
                {(phase === 'hit' || phase === 'miss') && offset != null && (
                    <span
                        className={`${styles.waveTap} ${phase === 'hit' ? styles.waveTapHit : ''}`}
                        style={{ left: `${Math.min(100, Math.max(0, ((teaser.dropAtMs + offset) / totalMs) * 100))}%` }}
                        aria-hidden
                    />
                )}
            </button>

            {phase === 'hit' ? (
                <Reveal
                    result={
                        <Callout
                            label="ON THE DROP"
                            sub={`${offset != null && offset < 0 ? '−' : '+'}${Math.abs(Math.round(offset ?? 0))} MS`}
                            tone="fired"
                        />
                    }
                    text={teaser.reveal}
                    region={teaser.region}
                    onPlayAgain={start}
                />
            ) : (
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.toggle}
                        aria-pressed={sound}
                        onClick={() => setSound((s) => !s)}
                        disabled={phase === 'play'}
                    >
                        SOUND {sound ? 'ON' : 'OFF'}
                    </button>
                    <p className={styles.feedback} role="status">
                        {phase === 'miss' ? missText : phase === 'play' ? 'Wait for it…' : ' '}
                    </p>
                    {phase !== 'play' && (
                        <ArrowLink className={styles.action} onClick={start}>
                            {phase === 'miss' ? 'AGAIN' : 'START'}
                        </ArrowLink>
                    )}
                </div>
            )}
        </div>
    )
}
