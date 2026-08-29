import Image from 'next/image'
import type { PageContent } from '../../sanity/lib/queries'
import styles from './Contact.module.scss'

const portrait = '/assets/contact/carmen.png'

const CONTACTS = [
    {
        label: 'PRIMARY CONTACT',
        value: 'cs.sergiou@gmail.com',
        href: 'mailto:cs.sergiou@gmail.com',
        note: 'Personal and general inquiries',
    },
    {
        label: 'FORNEUROTECH CONTACT',
        value: 'forneurotech.network@gmail.com',
        href: 'mailto:forneurotech.network@gmail.com',
        website: 'https://www.forneurotech.com/',
        note: 'Research collaborations and neurotechnology inquiries',
    },
] as const

const SOCIALS = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/carmensergiou' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0002-8107-5615' },
] as const

export default function Contact({ pageContent }: { pageContent?: PageContent | null }) {
    const heading = pageContent?.heading ?? 'Get in touch'
    const eyebrow = pageContent?.eyebrow ?? "LET'S CONNECT"
    const introParagraphs = pageContent?.intro?.length ? pageContent.intro : [
        'Reach Dr. Carmen-Silva Sergiou for research collaborations, talks, interviews, or anything at the crossroads of neuroscience and technology.',
    ]
    const contactDetails = pageContent?.contactDetails?.length ? pageContent.contactDetails : CONTACTS
    const position = pageContent?.position ?? 'Postdoctoral researcher'
    const institution = pageContent?.institution ?? 'Amsterdam UMC — Youth at Risk'
    const socialLinks = pageContent?.socialLinks?.length ? pageContent.socialLinks : SOCIALS

    return (
        <div className={styles.page}>
            <div className={styles.left}>
                <h1 className={styles.heading}>{heading}</h1>
                <div className={styles.eyebrow}>{eyebrow}</div>
                {introParagraphs.map((paragraph, index) => (
                    <p key={index} className={styles.blurb}>
                        {paragraph}
                    </p>
                ))}
                <Image
                    className={styles.portrait}
                    src={portrait}
                    alt="Portrait of Carmen Sergiou speaking on stage"
                    width={1600}
                    height={1066}
                    priority
                />
            </div>

            <div className={styles.right}>
                {contactDetails.map((c) => (
                    <div key={`${c.label ?? 'contact'}-${c.value ?? c.href ?? 'item'}`} className={styles.detail}>
                        <div className={styles.detailLabel}>{c.label}</div>
                        <a className={styles.detailValue} href={c.href ?? '#'}>
                            {c.note ?? c.value}
                        </a>
                        <div className={styles.detailNote}>{c.value}</div>
                    </div>
                ))}

                <div className={styles.detail}>
                    <div className={styles.detailLabel}>CURRENT POSITION</div>
                    <div className={styles.position}>{position}</div>
                    <div className={styles.detailNote}>{institution}</div>
                </div>

                <div className={styles.find}>
                    <div className={styles.findLabel}>FIND ME ONLINE</div>
                    <div className={styles.socials}>
                        {socialLinks.map((s) => (
                            <a key={`${s.label ?? 'social'}-${s.href ?? 'item'}`} href={s.href ?? '#'} target="_blank" rel="noopener noreferrer">
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
