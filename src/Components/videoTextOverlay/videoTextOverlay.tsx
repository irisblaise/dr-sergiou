import './videoTextOverlay.scss'
import React, { useEffect, useRef } from 'react'

export type videoTextOverlayProps = {
    video: string
    text: string
    textLine1?: string
}

function VideoTextOverlay({ video, text, textLine1 }: videoTextOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>()

    useEffect(() => {
        // @ts-ignore
        videoRef.current.playbackRate = 0.5
    }, [])

    return (
        <div className="wrapper">
            <div className="video-wrapper">
                {video && (
                    <video
                        // @ts-ignore
                        ref={videoRef}
                        playsInline
                        autoPlay
                        muted
                        loop
                        src={video}
                    />
                )}
            </div>
            <div className="video-content">
                <h1>{text}</h1>
                {textLine1 && <h1>{textLine1}</h1>}
            </div>
        </div>
    )
}

export default VideoTextOverlay
