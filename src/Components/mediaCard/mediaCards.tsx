import React from 'react'
import './mediaCard.scss'

export type mediaCardProps = {
    media?: string
    mediaType: string
    subject: string
    peopleInvolved: string
    image?: string
    link?: string
    date: string
    key: number
}

const MediaCard = ({
    mediaType,
    subject,
    link,
    peopleInvolved,
    image,
    date,
}: mediaCardProps) => {
    return (
        <a className="card" href={link} target="_blank" rel="noreferrer">
            <div className="card__image">
                <img src={image} alt="" />

                <div className="card__overlay card__overlay--indigo">
                    <div className="card__overlay-content">
                        <ul className="card__meta">
                            <li>
                                <i className="fa fa-tag"></i> {mediaType}
                            </li>
                            <li>
                                <i className="fa fa-clock-o"></i> {date}
                            </li>
                        </ul>

                        <div className="card__title">{subject}</div>

                        <ul className="card__meta card__meta--last">
                            <li>
                                <i className="fa fa-user"></i> {peopleInvolved}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </a>
    )
}
export default MediaCard
