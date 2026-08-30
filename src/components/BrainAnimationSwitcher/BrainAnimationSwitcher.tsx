'use client'

import dynamic from 'next/dynamic'
import { useBrainAnimationVersion } from './BrainAnimationVersionContext'

// Each variant is ~2000 lines of hand-traced SVG; dynamic() keeps them in
// separate chunks so a visitor only downloads the one actually rendered,
// instead of both being bundled together for this comparison toggle.
const BrainAnimation = dynamic(() => import('../BrainAnimation/BrainAnimation'))
const BrainAnimationClassic = dynamic(() => import('../BrainAnimationClassic/BrainAnimationClassic'))

// Temporary: renders whichever brain animation the client is currently
// comparing — see BrainAnimationVersionToggle.tsx for the control that picks
// it, and BrainAnimationVersionContext.tsx for the shared state. Once the
// client has decided, delete this component, BrainAnimationVersionToggle,
// BrainAnimationVersionContext, and BrainAnimationClassic, and swap this call
// site back to <BrainAnimation /> directly.
export default function BrainAnimationSwitcher() {
    const [version] = useBrainAnimationVersion()
    return version === 'classic' ? <BrainAnimationClassic /> : <BrainAnimation />
}
