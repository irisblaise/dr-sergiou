import type { Award, MediaItem } from './types'

const Award1 = '/assets/images/awards/Award1.jpeg'
const Award2 = '/assets/images/awards/Award2.jpeg'
const Award3 = '/assets/images/awards/Award3.jpeg'
const Award4 = '/assets/images/awards/Award4.png'
const Award5 = '/assets/images/awards/Award5.jpeg'

const FNT1 = '/assets/images/media/FNT1.jpeg'
const YNL1 = '/assets/images/media/YNL1.png'
const DPECS1 = '/assets/images/media/DPECS1.png'
const Talkshow1 = '/assets/images/media/Talkshow1.jpeg'
const Talkshow2 = '/assets/images/media/Talkshow2.jpeg'
const Talkshow3 = '/assets/images/media/Talkshow3.jpeg'
const Talkshow4 = '/assets/images/media/Talkshow4.jpeg'
const Talkshow5 = '/assets/images/media/Talkshow5.jpeg'
const Talkshow6 = '/assets/images/media/Talkshow6.jpeg'
const Talkshow7 = '/assets/images/media/Talkshow7.jpeg'
const PD1 = '/assets/images/media/PD1.jpeg'
const VBP1 = '/assets/images/media/VBP1.png'
const DrKelderEnCo = '/assets/images/media/DrKelderEnCo.webp'
const MaxPlanckInstitute = '/assets/images/media/MaxPlanckInstitute.svg'

// Ported from Impact/awardData.js (awardsData).
export const awards: Award[] = [
    {
        mediaType: 'Best Paper Award',
        subject: 'Society of Biological Psychiatry: Best-Paper Award',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'Award for the most cited and downloaded paper of BPCNNI, on my paper using HD-tDCS to reduce aggression in violent offenders.',
        date: '12-05-2024',
        image: Award1,
        assets: [
            { type: 'image', src: Award1 },
            { type: 'image', src: Award2 },
            { type: 'image', src: Award3 },
        ],
    },
    {
        mediaType: 'Best Cover Award',
        subject:
            "Biological Psychiatry: Cognitive Neuroscience and Imaging's Best Cover Award",
        peopleInvolved: 'C.S. Sergiou',
        description:
            'Chosen for the cover of the BPCCNI January 2022 issue, showcasing the biophysical modelling of HD-tDCS from Harvard Medical School.',
        date: '01-01-2022',
        image: Award4,
        assets: [{ type: 'image', src: Award4 }],
    },
    {
        mediaType: 'KNAW Early Career Partnership 2025',
        subject:
            'KNAW grant to organise my own network & symposium on FORNEUROTECH.',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'Awarded the KNAW grant to organise a two-day symposium with experts on the integration of neurobiological knowledge and technology in forensic care.',
        date: '01-04-2025',
        image: Award5,
        assets: [{ type: 'image', src: Award5 }],
    },
]

