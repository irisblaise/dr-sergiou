import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.scss'

const LINKS = [
    { to: '/projects', label: 'PROJECTS' },
    { to: '/impact', label: 'IMPACT' },
    { to: '/skills', label: 'SKILLS' },
    { to: '/publications', label: 'PUBLICATIONS' },
] as const

function Logo({ onClick }: { onClick?: () => void }) {
    return (
        <Link to="/" className={styles.logo} onClick={onClick} aria-label="Carmen Sergiou — home">
            <span className={styles.glyph}>cs</span>
            <span className={styles.lockup}>
                <span className={styles.name}>CARMEN&nbsp;SERGIOU</span>
                <span className={styles.role}>FORENSIC&nbsp;NEUROSCIENCE</span>
            </span>
        </Link>
    )
}

function Links({ onNavigate }: { onNavigate?: () => void }) {
    const active = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : undefined)
    return (
        <>
            {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={active} onClick={onNavigate}>
                    {l.label}
                </NavLink>
            ))}
            <a
                href="https://forneurotech.network"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.external}
                onClick={onNavigate}
            >
                FORNEUROTECH<span className={styles.arrow} aria-hidden>↗</span>
            </a>
            <NavLink to="/contact" className={active} onClick={onNavigate}>
                CONTACT
            </NavLink>
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
