'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.scss'

const LINKS = [
    { to: '/projects', label: 'PROJECTS' },
    { to: '/impact', label: 'IMPACT' },
    { to: '/skills', label: 'SKILLS' },
    { to: '/publications', label: 'PUBLICATIONS' },
] as const

function Logo({ onClick }: { onClick?: () => void }) {
    return (
        <Link href="/" className={styles.logo} onClick={onClick} aria-label="Carmen Sergiou — home">
            <Image
                className={styles.glyphImg}
                src="/assets/brain/brain-logo-horizontal-pink-transparent.png"
                alt="Carmen Sergiou"
                width={1200}
                height={871}
                priority
            />
            <span className={styles.lockup}>
                <span className={styles.name}>DR.&nbsp;SERGIOU</span>
                <span className={styles.role}>FORENSIC&nbsp;NEUROSCIENCTIST</span>
            </span>
        </Link>
    )
}

function Links({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()
    const active = (to: string) => (pathname === to ? styles.active : undefined)
    return (
        <>
            {LINKS.map((l) => (
                <Link key={l.to} href={l.to} className={active(l.to)} onClick={onNavigate}>
                    {l.label}
                </Link>
            ))}
            <a
                href="https://www.forneurotech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.external}
                onClick={onNavigate}
            >
                FORNEUROTECH<span className={styles.arrow} aria-hidden>↗</span>
            </a>
            <Link href="/contact" className={active('/contact')} onClick={onNavigate}>
                CONTACT
            </Link>
        </>
    )
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Lock body scroll while the mobile menu is open.
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    const close = () => setMenuOpen(false)

    return (
        <>
            <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.open : ''}`}>
                <Logo onClick={close} />

                <div className={styles.links}>
                    <Links />
                </div>

                <button
                    className={styles.burger}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </nav>

            {/* Rendered OUTSIDE <nav> so the nav's backdrop-filter doesn't become
                this fixed menu's containing block (which would collapse it). */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <Links onNavigate={close} />
                </div>
            )}
        </>
    )
}
