import Award1 from '../../assets/images/awards/Award1.jpeg'
import Award2 from '../../assets/images/awards/Award2.jpeg'
import Award3 from '../../assets/images/awards/Award3.jpeg'
import Award4 from '../../assets/images/awards/Award4.png'
import Award5 from '../../assets/images/awards/Award5.jpeg'

export const awardsData = [
    {
        mediaType: 'Best Paper Award',
        subject: 'Society of Biological Psychiatry: Best-Paper Award',
        peopleInvolved: 'C.S. Sergiou',
        description:
            'Award for the most cited and downloaded paper of BPCNNI, on my paper on using HD-tDCS to reduce aggression in violent offenders.',
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
        peopleInvolved: 'C.S.Sergiou',
        description:
            'Chosen for the cover of BPCCNI January 2022 issue, where my biophysical modelling of the HD-tDCS at Harvard Medical School is showcased ',
        date: '01-01-2022',
        assets: [{ type: 'image', src: Award4 }],
    },
    {
        mediaType: 'KNAW Early Career Partnership 2025',
        subject:
            'KNAW grant to organise my own network & symposium on FORNEUROTECH.',
        peopleInvolved: 'C.S.Sergiou',
        description:
            'Awarded the KNAW grant to organise a two-day symposium with experts on the integration of Neurobiological knowledge and Technology in Forensic Care. ',
        date: '01-04-2025',
        assets: [{ type: 'image', src: Award5 }],
    },
]
