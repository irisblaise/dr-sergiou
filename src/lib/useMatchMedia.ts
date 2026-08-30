import { useEffect, useState } from 'react'

// Subscribes to a media query and returns whether it currently matches,
// re-rendering when the breakpoint is crossed. Starts `false` and corrects
// itself in an effect (rather than reading `window.matchMedia` during the
// initial render) so server and client render the same thing on mount.
export function useMatchMedia(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia(query)
        const update = () => setMatches(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [query])

    return matches
}
