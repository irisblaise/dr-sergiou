import './verticalAccordionTwo.scss'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { publicationData } from './publications/publicationData'
import VerticalAccordionItem from '../VerticalAccordionItem/verticalAccordionItem'
import { isMobile } from 'react-device-detect'

gsap.registerPlugin(ScrollTrigger)

let timeline = gsap.timeline({})

const VerticalAccordionItemTwo = () => {
    const tl = useRef(timeline)
    const [isItemOpen, setIsItemOpen] = useState(0)
    const component = useRef<HTMLDivElement>(null)
    const accordionItems = useRef(new Array())

    useLayoutEffect(() => {
        if (isMobile) return
        const ctx = gsap.context(() => {
            tl.current.to(accordionItems.current, {
                x: -100 * (accordionItems.current.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: component.current,
                    start: '-80px',
                    pin: true,
                    scrub: 0.6,
                    markers: false,
                    end: () => '+=' + component?.current?.offsetWidth,
                },
            })
        })

        return () => ctx.revert()
    }, [])

    function handleToggle(item: any, index: number) {
        if (isItemOpen === index) {
            return setIsItemOpen(0)
        }

        setIsItemOpen(index)
    }

    return (
        <div ref={component} id="container">
            {publicationData.map((publication: any, index: number) => {
                return (
                    <VerticalAccordionItem
                        ref={(element) =>
                            (accordionItems.current[index] = element)
                        }
                        // @ts-ignore
                        key={index}
                        index={index}
                        pdfLink={publication.pdfLink}
                        image={publication.image}
                        active={isItemOpen === index}
                        icon={publication.icon}
                        triggerTitle={publication.triggerTitle}
                        title={publication.title}
                        journal={publication.journal}
                        date={publication.date}
                        description={publication.description}
                        authors={publication.authors}
                        authorship={publication.authorship}
                        backgroundColor={publication.backgroundColor}
                        handleToggle={() => handleToggle(publication, index)}
                        // backgroundColor={backgroundColors[index]}
                    />
                )
            })}
        </div>
    )
}

export default VerticalAccordionItemTwo
