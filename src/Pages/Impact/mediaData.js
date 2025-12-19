import FNT1 from '../../assets/images/media/FNT1.jpeg'
import YNL1 from '../../assets/images/media/YNL1.png'
import DPECS1 from '../../assets/images/media/DPECS1.png'
import Talkshow1 from '../../assets/images/media/Talkshow1.jpeg'
import Talkshow2 from '../../assets/images/media/Talkshow2.jpeg'
import Talkshow3 from '../../assets/images/media/Talkshow3.jpeg'
import Talkshow4 from '../../assets/images/media/Talkshow4.jpeg'
import Talkshow5 from '../../assets/images/media/Talkshow5.jpeg'
import Talkshow6 from '../../assets/images/media/Talkshow6.jpeg'
import Talkshow7 from '../../assets/images/media/Talkshow7.jpeg'
import PD1 from '../../assets/images/media/PD1.jpeg'
import VBP1 from '../../assets/images/media/VBP1.png'
import DrKelderEnCo from '../../assets/images/media/DrKelderEnCo.webp'
import MaxPlanckInstitute from '../../assets/images/media/MaxPlanckInstitute.svg'

export const mediaData = [
    {
        mediaType: 'Interview: Postdoc Appreciation Week',
        subject: 'Interview about my carreer and postdoc position',
        peopleInvolved: 'C.S. Sergiou',
        description: 'Interview for Postdoc Appreciation week about my forensic neuroscience carreer,how I combine forensic, neuro and technology, and shape my rol as supervisor and network builder',
        link: 'https://www.amsterdamumc.org/en/research/news/spotlight-on-aph-postdocs-carmen-silva-sergious-story.htm',
        date: '18-09-2025',
        image: PD1,
        assets: [
            { type: 'image', src: PD1 },
        ],},
    {
        mediaType: 'Symposium and Network',
        subject:
            'Grantholder: FORNEUROTECH - Integrating Neurobiology with Technology in Forensic Care',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'FORNEUROTECH is a lasting platform for interdisciplinary collaboration with national and international experts in neuroscience, technology and practice. Join our mailinglist: ',
        link: '',
        date: '04-04-2025',
        image: FNT1,
        assets: [{ type: 'image', src: FNT1 }],
    },
    {
        mediaType: 'Interview: Young Neuroscientist Platform',
        subject: 'YoungNeurolabNL - Selected core member YoungNeurolabNL',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'A platform by and for early-career researchers in the field of brain, cognition, and behavior research. The aim of this initiative is to give young researchers a voice, actively engage them in their research field, strengthen their position within it, and promote interdisciplinary and multicenter collaborations.',
        link: 'https://neurolab.nl/young-neurolabnl/',
        date: '11-04-2025',
        image: YNL1,
        assets: [
            { type: 'video', src: 'https://youtu.be/gi6uR13ZJwg' },
            { type: 'image', src: YNL1 },
        ],
    },
    {
        mediaType: 'Podcast: DPECS -Meeting the Future Society',
        subject: 'Agression in Forensic Patients- PHD Project',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'In this episode I talk about my PhD project using neuromodulation to reduce aggression and enhance empathy. I explain the method and its effectiveness',
        link: 'https://open.spotify.com/episode/48hiphLoEg6vIcmX5Vfgam',
        date: '15-11-2022',
        image: DPECS1,
        assets: [{ type: 'image', src: DPECS1 }],
    },
    {
        mediaType: 'Live Talkshow: Studio Erasmus',
        subject: 'Neuromodulation to Reduce Aggression',
        peopleInvolved: 'C.S.Sergiou & J.D.M van Dongen',
        description:
            'In this live talkshow we talk about my PHD Project with a live audience and host.',
        link: 'https://www.youtube.com/watch?v=ct2KAOHN4Xg',
        date: '29-11-2023',
        image: Talkshow1,
        assets: [
            {
                type: 'video',
                src: 'https://www.youtube.com/watch?v=ct2KAOHN4Xg',
            },
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
        mediaType: 'Live Radioshow: Radio 1 - Dr, Kelder & Co',
        subject:
            'De Jonge Doctor– Modeleren van Agressie in Forensiche Patiënten',
        peopleInvolved: 'C.S.Sergiou & J. Kelder ',
        description:
            'In this live radioshow I talk with J.Kelder about my PHD project after recently graduated as a Doctor in Forensic Neuroscience',
        link: 'https://www.nporadio1.nl/fragmenten/dr-kelder-en-co/adc2cb07-5bfa-4d73-bbc1-eaa7c8ec2aee/2022-06-09-boefjes-in-toom-houden-met-elektroshocks',
        date: '11-06-2022',
        image: DrKelderEnCo,
        assets: [{ type: 'video', src: 'https://youtu.be/XUna_wFdAsE' }],
    },
    {
        mediaType: 'Blogpost Leiden University',
        subject: 'Inbraakpreventie met behulp van Virtual Reality',
        peopleInvolved: 'C.S.Sergiou & Nick Weessies',
        description:
            'In this Dutch blogpost we talk about conducting a Virtual Reality study with incarcerated burglars and our datacollection proces',
        link: 'https://www.leidenpedagogiekblog.nl/articles/inbraakpreventie-met-behulp-van-virtual-reality',
        date: '19-06-023',
        image: VBP1,
        assets: [{ type: 'image', src: VBP1 }],
    },
    {
        mediaType: 'Infovideo -  Virtual Burglary Project',
        subject: 'Max Planck Institute- Virtual Burglary Project',
        peopleInvolved:
            'C.S.Sergou, Jean-Louis van Gelder, Peter Wozniak, Timothy Barnum, Dominik Gerstner, PI Alphen aan den Rijn',
        description:
            'In this video we demonstrate how we conduct VR research with incarcerated burglars in the Dutch PI Alphen aan den Rijn prison for the Virtual Burglary Project',
        link: '',
        date: '15-12-2022',
        image: MaxPlanckInstitute,
        assets: [{ type: 'video', src: 'https://youtu.be/JMfi2G9ARDE' }],
    },
]
