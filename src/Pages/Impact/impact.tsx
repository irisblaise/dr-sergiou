import React from 'react'
import './impact.scss'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import MediaCard from '../../Components/mediaCard/mediaCards'
import { mediaData } from './mediaData'
import { awardsData } from './awardData'

function Impact() {
    return (
        <div className="media panel-wrapper">
            <div className="panel media-header">
                <VideoTextOverlay
                    video={VisualBrain3}
                    text="AWARDS AND MEDIA"
                />
            </div>
            <div className="panel media">
                <h1 className="grid-title">Awards</h1>
                <div className="award-wrapper">
                    {awardsData.map((award, index) => {
                        return (
                            <div className="grid" key={index}>
                                <MediaCard
                                    image={award.image}
                                    key={index}
                                    peopleInvolved={award.peopleInvolved}
                                    mediaType={award.mediaType}
                                    subject={award.subject}
                                    date={award.date}
                                />
                            </div>
                        )
                    })}
                </div>

                <h1 className="grid-title">Media</h1>
                <div className="media-wrapper">
                    {mediaData.map((media, index) => {
                        return (
                            <div className="grid" key={index}>
                                <MediaCard
                                    image={media.image}
                                    key={index}
                                    link={media.link}
                                    peopleInvolved={media.peopleInvolved}
                                    mediaType={media.mediaType}
                                    subject={media.subject}
                                    date={media.date}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Impact
