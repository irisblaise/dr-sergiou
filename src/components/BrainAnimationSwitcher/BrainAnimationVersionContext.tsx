'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'brainAnimationVersion'
export type BrainAnimationVersion = 'new' | 'classic'

type ContextValue = [BrainAnimationVersion, (next: BrainAnimationVersion) => void]

const BrainAnimationVersionContext = createContext<ContextValue | null>(null)

// Shared between BrainAnimationSwitcher (picks which brain renders in the
// stage) and BrainAnimationVersionToggle (the control in the header corner)
// so the two can live in different parts of the page tree while agreeing on
// the current choice. Temporary — see BrainAnimationSwitcher.tsx.
export function BrainAnimationVersionProvider({ children }: { children: ReactNode }) {
    const [version, setVersion] = useState<BrainAnimationVersion>('new')

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY)
            if (stored === 'classic' || stored === 'new') setVersion(stored)
        } catch {
            // localStorage unavailable (private browsing, etc.) — stay on the default.
        }
    }, [])

    const choose = (next: BrainAnimationVersion) => {
        setVersion(next)
        try {
            window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // ignore
        }
    }

    return <BrainAnimationVersionContext.Provider value={[version, choose]}>{children}</BrainAnimationVersionContext.Provider>
}

export function useBrainAnimationVersion() {
    const ctx = useContext(BrainAnimationVersionContext)
    if (!ctx) throw new Error('useBrainAnimationVersion must be used within a BrainAnimationVersionProvider')
    return ctx
}
