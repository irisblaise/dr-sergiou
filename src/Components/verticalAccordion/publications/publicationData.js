import Brain1 from '../../../assets/images/brains/Brain1.webp'
import Brain2 from '../../../assets/images/brains/Brain2.webp'
import Brain3 from '../../../assets/images/brains/Brain3.webp'
import Brain4 from '../../../assets/images/brains/Brain4.webp'
import Brain5 from '../../../assets/images/brains/Brain5.webp'
import Brain6 from '../../../assets/images/brains/Brain6.webp'
import Brain7 from '../../../assets/images/brains/Brain7.webp'
import Brain8 from '../../../assets/images/brains/Brain8.webp'
import Brain9 from '../../../assets/images/brains/Brain9.webp'
import Brain10 from '../../../assets/images/brains/Brain10.webp'
import Publication1 from '../../../assets/pdfs/Publication 1. Psychopathy as a predisposition to lie hedonistically.pdf'
import Publication2 from '../../../assets/pdfs/Publication 2. Sergiou et al. (2023).The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence.pdf'
import Publication3 from '../../../assets/pdfs/Publication 3.Sergiou et al. (2021)tDCS reducing aggression. Screenshot website.PNG'
import Publication4 from '../../../assets/pdfs/Publication 4.Sergiou et al. (2020).Study Protocol Paper.pdf'
import Publication5 from '../../../assets/pdfs/Publication 5,Sergiou et al. (2020). Literature Review.pdf'
import Publication6 from '../../../assets/pdfs/Publication 6.Ekthiari et al. (2019).Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine.pdf'
import Publication7 from '../../../assets/pdfs/Publication 7. Slotboom et al. (2017). Visual Attention in violent offenders.pdf'
import Publication8 from '../../../assets/pdfs/Publication 8. Hoppenbrouwersea2016_Top-DownAttentionandSelectionHistoryinPsychopathypdf.pdf'
import Publication9 from '../../../assets/pdfs/Publication 9. Lui et al (2017). Interventions for Improving Affective Abilities in Adolescents.pdf'
import Publication10 from '../../../assets/pdfs/Publication 10. van Dongen et al. Middelengebruik en Geweld.pdf'

