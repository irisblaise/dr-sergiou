// Brain teasers for the skills neuron — see the "Skills page — Brain Teasers"
// spec. Hardcoded on purpose (not Sanity): copy changes go through a code
// change and deploy.
//
// [CARMEN] Every `prompt`, `reveal`, statement and region below is draft copy
// that Carmen must write or approve before launch.

import type { SkillKey } from '../data/types'

/** Homepage region-callout format, e.g. { code: 'VS', label: 'REWARD VALUATION' }. */
export type Region = { code: string; label: string }

type TeaserBase = {
    /** Stable key that maps the teaser to its Sanity skill (`Skill.key`) — never the display title. */
    branch: SkillKey
    title: string
    prompt: string
    /** Carmen's copy, first person. */
    reveal: string
    region: Region
}

export type Teaser =
    | (TeaserBase & { kind: 'signal'; targetBand: [number, number] })
    | (TeaserBase & { kind: 'bug'; codeLines: string[]; bugLine: number }) // bugLine is 1-based
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

// Build steps 1–3 ship Spot the bug, Myth or Fact? and Don't. — Find the
// signal (neuro), Case the joint (vr) and Wait for the drop (music) land in
// steps 4–5, after the art/copy review. An arm with no entry here simply
// renders without a teaser.
export const teasers: Partial<Record<SkillKey, Teaser>> = {
    coding: {
        branch: 'coding',
        kind: 'bug',
        title: 'Spot the bug',
        prompt: 'Four lines that load my brain. Which line crashes?',
        codeLines: [
            "brain   = load('carmen_brain.mat');",
            'regions = brain.regions;',
            'first   = regions(0);',
            'disp(first.name)',
        ],
        bugLine: 3,
        // [CARMEN] draft from the spec
        reveal: "Python starts counting at 0, MATLAB at 1. I'm bilingual and permanently confused.",
        // [CARMEN] region not given in the spec — error detection is the classic ACC example
        region: { code: 'ACC', label: 'CONFLICT MONITORING' },
    },
    behavior: {
        branch: 'behavior',
        kind: 'gonogo',
        title: 'Don’t.',
        prompt: 'Tap every pink pulse. Never the pale one. It gets faster.',
        durationMs: 20000,
        // [CARMEN] placeholder — link to self-regulation in youth at risk
        reveal: 'Stopping yourself is harder than starting. That brake is what I study in young people at risk: how self-regulation develops, and what happens when it lags behind.',
        region: { code: 'PFC', label: 'EVALUATION & CONTROL' },
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
        // [CARMEN] placeholder
        reveal: 'Most of my forensic work is exactly this: separating what the brain can tell a court from what people hope it can.',
        // [CARMEN] region not given in the spec
        region: { code: 'DLPFC', label: 'STRATEGIC DECISION-MAKING' },
    },
}

// [CARMEN]
export const networkMappedLine = 'Network mapped. Welcome to my brain.'
