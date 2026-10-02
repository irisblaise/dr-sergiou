import type { ComponentType } from 'react'
import type { Teaser } from '../../../content/teasers'
import { registry, type TeaserProps } from './registry'

// Renders the lazily-loaded game for a teaser's kind. The registry entries
// are module-level next/dynamic components — looked up here, never created
// per render.
export default function TeaserGame({ teaser, onSolved, onPulse }: Omit<TeaserProps, 'teaser'> & { teaser: Teaser }) {
    const Game = registry[teaser.kind] as ComponentType<TeaserProps> | undefined
    return Game ? <Game teaser={teaser} onSolved={onSolved} onPulse={onPulse} /> : null
}
