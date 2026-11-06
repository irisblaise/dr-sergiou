// Brain teasers for the skills neuron — see the "Skills page — Brain Teasers"
// spec. Hardcoded on purpose (not Sanity): copy changes go through a code
// change and deploy.
//
// [CARMEN] Every `prompt`, `reveal`, and statement below is draft copy
// that Carmen must write or approve before launch.

import type { SkillKey } from '../data/types'

type TeaserBase = {
    /** Stable key that maps the teaser to its Sanity skill (`Skill.key`) — never the display title. */
    branch: SkillKey
    title: string
    prompt: string
    /** Carmen's copy, first person. */
    reveal: string
}

export type Teaser =
    | (TeaserBase & {
          kind: 'signal'
          targetBand: [number, number]
          /** Locked in below / above the band: the wrong answer's explanation. */
          missLow: string
          missHigh: string
      })
    | (TeaserBase & { kind: 'bug'; codeLines: string[]; bugLine: number; bugNote: string }) // bugLine is 1-based; bugNote is the answer callout's subline
    | (TeaserBase & { kind: 'glimpse'; options: string[]; glimpseMs: number })
    | (TeaserBase & { kind: 'beat'; audioSrc?: string; dropAtMs: number })
    | (TeaserBase & { kind: 'gonogo'; durationMs: number })
    | (TeaserBase & {
          kind: 'swipe'
          statements: {
              text: string
              isFact: boolean
              explanation: string
              /** Optional drawing on the card, e.g. the "brain scan" statement's axial slice. */
              illustration?: 'axial-slice'
          }[]
      })

export type TeaserKind = Teaser['kind']
export type TeaserOf<K extends TeaserKind> = Extract<Teaser, { kind: K }>

/** Numbering used in the panel header (`TEASER 02 / 06 · CODING`). */
export const TEASER_ORDER: SkillKey[] = ['neuro', 'coding', 'vr', 'music', 'behavior', 'forensic']

// An arm with no entry here simply renders without a teaser.
export const teasers: Partial<Record<SkillKey, Teaser>> = {
    neuro: {
        branch: 'neuro',
        kind: 'signal',
        title: 'Find the signal',
        prompt: 'Eyes closed. Brain still buzzing. Tune in to find my resting rhythm.',
        // Hz — the alpha band
        targetBand: [8, 13],
        reveal: 'You found my alpha rhythm! These brainwaves pulse around 8–13 times per second and are often strongest at the back of the head when we’re awake, relaxed, and resting with our eyes closed. Open your eyes, and alpha activity usually decreases as the brain processes visual information. Resting doesn’t mean switching off.',
        // [CARMEN] draft — the wrong answers
        missLow: 'Too slow. Below 8 Hz you’re in theta and delta: the rhythms that take over as we drift off to sleep. My resting rhythm is a little faster than that.',
        missHigh: 'Too fast. Above 13 Hz you’re in beta and gamma: the quick rhythms of a brain that’s alert and busy. My resting rhythm is calmer than that.',
    },
    vr: {
        branch: 'vr',
        kind: 'glimpse',
        title: 'Scout the target',
        prompt: 'You’re a burglar. You get one look at the street. Which house would you target?',
        // What sets each house apart, in street order (house 1 → 4). The
        // buttons say "HOUSE 1–4"; these name the visitor's pick in the result.
        options: ['HEDGES', 'LIGHTS ON', 'OPEN WINDOW', 'CAR IN THE DRIVE'],
        glimpseMs: 3000,
        // [CARMEN] must add one or two real cues the Virtual Burglary study examined — do not invent findings
        reveal: 'You just did what participants in the Virtual Burglary study did. [CARMEN: one or two real cues the study examined.]',
    },
    music: {
        branch: 'music',
        kind: 'beat',
        title: 'Wait for the drop',
        prompt: 'The build-up is coming. Tap exactly when the drop hits.',
        // No audioSrc yet: the loop must be licensed or Carmen's own. Until
        // then, the sound (on by default) is a short build-up synthesised in the
        // browser (Web Audio), so no third-party audio ships.
        dropAtMs: 6000,
        // [CARMEN] draft from the spec (+ optionally the Ventromedial story)
        reveal: 'That itch right before the drop? Your reward circuit anticipating.',
    },
    coding: {
        branch: 'coding',
        kind: 'bug',
        title: 'Spot the bug',
        prompt: 'Four lines of EEGLAB that load my brain. Which line crashes?',
        // EEGLAB in MATLAB: load a dataset, band-pass it, then grab one channel.
        // EEG.data is channels × samples, indexed by number — 'Oz' is a char
        // array, so MATLAB reads it as rows 79 and 122 and runs off the end.
        codeLines: [
            "EEG = pop_loadset('carmen_brain.set');",
            'EEG = pop_eegfiltnew(EEG, 1, 40);',
            "oz  = EEG.data('Oz', :);",
            'plot(oz)',
        ],
        bugLine: 3,
        bugNote: 'CHANNELS ARE NUMBERS, NOT NAMES',
        // [CARMEN] draft — check the wording and that it matches how she works in EEGLAB
        reveal: 'EEGLAB keeps channels as numbered rows, so first you look up which number Oz has in EEG.chanlocs. I’ve typed this exact line more times than I’d like to admit.',
    },
    behavior: {
        branch: 'behavior',
        kind: 'gonogo',
        title: 'Don’t.',
        prompt: 'Tap every pink pulse. Never the pale one. It gets faster.',
        durationMs: 20000,
        // [CARMEN] placeholder — link to self-regulation in youth at risk
        reveal: 'Stopping yourself is harder than starting. That brake is what I study in young people at risk: how self-regulation develops, and what happens when it lags behind.',
    },
    forensic: {
        branch: 'forensic',
        kind: 'swipe',
        title: 'Myth or Fact?',
        prompt: 'Three pieces of evidence. Myth or fact?',
        statements: [
            {
                // [CARMEN]
                text: 'A brain scan can tell whether someone is lying.',
                isFact: false,
                illustration: 'axial-slice',
                explanation: 'Myth. No scan reliably detects lies in an individual — courts don’t accept it as evidence.',
            },
            {
                // [CARMEN]
                text: 'TBS is a prison sentence.',
                isFact: false,
                explanation: 'Myth. TBS is a treatment measure, not a punishment.',
            },
            {
                // [CARMEN] third statement still to be written by Carmen — placeholder
                text: 'The brain keeps developing into your mid-twenties.',
                isFact: true,
                explanation: 'Fact. The prefrontal cortex is among the last regions to mature.',
            },
        ],
        reveal: 'Brains are complex. People even more so. My work explores how brain, behaviour, and environment interact, and challenges the myths that stand in the way of understanding people in forensic care.',
    },
}

// [CARMEN]
export const networkMappedLine = 'Network mapped. Welcome to my brain.'
