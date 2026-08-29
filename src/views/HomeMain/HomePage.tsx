'use client'

import { BrainAnimationVersionProvider } from '../../components/BrainAnimationSwitcher/BrainAnimationVersionContext'
import BrainAnimationSwitcher from '../../components/BrainAnimationSwitcher/BrainAnimationSwitcher'
import BrainAnimationVersionToggle from '../../components/BrainAnimationSwitcher/BrainAnimationVersionToggle'
import LayersOfExploration from '../../components/LayersOfExploration/LayersOfExploration'
import type { HomeContent } from '../../sanity/lib/queries'
import styles from './HomePage.module.scss'

// Forces "the Brain" onto its own line regardless of viewport width, instead
// of relying on the text wrapping naturally at whatever width happens to fit.
function renderHeadline(text: string) {
    const breakIndex = text.indexOf('the Brain')
    if (breakIndex === -1) return text
    return (
        <>
            {text.slice(0, breakIndex)}
            <br />
            {text.slice(breakIndex)}
        </>
    )
}

export default function HomePage({ home }: { home: HomeContent | null }) {
    const heroHeadline = home?.heroHeadline ?? 'The Never Ending Exploration of the Brain.'
    const heroIntro = home?.heroIntro ?? []

    return (
        <BrainAnimationVersionProvider>
            <div className={styles.page} id="top">
                <div className={styles.wash} aria-hidden />

                {/* Brain stage — unchanged hero visual */}
                <div className={styles.stage} aria-hidden>
                    <div className={styles.glow} />
                    <div className={styles.brainHost}>
                        <BrainAnimationSwitcher />
                    </div>
                    <div className={styles.brainBase} />
                </div>

                {/* Hero header — unchanged */}
                <header className={styles.header}>
                    <div className={styles.heroInner}>
                        <h1 className={styles.headline}>{renderHeadline(heroHeadline)}</h1>

                        <div className={styles.intro}>
                            {heroIntro.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        <div className={styles.scrollCue}>
                            CONTINUE&nbsp;EXPLORING
                            <span className={styles.cueLine}>
                                <span className={styles.cueDot} />
                            </span>
                        </div>
                    </div>

                    <BrainAnimationVersionToggle />
                </header>

                <LayersOfExploration />
            </div>
        </BrainAnimationVersionProvider>
    )
}
