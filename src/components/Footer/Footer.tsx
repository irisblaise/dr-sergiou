import styles from './Footer.module.scss'

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

        </footer>
    )
}
