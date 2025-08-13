import React, { forwardRef, useRef } from 'react'
import './verticalAccordionItem.scss'
import backgroundPaper from './backgroundpaper.avif'
import { FaAward, FaUserGraduate } from 'react-icons/fa'

export type VerticalAccordionItemProps = {
    index: number
    active: boolean
    title: string
    icon?: string
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
        icon,
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
                        <>
                            <h4>{journal}</h4>
                            {icon === 'award' && <FaAward />}
                            {icon === 'phd' && <FaUserGraduate />}
                            <h3 className="year">{date}</h3>
                        </>
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
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyItems: 'center',
                                gap: '2px',
                            }}
                        >
                            <h3>
                                {icon === 'phd' && <FaUserGraduate />} {journal}
                                , {date}
                            </h3>
                            {icon === 'award' && (
                                <p>
                                    <FaAward /> Society of biological
                                    psychiatry: Best Paper Award
                                </p>
                            )}
                        </div>
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
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '9px',
                                borderRadius: '50px',
                                padding: '10px 20px',
                                border: '3px solid #c07474',
                                background: 'transparent',
                                width: 'fit-content',
                                fontWeight: 600,
                                fontSize: '1em',
                                justifyContent: 'center',
                                margin: '10px auto',
                            }}
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
