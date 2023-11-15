import React from 'react'
import './Publications.scss'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import VerticalAccordionTwo from '../../Components/verticalAccordion/verticalAccordion'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'

function Publications() {
    return (
        <>
            <div className="publications panel-wrapper">
                <div className="panel blue">
                    <VideoTextOverlay
                        video={VisualBrain3}
                        text="SCIENTIFIC"
                        textLine1="PUBLICATIONS"
                    />
                </div>
                <div className="panel">
                    <div className="accordion-wrapper">
                        <VerticalAccordionTwo />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Publications
