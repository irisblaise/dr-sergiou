import React, { useEffect, useRef} from "react";
import './verticalAccordion.scss';
// @ts-ignore
import publication from './publications/Brain-visual-home-banner.jpg'
import VerticalAccordionItem from "../VerticalAccordionItem/verticalAccordionItem";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VerticalAccordion = () => {
    const publications = [
        {
            title: 'International Journal of Clinical and Health Psychology 23',
            description: 'The effect of HD-tDCS on brain oscillations and frontal synchronicity during resting-state EEG in violent offenders with a substance dependence.',
            image: publication,
            date: '2023',
            authors: 'Sergiou, C.S., Tatti, E., Romanella, S.M., Santarnecchi, E., Weidema, A.D., Rassin, E.C.G., Franken, I.H.A., van Dongen, J.D.M',
            link: 'https://doi.org/10.1016/j.ijchp.2023.100374',
        },
        {
            title: 'Biological Psychiatry: Cognitive Neuroscience and Neuroimaging',
            description: "tDCS targeting the Ventromedial Prefrontal Cortex reduces reactive aggression and modulates electrophysiological responses in a forensic population",
            image: publication,
            date: '2022',
            authors: ['Sergiou, C. S.', 'Santarnecchi, E.', 'Romanella, S. M.', 'Wieser, M. J.', 'Franken, I. H. A.', 'Rassin, E. G. C.', 'van Dongen, J. D. M'],
            link: 'https://doi.org/10.1186/s13063-020-4074-0',
        },
        {
            title: 'Trials.',
            image: publication,
            description: "Transcranial direct current stimulation (tDCS) as an intervention to improve empathic abilities and reduce violent behavior in forensic offenders: study protocol for a randomized controlled trial.",
            date: '2020',
            authors: ['Sergiou, C.S.', 'Woods, A.', 'Franken, I.H.A.', 'van Dongen, J.D.M.'],
        },
        {
            title: 'Aggression and Violent Behavior,',
            image: publication,
            description: "The effectiveness of Transcranial Direct Current Stimulation as an intervention to improve empathic abilities and reduce violent behavior: A literature review.",
            date: '2020',
            authors: ['Sergiou, C. S.', 'Santarnecchi, E.', 'Franken, I. H. A.', 'van Dongen, J. D. M.'],
        },
        {
            title: 'OSF Open-Ended Registration',
            description: 'Assessing Deterrence through Dynamic Guardianship-A Virtual Reality Study.',
            image: publication,
            date: '2022',
            authors: ['Gerstner, D.', 'Sergiou, C.S.', 'Nettle, D.,','van Gelder, J.L'],
        },
        {
            title: 'Neuroscience & Behavioral Reviews.',
            description: 'Transcranial Electrical and Magnetic Stimulation (tES and TMS) for Addiction Medicine: A consensus paper on the present state of the science and the road ahead.',
            image: publication,
            date: '2019',
            authors: ['Ekthiari, H.', 'Zangen, A.', 'Del Felice, A.', 'Shababaie, A.', 'Goudriaan, A.', 'Sergiou C.S.'],
        },
        {
            title: 'Psychiatry Research, Vol.251.',
            description: 'Visual attention in violent offenders: susceptibility to distraction.',
            image: publication,
            date: '2016',
            authors: ['Slotboom,J.', 'Hoppenbrouwers, S.S.', 'In ‘t Hout, W.', 'Sergiou C.S.', 'van der Stigchel, S', 'Theeuwes, J.']
        },
        {
            title: 'Journal of Abnormal Psychology, Vol.124, No.4.',
            description: 'Top down attention and selection history in psychopathy: evidence from a community sample.',
            image: publication,
            date: '2016',
            authors: ['Hoppenbrouwers, S.S.',' van der Stigchel, S.', 'Sergiou C.S.', 'Theeuwes, J.']
        },
        {
            title: 'Adolescent Research Review.',
            image: publication,
            description: "Improving Affective Abilities in Adolescents: An Integrative Review Across Community and Clinical Samples of Adolesents.",
            date: '2016',
            authors: ['Lui, J.', 'Sergiou, C.S.', 'Barry, C.']
        },
    ]
    const component = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (component.current && itemsRef.current) {
            let items = gsap.utils.toArray(".item");
            let to = gsap.to(items, {
                // xPercent: -100 * (items.length -1),
                x: -(component.current.scrollWidth - component.current.clientWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: component.current,
                    markers: true,
                    pin: true,
                    start: 'top top',
                    pinSpacing: true,
                    scrub: true,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    end: () => "+=" + component?.current?.offsetWidth
                },
            });

            return () => {
                to.kill();
            };
        }

    },[])

    return (
        <div ref={component} className="verticalAccordion">
            <div className="verticalAccordion__container">
                <div ref={itemsRef} className="items">
                    { publications.map((publication: any, index: number) => {
                        return (
                            // @ts-ignore
                            <VerticalAccordionItem index={index} key={index} title={publication.title} publication={publication.image} year={publication.date} description={publication.description} authors={publication.authors}/>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
export default VerticalAccordion;
