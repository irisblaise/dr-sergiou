import type { Publication, SpineCover } from './types'

/* PDFs — bundled in src/assets/pdfs (imported so the bundler fingerprints them). */
import Publication1 from '../assets/pdfs/Publication 1. Psychopathy as a predisposition to lie hedonistically.pdf'
import Publication2 from '../assets/pdfs/Publication 2. Sergiou et al. (2023).The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence.pdf'
// Publication 3 is delivered as a PNG screenshot in the handoff assets.
import Publication3 from '../assets/pdfs/Publication 3.Sergiou et al. (2021)tDCS reducing aggression. Screenshot website.PNG'
import Publication4 from '../assets/pdfs/Publication 4.Sergiou et al. (2020).Study Protocol Paper.pdf'
import Publication5 from '../assets/pdfs/Publication 5,Sergiou et al. (2020). Literature Review.pdf'
import Publication6 from '../assets/pdfs/Publication 6.Ekthiari et al. (2019).Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine.pdf'
import Publication7 from '../assets/pdfs/Publication 7. Slotboom et al. (2017). Visual Attention in violent offenders.pdf'
import Publication8 from '../assets/pdfs/Publication 8. Hoppenbrouwersea2016_Top-DownAttentionandSelectionHistoryinPsychopathypdf.pdf'
import Publication9 from '../assets/pdfs/Publication 9. Lui et al (2017). Interventions for Improving Affective Abilities in Adolescents.pdf'
import Publication10 from '../assets/pdfs/Publication 10. van Dongen et al. Middelengebruik en Geweld.pdf'
import Publication11 from '../assets/pdfs/Publication11.pdf'
import Publication12 from '../assets/pdfs/Publication12.pdf'
import Publication13 from '../assets/pdfs/Publication13.pdf'
import Publication14 from '../assets/pdfs/Publication14.pdf'
import Publication15 from '../assets/pdfs/Publication15.pdf'
import Publication16 from '../assets/pdfs/Publication16.pdf'
import Publication17 from '../assets/pdfs/Publication17.pdf'
import Publication19 from '../assets/pdfs/Publication 19. Neuromodulation Psychopathy Review.pdf'
import Publication20 from '../assets/pdfs/Publication 20. Bringing Technology to Justice-Involved Youth.pdf'
import Publication21 from '../assets/pdfs/Publication 21. Bookchapter.pdf'

/* Cloth-cover palette for the book spines — derived from the Publications.dc.html
   reference. Assigned deterministically by index in `publications`. */
const COVERS: SpineCover[] = [
    { bg: '#d9d2bb', text: 'dark' }, // bone linen
    { bg: '#5e6a4a', text: 'light' }, // olive
    { bg: '#c4ac76', text: 'dark' }, // tan
    { bg: '#2c333f', text: 'light' }, // navy
    { bg: '#79552f', text: 'light' }, // chestnut
    { bg: '#cabd9f', text: 'dark' }, // oat
    { bg: '#474a30', text: 'light' }, // dark olive
    { bg: '#5c2b2e', text: 'light' }, // oxblood
    { bg: '#e5d0b0', text: 'dark' }, // wheat
    { bg: '#3f5e50', text: 'light' }, // sage deep
]

