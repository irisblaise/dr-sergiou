import React from 'react'
import { projectDataPresent, projectDataPast } from '../Projects/projectData.js'
import MediaCard from '../../Components/mediaCard/mediaCards'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import './projects.scss'

function Projects() {
    return (
        <div className="panel-wrapper">
            <div className="panel project-header">
                <VideoTextOverlay video={VisualBrain3} text="PROJECTS" />
            </div>

            <div className="panel projects">
                <div className="project-wrapper">
                    <div className="project-container">
                        <div className="project">
                            <h1>Current Projects</h1>
                            {projectDataPresent.map((project, index) => {
                                return (
                                    <div className="grid" key={index}>
                                        <MediaCard
                                            // image={project.image}
                                            key={index}
                                            link={project.link}
                                            mediaType={project.mediaType}
                                            subject={project.subject}
                                            date={project.date}
                                            image={project.image}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="project">
                            <h1>Completed Projects</h1>
                            {projectDataPast.map((project, index) => {
                                return (
                                    <div className="grid" key={index}>
                                        <MediaCard
                                            // image={project.image}
                                            key={index}
                                            link={project.link}
                                            mediaType={project.mediaType}
                                            subject={project.subject}
                                            date={project.date}
                                            image={project.image}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projects