// Ported from Impact/mediaData.js (mediaData).
export const media: MediaItem[] = [
    {
        mediaType: 'Interview: Postdoc Appreciation Week',
        subject: 'Interview about my career and postdoc position',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'Interview for Postdoc Appreciation Week about my forensic neuroscience career, how I combine forensic, neuro and technology, and shape my role as supervisor and network builder.',
        link: 'https://www.amsterdamumc.org/en/research/news/spotlight-on-aph-postdocs-carmen-silva-sergious-story.htm',
        date: '18-09-2025',
        image: PD1,
        assets: [{ type: 'image', src: PD1 }],
    },
    {
        mediaType: 'Symposium and Network',
        subject:
            'Grantholder: FORNEUROTECH — Integrating Neurobiology with Technology in Forensic Care',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'FORNEUROTECH is a lasting platform for interdisciplinary collaboration with national and international experts in neuroscience, technology and practice.',
        link: 'https://forneurotech.network',
        date: '04-04-2025',
        image: FNT1,
        assets: [{ type: 'image', src: FNT1 }],
    },
    {
        mediaType: 'Interview: Young Neuroscientist Platform',
        subject: 'YoungNeurolabNL — Selected core member',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'A platform by and for early-career researchers in brain, cognition, and behavior research — giving young researchers a voice and promoting interdisciplinary collaboration.',
        link: 'https://neurolab.nl/young-neurolabnl/',
        date: '11-04-2025',
        image: YNL1,
        assets: [
            { type: 'video', src: 'https://youtu.be/gi6uR13ZJwg' },
            { type: 'image', src: YNL1 },
        ],
    },
    {
        mediaType: 'Podcast: DPECS — Meeting the Future Society',
        subject: 'Aggression in Forensic Patients — PhD Project',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'In this episode I talk about my PhD project using neuromodulation to reduce aggression and enhance empathy, explaining the method and its effectiveness.',
        link: 'https://open.spotify.com/episode/48hiphLoEg6vIcmX5Vfgam',
        date: '15-11-2022',
        image: DPECS1,
        assets: [{ type: 'image', src: DPECS1 }],
    },
    {
        mediaType: 'Live Talkshow: Studio Erasmus',
        subject: 'Neuromodulation to Reduce Aggression',
        peopleInvolved: 'C.S. Sergiou & J.D.M. van Dongen',
        description:
            'In this live talkshow we discuss my PhD project with a live audience and host.',
        link: 'https://www.youtube.com/watch?v=ct2KAOHN4Xg',
        date: '29-11-2023',
        image: Talkshow1,
        assets: [
            { type: 'video', src: 'https://www.youtube.com/watch?v=ct2KAOHN4Xg' },
            { type: 'image', src: Talkshow1 },
            { type: 'image', src: Talkshow2 },
            { type: 'image', src: Talkshow3 },
            { type: 'image', src: Talkshow4 },
            { type: 'image', src: Talkshow5 },
            { type: 'image', src: Talkshow6 },
            { type: 'image', src: Talkshow7 },
        ],
    },
    {
        mediaType: 'Live Radioshow: Radio 1 — Dr. Kelder & Co',
        subject:
            'De Jonge Doctor – Modeleren van Agressie in Forensische Patiënten',
        peopleInvolved: 'C.S. Sergiou & J. Kelder',
        description:
            'In this live radioshow I talk with J. Kelder about my PhD project after recently graduating as a Doctor in Forensic Neuroscience.',
        link: 'https://www.nporadio1.nl/fragmenten/dr-kelder-en-co/adc2cb07-5bfa-4d73-bbc1-eaa7c8ec2aee/2022-06-09-boefjes-in-toom-houden-met-elektroshocks',
        date: '11-06-2022',
        image: DrKelderEnCo,
        assets: [{ type: 'video', src: 'https://youtu.be/XUna_wFdAsE' }],
    },
    {
        mediaType: 'Blogpost Leiden University',
        subject: 'Inbraakpreventie met behulp van Virtual Reality',
        peopleInvolved: 'C.S. Sergiou & Nick Weessies',
        description:
            'In this Dutch blogpost we discuss conducting a Virtual Reality study with incarcerated burglars and our data-collection process.',
        link: 'https://www.leidenpedagogiekblog.nl/articles/inbraakpreventie-met-behulp-van-virtual-reality',
        date: '19-06-2023',
        image: VBP1,
        assets: [{ type: 'image', src: VBP1 }],
    },
    {
        mediaType: 'Infovideo — Virtual Burglary Project',
        subject: 'Max Planck Institute — Virtual Burglary Project',
        peopleInvolved:
            'C.S. Sergiou, Jean-Louis van Gelder, Peter Wozniak, Timothy Barnum, Dominik Gerstner',
        description:
            'In this video we demonstrate how we conduct VR research with incarcerated burglars in the Dutch PI Alphen aan den Rijn prison for the Virtual Burglary Project.',
        link: 'https://youtu.be/JMfi2G9ARDE',
        date: '15-12-2022',
        image: MaxPlanckInstitute,
        assets: [{ type: 'video', src: 'https://youtu.be/JMfi2G9ARDE' }],
    },
]
