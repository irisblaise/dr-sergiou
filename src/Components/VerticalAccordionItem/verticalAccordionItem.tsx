import React, { forwardRef, useRef } from 'react'
import './verticalAccordionItem.scss'
import backgroundPaper from './backgroundpaper.avif'
import PDF1 from '../../assets/pdfs/Publication 1. Psychopathy as a predisposition to lie hedonistically.pdf'

export type VerticalAccordionItemProps = {
    index: number
    active: boolean
    title: string
    date: string
    description: string
    journal?: string
    image: string
    triggerTitle: string
    authors: string
    authorship?: string
    handleToggle: (item: any, index: number) => void
    backgroundColor?: string
    pdfLink: string
}

const VerticalAccordionItem = forwardRef<
    HTMLDivElement,
    VerticalAccordionItemProps
>(function VerticalAccordionItem(
    {
        active,
        triggerTitle,
        index,
        title,
        date,
        description,
        authors,
        journal,
        backgroundColor,
        handleToggle,
        authorship,
        image,
        pdfLink,
    }: VerticalAccordionItemProps,
    ref
) {
    const publicationContainer = useRef(null)
    const titleRef = useRef(null)
    const publicationTextRef = useRef(null)

    return (
        <div
            ref={ref}
            key={title}
            className={`item ${active ? 'active' : ''}`}
            style={{
                backgroundImage: `url(${backgroundPaper})`,
            }}
        >
            <div className="itemWrapper">
                <div
                    ref={titleRef}
                    className="titleWrapper"
                    onClick={() => handleToggle(ref, index)}
                >
                    <div className="journalWrapper">
                        <h4>{journal}</h4>
                        <h3 className="year">{date}</h3>
                    </div>

                    <div className="description">
                        <h2 className="title">{triggerTitle}</h2>
                    </div>
                </div>
                <div
                    ref={publicationContainer}
                    className="publication__container"
                >
                    <div ref={publicationTextRef} className="publication__text">
                        <h3>
                            {journal}, {date}
                        </h3>
                        <h2 ref={titleRef}>{title}</h2>
                        <div>
                            <p className="authors">
                                {authors} ({authorship})
                            </p>
                        </div>
                        <a
                            className="readMe"
                            href={pdfLink}
                            target="_blank"
                            rel="noreferrer"
                        >
                            READ ME
                        </a>
                    </div>
                    <div className="imageWrapper">
                        <img src={image} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
})

export default VerticalAccordionItem
