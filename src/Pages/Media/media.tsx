import React from 'react'
import './media.scss'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import MediaCard from '../../Components/mediaCard/mediaCards'
import { mediaData } from './mediaData'

function Media() {
    return (
        <div className="media panel-wrapper">
            <div className="panel media-header">
                <VideoTextOverlay video={VisualBrain3} text="IN THE MEDIA" />
            </div>
            <div className="panel media">
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

export default Media
