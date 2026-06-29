import portrait from '../../assets/handoff/portrait-sketch.png'
import styles from './Contact.module.scss'

const CONTACTS = [
    {
        label: 'PRIMARY CONTACT',
        value: 'cs.sergiou@gmail.com',
        href: 'mailto:cs.sergiou@gmail.com',
        note: 'Personal & general inquiries',
    },
    {
        label: 'RESEARCH CONTACT',
        value: 'forneurotech.network@gmail.com',
        href: 'mailto:forneurotech.network@gmail.com',
        note: 'For research collaborations',
    },
] as const

const SOCIALS = [
    { label: 'Twitter', href: 'https://twitter.com/SergiouCarmen' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/carmensergiou' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0002-8107-5615' },
] as const

export default function Contact() {
    return (
        <div className={styles.page}>
            <div className={styles.left}>
                <h1 className={styles.heading}>Get in touch</h1>
                <div className={styles.eyebrow}>LET'S&nbsp;CONNECT</div>
                <p className={styles.blurb}>
                    For research collaborations, talks, interviews or anything at the crossroads of
                    neuro &amp; technology — reach out via any of the channels below.
                </p>
                <img className={styles.portrait} src={portrait} alt="Portrait of Carmen Sergiou" />
            </div>

            <div className={styles.right}>
                {CONTACTS.map((c) => (
                    <div key={c.label} className={styles.detail}>
                        <div className={styles.detailLabel}>{c.label}</div>
                        <a className={styles.detailValue} href={c.href}>
                            {c.value}
                        </a>
                        <div className={styles.detailNote}>{c.note}</div>
                    </div>
                ))}

                <div className={styles.detail}>
                    <div className={styles.detailLabel}>CURRENT POSITION</div>
                    <div className={styles.position}>Postdoc</div>
                    <div className={styles.detailNote}>
                        Amsterdam UMC
                        <br />
                        <a
                            href="https://www.gutsproject.com/work-package/antisocial-behaviour/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <em>Youth at Risk</em>
                        </a>
                    </div>
                </div>

                <div className={styles.cta}>
                    <div className={styles.ctaEyebrow}>STAY&nbsp;CONNECTED</div>
                    <h3 className={styles.ctaTitle}>Interested in forensic neurotechnology?</h3>
                    <p className={styles.ctaBody}>
                        Join the mailing list to follow the symposium, network and research as the
                        field evolves.
                    </p>
                    <a
                        className={styles.ctaLink}
                        href="https://www.forneurotech.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        JOIN&nbsp;THE&nbsp;MAILING&nbsp;LIST <span aria-hidden>→</span>
                    </a>
                </div>

                <div className={styles.find}>
                    <div className={styles.findLabel}>FIND&nbsp;ME&nbsp;ONLINE</div>
                    <div className={styles.socials}>
                        {SOCIALS.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
