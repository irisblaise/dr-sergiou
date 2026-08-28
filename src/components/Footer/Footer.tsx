import Link from 'next/link'
import styles from './Footer.module.scss'

// Temporary while the redesign is staged in as the main site — lets reviewers
// still reach the previous live design. Remove this block once the redesign
// is finalised and the /classic routes are retired.
const CLASSIC_LINKS = [
    { to: '/classic', label: 'HOME' },
    { to: '/classic/projects', label: 'PROJECTS' },
    { to: '/classic/skills', label: 'SKILLS' },
] as const

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.row}>
            <div className={styles.copy}>
                <a
                    href="https://www.linkedin.com/in/irisblaise/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    © 2026 | BLAISE STUDIO
                </a>
            </div>
                    <span className={styles.tagline}>NEURO × TECHNOLOGY × FORENSIC</span>
            </div>

            <div className={styles.classicRow}>
                <span className={styles.classicLabel}>ORIGINAL DESIGN:</span>
                {CLASSIC_LINKS.map((l) => (
                    <Link key={l.to} href={l.to} className={styles.classicLink}>
                        {l.label}
                    </Link>
                ))}
            </div>
        </footer>
    )
}
