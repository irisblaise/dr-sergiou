'use client'

import { NextStudio } from 'next-sanity/studio'
import { StyleSheetManager } from 'styled-components'
import config from '../../../../sanity.config'

const shouldForwardProp = (prop: string, element: unknown) =>
    typeof element !== 'string' || !['intent', 'params', 'items'].includes(prop)

// Keep the heavy `sanity` config import inside a client boundary — importing it
// into the server component graph evaluates Studio's module-level
// `React.createContext` calls under RSC, where createContext throws.
export default function Studio() {
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <NextStudio config={config} />
        </StyleSheetManager>
    )
}
