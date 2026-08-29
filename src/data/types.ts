// types.ts — the data↔component contract for the rebuilt site.
// Every data collection has an interface here; component props derive from these.

/* ---------- Home ---------- */
export interface HomeItem {
    section: string
    /** Passion number, e.g. "No.1" — present on the six passion sections only. */
    number?: string
    title: string
    description: string
}

/* ---------- Projects ---------- */
export interface Project {
    title: string
    description: string
    link: string
    /** Display range, e.g. "2025 – Current". */
    dateRange: string
    /** Leading year, parsed from dateRange — drives the timeline year marker. */
    year: string
    /** Accent colour for the row node / date label. */
    color: string
    image?: string
    imageAlt?: string
    /** Timeline order key (lower = earlier/higher up) — rows are spaced
     *  evenly on the page, this only decides display order. */
    node: number
}

/* ---------- Impact: awards + media ---------- */
export interface ImpactAsset {
    type: 'image' | 'video'
    src: string
    alt?: string
}

export interface Award {
    mediaType: string
    subject: string
    peopleInvolved?: string
    description: string
    date: string
    image?: string
    imageAlt?: string
    assets: ImpactAsset[]
}

export interface MediaItem {
    mediaType: string
    subject: string
    peopleInvolved?: string
    description: string
    link: string
    date: string
    image?: string
    imageAlt?: string
    assets: ImpactAsset[]
}

/* ---------- Publications ---------- */
export type PublicationKind =
    | 'RESEARCH ARTICLE'
    | 'REVIEW'
    | 'BOOK CHAPTER'
    | 'DISSERTATION'
    | 'REPORT'

export type Topic =
    | 'Neuroscience'
    | 'Behavior'
    | 'Forensic'
    | 'Neuromodulation'
    | 'Technology'

export const ALL_TOPICS: Topic[] = [
    'Neuroscience',
    'Behavior',
    'Forensic',
    'Neuromodulation',
    'Technology',
]

/** A notable distinction shown on the spine (icon) and in the detail card. */
export type AccoladeType = 'phd' | 'award'
export interface Accolade {
    type: AccoladeType
    label: string
}

export interface Publication {
    title: string
    authors: string
    journal: string
    year: number
    kind: PublicationKind
    topics: Topic[]
    authorship: string
    /** TODO(client): real abstracts are not in the ported data — supply per entry. */
    abstract?: string
    /** External DOI / source link. */
    link: string
    /** Bundled PDF (imported asset). */
    pdf?: string
    /** Optional distinction (PhD dissertation / award) shown on the spine + card. */
    accolade?: Accolade
}

/* ---------- Skills (new page) ---------- */
export type SkillKey = 'neuro' | 'coding' | 'forensic' | 'vr' | 'behavior' | 'music'

export interface Skill {
    key: SkillKey
    /** Space Mono all-caps eyebrow, e.g. "NEURO". */
    label: string
    /** Multi-item detail; '|' separators kept as written. TODO(client): verify copy. */
    detail: string
    /** Node image asset. */
    image: string
    imageAlt?: string
}
