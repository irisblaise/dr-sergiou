import { useEffect } from 'react'

// Runs `recompute` once after mount (next frame), again on every window
// resize, and once more after web fonts swap in (since that can shift layout
// after first paint). `onResize` fires only on resize, for work that's only
// relevant when the viewport itself changes.
export function useRecomputeOnResize(recompute: () => void, onResize?: () => void): void {
    useEffect(() => {
        const raf = requestAnimationFrame(recompute)
        const handleResize = () => {
            recompute()
            onResize?.()
        }
        window.addEventListener('resize', handleResize)
        let cancelled = false
        document.fonts?.ready?.then(() => {
            if (!cancelled) recompute()
        })
        return () => {
            cancelAnimationFrame(raf)
            cancelled = true
            window.removeEventListener('resize', handleResize)
        }
    }, [recompute, onResize])
}
