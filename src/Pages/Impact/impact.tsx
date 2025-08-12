import React from 'react'
import './impact.scss'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import MediaCard from '../../Components/mediaCard/mediaCards'
import { mediaData } from './mediaData'
import { awardsData } from './awardData'
import ImpactSwiper from '../../Components/ImpactSwiper/ImpactSwiper'

function Impact() {
    // Combine media and awards, and add a group property for legenda
    const mediaItems = mediaData.map((item, idx) => ({
        ...item,
        key: idx,
        group: 'Media',
        assets: item.assets?.map(asset => ({
            type: asset.type === 'video' ? 'video' : 'image',
            src: asset.src as string
        })) as { type: 'image' | 'video'; src: string }[]
    }));
    const awardsItems = awardsData.map((item, idx) => ({
        ...item,
        key: mediaItems.length + idx,
        group: 'Awards',
        assets: item.assets?.map(asset => ({
            type: asset.type === 'video' ? 'video' : 'image',
            src: asset.src as string
        })) as { type: 'image' | 'video'; src: string }[]
    }));
    const allItems = [...mediaItems, ...awardsItems];
    return (
        <div className="media panel-wrapper">
            <div className="panel media-header">
                <VideoTextOverlay
                    video={VisualBrain3}
                    text="AWARDS AND MEDIA"
                />
            </div>
            <div className="panel media">
                <ImpactSwiper items={allItems} />
            </div>
        </div>
    )
}

export default Impact
