import React, {forwardRef, useRef, useState} from "react";
import './verticalAccordionItem.scss';
// @ts-ignore
import gsap from 'gsap';
import PdfDisplay from "../PdfDisplay/pdfDisplay";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type VerticalAccordionItemProps = {
    title: string,
    year: string,
    description: string,
    authors?: string,
    // link?: string,
    onToggle: () => void;
};

let tl = gsap.timeline({});

const VerticalAccordionItem = forwardRef(({title, year, description, authors}: VerticalAccordionItemProps, ref) => {
    const [isItemOpen, setIsItemOpen] = useState(false)

    const item = useRef(null);
    const publicationContainer = useRef(null)
    const titleRef = useRef(null)
    const descriptionRef = useRef(null)
    const publicationTextRef = useRef(null)

    function accordionToggle() {
        setIsItemOpen(!isItemOpen)
        tl.to(item.current, {duration: 1, width: '700px', background: '#e77f67a8' })
        tl.to(publicationContainer.current, {duration: 1, width: "700px", autoAlpha: 1}, "<")
        isItemOpen ? tl.reverse() : tl.play()
    }

    return (
        <div ref={item} key={title} className="item">
            <div ref={titleRef} onClick={accordionToggle} className="titleWrapper">
                <h1 className="title">
                    {title}
                </h1>
                <h3 className="year">{year}</h3>
            </div>
            <div ref={publicationContainer} className="publication__container">
                <div ref={publicationTextRef} className="publication__text">
                <h1 ref={titleRef}>{title}</h1>
                <p className='authors'>{authors}</p>
                <h3 className="description" ref={descriptionRef}>{description}</h3>
                </div>
                <PdfDisplay />
            </div>
        </div>
    );
})
export default VerticalAccordionItem;
