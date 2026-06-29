'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

// Keep the heavy `sanity` config import inside a client boundary — importing it
// into the server component graph evaluates Studio's module-level
// `React.createContext` calls under RSC, where createContext throws.
export default function Studio() {
    return <NextStudio config={config} />
}
