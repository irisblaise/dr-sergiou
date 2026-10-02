import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { Teaser, TeaserKind, TeaserOf } from '../../../content/teasers'
import TeaserLoading from './TeaserLoading'

// Every teaser takes the same props. After solving it keeps its reveal on
// screen until the visitor presses X — the panel never closes itself.
export type TeaserProps<K extends TeaserKind = TeaserKind> = {
    teaser: TeaserOf<K>
    onSolved: () => void
    /** Optional: pulse the neuron (Wait for the drop beats along with it). */
    onPulse?: () => void
}

// kind → lazily-loaded game. Each game (and the art it imports) is its own
// chunk, fetched only when its popover first opens, so /skills stays light.
// A kind without an entry makes its arm render without a teaser.
export const registry: { [K in TeaserKind]?: ComponentType<TeaserProps<K>> } = {
    bug: dynamic(() => import('./BugTeaser'), { ssr: false, loading: TeaserLoading }),
    swipe: dynamic(() => import('./SwipeTeaser'), { ssr: false, loading: TeaserLoading }),
    gonogo: dynamic(() => import('./GoNoGoTeaser'), { ssr: false, loading: TeaserLoading }),
    signal: dynamic(() => import('./SignalTeaser'), { ssr: false, loading: TeaserLoading }),
    glimpse: dynamic(() => import('./GlimpseTeaser'), { ssr: false, loading: TeaserLoading }),
    beat: dynamic(() => import('./BeatTeaser'), { ssr: false, loading: TeaserLoading }),
}

export function hasTeaserComponent(teaser: Teaser | undefined): teaser is Teaser {
    return !!teaser && !!registry[teaser.kind]
}
