import type { HomeItem } from './types'

// Hero headline + intro — copy matches the hifi reference (Hero Color.dc.html / screenshot).
export const heroHeadline = 'The Never Ending Exploration of the Brain.'

// First phrase ("Hello there,") is emphasised in Ink by the Hero component.
export const heroIntro: string[] = [
    "Hello there, I'm a mega brain enthusiast with a PhD in Forensic Neuroscience. Currently working as a post-doctoral researcher using Virtual Reality (VR) to unravel criminal decision-making.",
    "Soon I'll start my postdoc into the neural correlates of high-risk antisocial youth using neuroimaging.",
    'My never-ending exploration of the brain is a journey guided by six profound passions.',
]

// The six "profound passions" — ported from the old homeData (Sections 2–7).
// Section1's long bio is preserved below as `fullBio` for reference / future use.
export const passions: HomeItem[] = [
    {
        section: 'Section2',
        number: 'No.1',
        title: '(Forensic) Neuroscience',
        description:
            'Oh the brain, what a majestic piece of art. It all started when I was very young and saw "One flew over the cuckoo\'s nest", to see the neurodiversity for the first time. Later on my fascination guided me towards the criminal brain. To examine how the neural correlates can shape decision-making into making criminal decisions. The crossroads of Neuroscience and the Forensic Field is where it all came together during my PhD. To unravel the neural underpinnings of aggression, emotion regulation and empathy are my main regions of fascination.',
    },
    {
        section: 'Section3',
        number: 'No.2',
        title: 'Criminal Decision-making',
        description:
            'Since I started this journey as a young puppet, I have studied the brain of forensic samples, using different tools, in different age groups and severity, but all with one aim: understanding criminal decision-making. Previously I worked as a post-doctoral researcher within the Virtual Burglary Project at the Max Planck Institute for Crime, Security, and Law (MPI) and Leiden University, where we used Virtual Reality (VR) to study criminal decision-making in incarcerated burglars. Currently, I work within the Growing up Together in Society (GUTS) team where we investigate the biopsychosocial development of high-risk youth using functional Magnetic Resonance Imaging (fMRI).',
    },
    {
        section: 'Section4',
        number: 'No.3',
        title: 'Innovative Technologies',
        description:
            'My fascination with innovative technologies that can improve therapy in forensic care is the common thread throughout my research trajectory. Technologies like virtual reality (VR), neuromodulation, functional Near-Infrared Spectroscopy (fNIRS), Electroencephalography (EEG), Hyperscanning, fMRI and the power of multi-modal approaches fuel my passion. Being able to study brain responses in real-time in virtual environments is the future avenue to unraveling the neural underpinnings of behavior. Recently I initiated the FORNEUROTECH network to bring these fields together.',
    },
    {
        section: 'Section5',
        number: 'No.4',
        title: 'The Future of Decentralized Science',
        description:
            "I'm on a mission to help revolutionize open science, to decentralize science (DeSci). Science should be available to everyone, regardless of a university affiliation. To this end, I've launched the Neuroscience NFT project, a collaboration with 3D artist Sytske Nijp and computer scientist Emanuel Boderash. Together, we're merging the digital world with the realms of science — using the brain scans of my own research studies, Sytske created 3D art.",
    },
    {
        section: 'Section6',
        number: 'No.5',
        title: 'Psychedelics in Mental Health Care',
        description:
            'I believe in the potential of using psychedelics in treatment, with a big emphasis on safe implementation in Dutch Mental Healthcare. When responsibly implemented, these treatments can be game-changers and keys to a better future. I co-created a report on using ketamine therapy in treatment-resistant depression (TRD) in collaboration with the Open Foundation.',
    },
    {
        section: 'Section7',
        number: 'No.6',
        title: 'Musical Synergy',
        description:
            'Next to all my scientific passions, music is a crucial factor in fueling my motivation and excitement. I combine this by DJ-ing (Ventromedial) and supporting the open-minded event organisation in Amsterdam, Kraft und Licht, with a homebase at Der Hintergarten. I believe dancing is a powerful tool to feel empowered and charged to continue as a devoted researcher.',
    },
]

// Full original bio (Section1) — retained from the ported data for reference.
export const fullBio =
    'Follow me into the world of curious neuronerding — through past projects, into current experiments, and toward the next big quests. I am Dr. Carmen-Silva Sergiou, a Forensic Neuroscientist with a fascination for investigating real-time brain processes with innovative technologies in forensic populations. Currently working as a post-doctoral researcher in the Growing Up Together In Society Consortium (GUTS) at the Amsterdam UMC. Recently, I founded the FORNEUROTECH network with support from the KNAW Early Career Partnership 2025 grant.'
