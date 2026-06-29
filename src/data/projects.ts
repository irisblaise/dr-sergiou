import type { Project } from './types'
const HorizonNeuroscience = '/assets/images/Projects2/HorizonNeuroscience.png'
const neuroYouth = '/assets/images/Projects2/neuroYouth.jpeg'
const psycopath = '/assets/images/Projects2/psycopath.png'
const Virtual_Burglary = '/assets/images/Projects2/Virtual_Burglary.avif'
const Neuromodulation = '/assets/images/Projects2/brainneuromodilation.png'
const KetamineDepression = '/assets/images/Projects2/ketamineDepression.webp'
const Award3 = '/assets/images/awards/Award_3.jpeg'

// Ported from Projects/projectData.js (projectDataPresent), extended with year + accent.
export const projects: Project[] = [
    {
        title: 'FORNEUROTECH Symposium',
        description: 'A symposium on the future of neurotechnology.',
        link: 'https://forneurotech.network',
        dateRange: '2025 – Current',
        year: '2025',
        color: '#C8326F',
        node: 80,
        image: Award3,
    },
    {
        title: 'Growing Up Together in Society (GUTS)',
        description:
            'Postdoctoral researcher at Amsterdam UMC · Longitudinal study into the neuropsychological development of high-risk antisocial youth.',
        link: 'https://www.gutsproject.com/work-package/antisocial-behaviour/',
        dateRange: '2024 – Current',
        year: '2024',
        color: '#d9964c',
        node: 330,
        image: neuroYouth,
    },
    {
        title: 'Virtual Burglary Project',
        description:
            'Postdoctoral researcher · VR study investigating criminal decision-making in incarcerated burglars.',
        link: 'https://csl.mpg.de/en/projects/virtual-burglary-project',
        dateRange: '2022 – Current',
        year: '2022',
        color: '#5d8a74',
        node: 542,
        image: Virtual_Burglary,
    },
    {
        title: 'Horizon Neuroscience (Boston)',
        description: 'Research team · Solutions for brain health.',
        link: 'https://horizon-neuro.com/',
        dateRange: '2023 – Current',
        year: '2023',
        color: '#6a92c5',
        node: 735,
        image: HorizonNeuroscience,
    },
    {
        title: 'Aftermath Psychopathy Foundation',
        description:
            'Head of translations · Website to inform victims of psychopathic individuals.',
        link: 'https://aftermath-surviving-psychopathy.org/',
        dateRange: '2019 – Current',
        year: '2019',
        color: '#db9f93',
        node: 940,
        image: psycopath,
    },
    {
        title: 'Open Foundation',
        description:
            'Co-author · Report on using ketamine in treatment-resistant depression.',
        link: 'https://open-foundation.org/',
        dateRange: '2022 – 2023',
        year: '2022',
        color: '#da964e',
        node: 1166,
        image: KetamineDepression,
    },
    {
        title: 'PhD Project — Unraveling the Aggressive Brain',
        description:
            'Neuromodulation to reduce aggression and increase empathic abilities in forensic patients.',
        link: 'https://pure.eur.nl/en/publications/understanding-the-aggressive-brain-high-definition-transcranial-d',
        dateRange: '2017 – 2022',
        year: '2017',
        color: '#935b5b',
        node: 1362,
        image: Neuromodulation,
    },
]