// Ported from publicationData.js, ordered newest→oldest (matches the shelf reference),
// deduped (the source had the psychopathy-review entry twice), and extended with the
// `kind`, `topics`, and spine `cover` fields the new bookshelf design needs.
// NOTE(client): `abstract` is intentionally omitted — real abstracts were not present in
// the ported data and should be supplied rather than guessed. Topics/kind were migrated
// from title + journal and are worth a sign-off pass.
const RAW: Omit<Publication, 'cover'>[] = [
    {
        title: 'Bringing Technology to Justice-Involved Youth',
        authors: 'Mertens, E.C.A., Asscher, J.J., Sergiou, C.S., van Gelder, J.L.',
        journal: 'Research on Child and Adolescent Psychopathology',
        year: 2026,
        kind: 'RESEARCH ARTICLE',
        topics: ['Forensic', 'Behavior', 'Technology'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1007/s10802-026-01428-z',
        pdf: Publication20,
    },
    {
        title: 'Resting-State fMRI Networks in High-Risk Youth with Antisocial Traits',
        authors: 'Sergiou, C.S.',
        journal: 'Wiley — Youth Deviance, Crime, and Justice (Neuro-Psycho-Criminological Perspective)',
        year: 2026,
        kind: 'BOOK CHAPTER',
        topics: ['Neuroscience', 'Forensic', 'Behavior'],
        authorship: 'First author',
        link: 'https://doi.org/10.1002/9781394251520.ch7',
        pdf: Publication19,
    },
    {
        title: 'On the possibility to modulate psychopathic traits via non-invasive brain stimulation: A systematic review and meta-analysis',
        authors: 'Camara, C.F., Sergiou, C.S., Molero Chamizo, A., Sel, A., Rivera Urbina, N.G., Nitsche, M.A. & Hanel, P.H.P.',
        journal: 'Progress in Neuropsychopharmacology & Biological Psychiatry',
        year: 2025,
        kind: 'REVIEW',
        topics: ['Neuromodulation', 'Forensic', 'Neuroscience'],
        authorship: 'Co-author',
        link: 'https://www.sciencedirect.com/science/article/pii/S0278584625003367?via%3Dihub',
        pdf: Publication21,
    },
    {
        title: 'Virtual reality: What is it and should criminologists pay attention?',
        authors: 'van Gelder, J.-L., Mertens, E., Nagin, D., Siezenga, A., Gerstner, D., Sergiou, C., et al.',
        journal: 'The Criminologist',
        year: 2025,
        kind: 'REVIEW',
        topics: ['Technology', 'Forensic', 'Behavior'],
        authorship: 'Co-author',
        link: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1328839/full',
        pdf: Publication17,
    },
    {
        title: 'Neuroprediction of violence and criminal behavior using neuro-imaging data: From innovation to considerations for future directions',
        authors: 'van Dongen, J. D., Haveman, Y., Sergiou, C. S., & Choy, O.',
        journal: 'Aggression & Violent Behavior',
        year: 2025,
        kind: 'REVIEW',
        topics: ['Neuroscience', 'Forensic', 'Behavior'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1016/j.avb.2024.102008',
        pdf: Publication15,
    },
    {
        title: 'Waar letten inbrekers op? Observatie van inbrekers in een virtual reality omgeving',
        authors: 'Sergiou, C. S., Elffers, H., & van Gelder, J. L.',
        journal: 'Tijdschrift voor Criminologie',
        year: 2024,
        kind: 'RESEARCH ARTICLE',
        topics: ['Technology', 'Forensic', 'Behavior'],
        authorship: 'First author',
        link: 'https://www.boomportaal.nl/tijdschrift/TvC/TvC_0165-182X_2024_066_002_003',
        pdf: Publication16,
    },
    {
        title: 'Neuropsychological assessment of aggressive offenders: a Delphi consensus study',
        authors: 'Hutten, J. C., Van Horn, J. E., Hoppenbrouwers, S. S., Ziermans, T. B., Geurts, H. M., Sergiou C.S.',
        journal: 'Frontiers in Psychology',
        year: 2024,
        kind: 'RESEARCH ARTICLE',
        topics: ['Forensic', 'Behavior', 'Neuroscience'],
        authorship: 'Co-author',
        accolade: { type: 'award', label: 'Society of Biological Psychiatry: Best Paper Award' },
        link: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1328839/full',
        pdf: Publication14,
    },
    {
        title: 'Virtual reality-based retrospective think aloud (VR-RTA): a novel method for studying offender decision-making',
        authors: 'Sergiou, C.-S., Gerstner, D., Nee, C., Elffers, H., & van Gelder, J.-L.',
        journal: 'Crime Science',
        year: 2024,
        kind: 'RESEARCH ARTICLE',
        topics: ['Technology', 'Forensic', 'Behavior'],
        authorship: 'First author',
        link: 'https://www.crimrxiv.com/pub/btgwyz1b/release/2',
        pdf: Publication13,
    },
    {
        title: 'Neighborhood crime reduction interventions and perceived livability: A virtual reality study on fear of crime',
        authors: 'McClanahan, W. P., Sergiou, C. S., Siezenga, A. M., Gerstner, D., Elffers, H., van der Schalk, J., & van Gelder, J. L.',
        journal: 'Cities',
        year: 2024,
        kind: 'RESEARCH ARTICLE',
        topics: ['Technology', 'Forensic', 'Behavior'],
        authorship: 'Co-author',
        link: 'https://www.sciencedirect.com/science/article/pii/S0264275124000374?via%3Dihub',
        pdf: Publication12,
    },
    {
        title: 'The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence',
        authors: 'Sergiou, C.S., Tatti, E., Romanella, S.M., Santarnecchi, E., Weidema, A.D., Rassin, E.C.G., Franken, I.H.A., & van Dongen, J.D.M.',
        journal: 'International Journal of Clinical and Health Psychology',
        year: 2023,
        kind: 'RESEARCH ARTICLE',
        topics: ['Neuromodulation', 'Forensic', 'Neuroscience'],
        authorship: 'First author',
        link: 'https://doi.org/10.1016/j.ijchp.2023.100374',
        pdf: Publication2,
    },
    {
        title: 'Psychopathy as a predisposition to lie hedonistically',
        authors: 'Rassin, E., Sergiou, C., van der Linde, D., & van Dongen, J.D.M.',
        journal: 'Psychology, Crime & Law',
        year: 2023,
        kind: 'RESEARCH ARTICLE',
        topics: ['Forensic', 'Behavior'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1080/1068316X.2023.2213802',
        pdf: Publication1,
    },
    {
        title: 'Understanding the Aggressive Brain: HD-tDCS in reducing aggression and as a treatment intervention in forensic patients',
        authors: 'Sergiou, C.S.',
        journal: 'PhD Dissertation — Erasmus University Rotterdam',
        year: 2022,
        kind: 'DISSERTATION',
        topics: ['Neuromodulation', 'Forensic', 'Neuroscience'],
        authorship: 'First author',
        accolade: { type: 'phd', label: 'PhD Dissertation' },
        link: 'https://pure.eur.nl/ws/portalfiles/portal/53177863/understandingtheagressivebraincarmensergiouprint18x25book06_2_6256af909b055.pdf',
        pdf: Publication11,
    },
    {
        title: 'tDCS targeting the Ventromedial Prefrontal Cortex reduces reactive aggression and modulates electrophysiological responses in a forensic population',
        authors: 'Sergiou, C. S., Santarnecchi, E., Romanella, S. M., Wieser, M. J., Franken, I. H. A., Rassin, E. G. C., & van Dongen, J. D. M.',
        journal: 'Biological Psychiatry: Cognitive Neuroscience and Neuroimaging',
        year: 2022,
        kind: 'RESEARCH ARTICLE',
        topics: ['Neuromodulation', 'Forensic', 'Behavior'],
        authorship: 'First author',
        link: 'https://doi.org/10.1016/j.bpsc.2021.05.007',
        pdf: Publication3,
    },
    {
        title: 'tDCS as an intervention to improve empathic abilities and reduce violent behavior in forensic offenders: study protocol for a randomized controlled trial',
        authors: 'Sergiou, C.S., Woods, A., Franken, I.H.A., & van Dongen, J.D.M.',
        journal: 'Trials',
        year: 2020,
        kind: 'RESEARCH ARTICLE',
        topics: ['Neuromodulation', 'Forensic', 'Behavior'],
        authorship: 'First author',
        link: 'https://doi.org/10.1186/s13063-020-4074-0',
        pdf: Publication4,
    },
    {
        title: 'The effectiveness of tDCS to improve empathic abilities and reduce violent behavior: A literature review',
        authors: 'Sergiou, C. S., Santarnecchi, E., Franken, I. H. A., & van Dongen, J. D. M.',
        journal: 'Aggression and Violent Behavior',
        year: 2020,
        kind: 'REVIEW',
        topics: ['Neuromodulation', 'Forensic', 'Behavior'],
        authorship: 'First author',
        link: 'https://doi.org/10.1016/j.avb.2020.101463',
        pdf: Publication5,
    },
    {
        title: 'Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine: A consensus paper on the present state of the science',
        authors: 'Ekthiari, H., Zangen, A., Del Felice, A., Shahbabaie, A., Goudriaan, A., Sergiou C.S., et al.',
        journal: 'Neuroscience & Biobehavioral Reviews',
        year: 2019,
        kind: 'REVIEW',
        topics: ['Neuromodulation', 'Neuroscience'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1016/j.neubiorev.2019.06.007',
        pdf: Publication6,
    },
    {
        title: 'Middelengebruik en geweld: ontwikkeling en validatie van een testbatterij',
        authors: 'van Dongen, J., Sergiou, C., Franken, I.',
        journal: 'WODC — Ministerie van Justitie en Veiligheid',
        year: 2019,
        kind: 'REPORT',
        topics: ['Forensic', 'Behavior'],
        authorship: 'Co-author (Nederlands)',
        link: 'https://repository.wodc.nl/handle/20.500.12832/2363',
        pdf: Publication10,
    },
    {
        title: 'Visual attention in violent offenders: susceptibility to distraction',
        authors: "Slotboom, J., Hoppenbrouwers, S.S., In 't Hout, W., Sergiou, C.S., Van der Stigchel, S. & Theeuwes, J.",
        journal: 'Psychiatry Research',
        year: 2016,
        kind: 'RESEARCH ARTICLE',
        topics: ['Forensic', 'Behavior', 'Neuroscience'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1016/j.psychres.2017.02.031',
        pdf: Publication7,
    },
    {
        title: 'Top-down attention and selection history in psychopathy: evidence from a community sample',
        authors: 'Hoppenbrouwers, S.S., Van der Stigchel, S., Sergiou C.S., & Theeuwes, J.',
        journal: 'Journal of Abnormal Psychology',
        year: 2016,
        kind: 'RESEARCH ARTICLE',
        topics: ['Forensic', 'Behavior', 'Neuroscience'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1037/abn0000133',
        pdf: Publication8,
    },
    {
        title: 'Interventions for Improving Affective Abilities in Adolescents: An Integrative Review',
        authors: 'Lui, J., Sergiou, C.S., Barry, C.',
        journal: 'Adolescent Research Review',
        year: 2016,
        kind: 'REVIEW',
        topics: ['Behavior'],
        authorship: 'Co-author',
        link: 'https://doi.org/10.1007/s40894-016-0047-7',
        pdf: Publication9,
    },
]

export const publications: Publication[] = RAW.map((p, i) => ({
    ...p,
    cover: COVERS[i % COVERS.length],
}))

// Stat counters shown on the Publications intro panel.
export const publicationStats = [
    { value: '40+', label: 'PUBLICATIONS' },
    { value: '25+', label: 'PEER-REVIEWED ARTICLES' },
    { value: '5', label: 'REVIEWS' },
    { value: '3', label: 'BOOK CHAPTERS' },
]
