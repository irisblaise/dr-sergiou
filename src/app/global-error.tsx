'use client'

import { useEffect } from 'react'

// Root-level error boundary: only fires if the root layout itself throws
// (fonts/global styles failing to load, etc.) — the (site) route group has
// its own error.tsx for page-level failures. Must render its own <html>/<body>
// since it replaces the root layout entirely.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html lang="en">
            <body
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100svh',
                    fontFamily: 'system-ui, sans-serif',
                    textAlign: 'center',
                    padding: '24px',
                }}
            >
                <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Something went wrong</h1>
                <p style={{ marginBottom: '24px', color: '#5b574c' }}>
                    Please try reloading the page.
                </p>
                <button
                    type="button"
                    onClick={() => reset()}
                    style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#efeae1',
                        background: '#c8326f',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '12px 28px',
                        cursor: 'pointer',
                    }}
                >
                    Try again
                </button>
            </body>
        </html>
    )
}