export const publicationData = [
    {
        title: 'Psychopathy as a predisposition to lie hedonistically,',
        triggerTitle: 'Psychopathy as a predisposition to lie hedonistically',
        journal: 'Psychology, Crime & Law',
        date: 2023,
        authors:
            'Rassin, E., Sergiou, C., van der Linde, D., & van Dongen, J.D.M. ',
        authorship: 'Co-author',
        description: 'Psychopathy as a predisposition to lie hedonistically,',
        pdfTitle:
            'Publication 1. Psychopathy as a predisposition to lie hedonistically,',
        image: Brain1,
        link: 'https://login.ezproxy.leidenuniv.nl/login?qurl=https://doi.org%2f10.1080%2f1068316X.2023.2213802',
        pdfLink: Publication1,
    },
    {
        title: 'The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence.',
        triggerTitle:
            'The effect of HD-tDCS on brain oscillations in Violent Offenders',
        journal: 'International journal of Clinical and Health Psychology',
        date: 2023,
        authors:
            'Sergiou, C.S., Tatti, E., Romanella, S.M., Santarnecchi, E., Weidema, A.D., Rassin, E.C.G., Franken, I.H.A., & van Dongen, J.D.M',
        authorship: 'First author',
        description:
            'The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence.',
        pdfTitle:
            'Publication 2.The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence.',
        image: Brain10,
        link: 'https://doi.org/10.1016/j.ijchp.2023.100374',
        pdfLink: Publication2,
    },
    {
        title: 'tDCS targeting the Ventromedial Prefrontal Cortex reduces reactive aggression and modulates electrophysiological responses in a forensic population.',
        triggerTitle: 'HD-tDCS on the vmPFC reduces Reactive Aggression',
        journal:
            'Biological Psychiatry: Cognitive Neuroscience and Neuroimaging',
        date: 2022,
        authors:
            'Sergiou, C. S., Santarnecchi, E., Romanella, S. M., Wieser, M. J., Franken, I. H. A., Rassin, E. G. C., & van Dongen, J. D. M.',
        authorship: 'First author',
        description:
            'tDCS targeting the Ventromedial Prefrontal Cortex reduces reactive aggression and modulates electrophysiological responses in a forensic population.',
        pdfTitle: 'Publication 3. tDCS reducing Aggression',
        image: Brain7,
        link: 'https://doi.org/10.1016/j.bpsc.2021.05.007',
        pdfLink: Publication3,
    },
    {
        title: 'Transcranial direct current stimulation (tDCS) as an intervention to improve\nempathic abilities and reduce violent behavior in forensic offenders: study\nprotocol for a randomized controlled trial',
        triggerTitle:
            'Study Protocol using HD-tDCS to reduce Aggression in Forensic Patients',
        journal: 'Trials',
        date: 2020,
        authors:
            'Sergiou, C.S., Woods, A., Franken, I.H.A., & van Dongen, J.D.M.',
        authorship: 'First author',
        description:
            'Transcranial direct current stimulation (tDCS) as an intervention to improve\nempathic abilities and reduce violent behavior in forensic offenders: study\nprotocol for a randomized controlled trial',
        pdfTitle: 'Publication 4. Sergiou et al. (2020). Study Protocol paper',
        image: Brain4,
        link: 'https://doi.org/10.1186/s13063-020-4074-0.',
        pdfLink: Publication4,
    },
    {
        title: 'The effectiveness of Transcranial Direct Current Stimulation as an intervention to improve empathic abilities and reduce violent behavior: A literature review.',
        triggerTitle:
            'Literature Review using tDCS to increase Empatrhic Abilities & reduce Aggression',
        journal: 'Aggression and Violent Behavior,',
        date: 2020,
        authors:
            'Sergiou, C. S., Santarnecchi, E., Franken, I. H. A., & van Dongen, J. D. M',
        authorship: 'First author',
        description:
            'The effectiveness of Transcranial Direct Current Stimulation as an intervention to improve empathic abilities and reduce violent behavior: A literature review.',
        pdfTitle: 'Publication 5. Sergiou et al. (2020). Literature Review',
        image: Brain9,
        link: 'https://doi.org/10.1016/j.avb.2020.101463',
        pdfLink: Publication5,
    },
    {
        title: 'Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine: A consensus paper on the present state of the science and the road ahead.',
        triggerTitle: 'Consensus paper tES & TMS for Addiction',
        journal: 'Neuroscience & Biobehavioral Reviews.',
        date: 2019,
        authors:
            'Ekthiari H., Zangen, A., Del Felice, A., Shahbabaie, A., Gourdriaan, A., Sergiou C.S., et al.',
        authorship: 'Co-author',
        description:
            'Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine: A consensus paper on the present state of the science and the road ahead.',
        pdfTitle:
            'Publication 6.Ekthiari et al. (2019).Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine',
        image: Brain6,
        link: 'https://doi.org/10.1016/j.neubiorev.2019.06.007',
        pdfLink: Publication6,
    },
    {
        title: 'Visual attention in violent offenders: susceptibility to distraction',
        triggerTitle: 'Visual attention in violent offender',
        journal: 'Psychiatry Research,',
        date: 2016,
        authors:
            'Slotboom, J., Hoppenbrouwers, S.S., In ‘t Hout, W., Sergiou, C.S., Van der Stigchel, S. & Theeuwes, J.',
        authorship: 'Co-author',
        description:
            'Visual attention in violent offenders: susceptibility to distraction',
        pdfTitle:
            'Publication 7. Slotboom et al. (2017). Visual Attention in violent offenders',
        image: Brain3,
        link: 'https://doi.org/10.1016/j.psychres.2017.02.031',
        pdfLink: Publication7,
    },
    {
        title: 'Top down attention and selection history in psychopathy: evidence from a community sample',
        triggerTitle: 'Top down attention and selection history in psychopathy',
        journal: 'journal of Abnormal Psychology',
        date: 2016,
        authors:
            'Hoppenbrouwers, S.S., Van der Stigchel, S., Sergiou C.S., & Theeuwes, J.',
        authorship: 'Co-author',
        description:
            'Top down attention and selection history in psychopathy: evidence from a community sample',
        pdfTitle:
            'Publication 8. Hoppenbrouwersea2016_Top-DownAttentionandSelectionHistoryinPsychopathypdf.pdf',
        image: Brain8,
        link: 'https://doi.org/10.1037/abn0000133',
        pdfLink: Publication8,
    },
    {
        title: 'Interventions for Improving Affective Abilities in Adolescents: An Integrative Review Across Community and Clinical Samples of Adolescents.',
        triggerTitle:
            'Review paper Interventions for Improving Affective Abilities in Adolescents',
        journal: 'Adolescent Research Review Clinical Samples of Adolescents.',
        date: 2016,
        authors: 'Lui, J., Sergiou, C.S., Barry, C.',
        authorship: 'Co-author',
        description:
            'Interventions for Improving Affective Abilities in Adolescents: An Integrative Review Across Community and Clinical Samples of Adolescents.',
        pdfTitle:
            'Publication 9. Lui et al (2017). Interventions for Improving Affective Abilities in Adolescents',
        image: Brain5,
        link: 'https://doi-org.ezproxy.leidenuniv.nl/10.1007/s40894-016-0047-7',
        pdfLink: Publication9,
    },
    {
        title: 'Middelengebruik en geweld.\nontwikkeling en validatie van een testbatterij.',
        triggerTitle: 'Middelengebruik en geweld',
        journal: 'WODC. Ministerie van Justitie en Veiligheid.',
        date: 2019,
        authors: 'Dongen, J. van, Sergiou, C., Franken, I. ',
        authorship: 'NEDERLANDS- CO AUTEUR',
        description:
            'Middelengebruik en geweld.\nontwikkeling en validatie van een testbatterij.',
        pdfTitle: 'Publication 10. van Dongen et al. Middelengebruik en Geweld',
        image: Brain2,
        link: '2711_Volledige_Tekst_tcm28-368226.pdf (wodc.nl)',
        pdfLink: Publication10,
    },
]
