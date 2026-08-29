'use client'

import BrainAnimation from '../BrainAnimation/brainAnimation'
import BrainAnimationClassic from '../BrainAnimationClassic/brainAnimationClassic'
import { useBrainAnimationVersion } from './BrainAnimationVersionContext'

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
