import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import { projectDataPresent } from '../Projects/projectData.js'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import './projects.scss'
import LINKICON from '../../assets/images/icons/linkicon.png'

gsap.registerPlugin(ScrollTrigger)

function Projects2() {
    const detailsRefs = useRef<(HTMLDivElement | null)[]>([])
    const photosRefs = useRef<(HTMLDivElement | null)[]>([])
    const galleryRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.set(photosRefs.current.slice(1), { yPercent: 101 })
    }, [])

    useEffect(() => {
        let mm = gsap.matchMedia()

        mm.add('(min-width: 600px)', () => {
            ScrollTrigger.create({
                trigger: '.gallery',
                start: 'top top',
                end: 'bottom bottom',
                pin: '.right',
                markers: false,
            })

            detailsRefs.current.forEach((detail, index) => {
                let headline = detail?.querySelector('h1')
                let animation = gsap
                    .timeline()
                    .to(photosRefs.current.slice(1)[index], { yPercent: 0 })
                    .set(photosRefs.current[index], { autoAlpha: 0 })
                    .fromTo(
                        galleryRef.current,
                        {
                            background:
                                projectDataPresent[index - 1]
                                    ?.backgroundColor || '#f3d3b0',
                        },
                        {
                            background:
                                projectDataPresent[index].backgroundColor,
                        }
                    )

                ScrollTrigger.create({
                    trigger: headline,
                    start: 'end 10%',
                    end: 'top -100%',
                    animation: animation,
                    scrub: true,
                    markers: false,
                })
            })
        })

        return () => {
            // Clean up the media query listener
            mm.kill()
        }
    }, [])

    return (
        <>
            <div className="spacer">
                <div className="panel project-header">
                    <VideoTextOverlay video={VisualBrain3} text="PROJECTS" />
                </div>
            </div>
            <div className="gallery" ref={galleryRef}>
                <div className="left">
                    <div className="desktopContent">
                        {projectDataPresent.map((data, index) => (
                            <div
                                className="desktopContentSection"
                                key={index}
                                ref={(el) => (detailsRefs.current[index] = el)}
                            >
                                <h1 style={{ color: data.color }}>
                                    {data.title}
                                </h1>
                                <p className={'date'}>{data.date}</p>
                                <p className={'description'}>
                                    {data.description}
                                </p>
                                <a
                                    href={data.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="link"
                                    style={{ borderColor: data.color }}
                                >
                                    Find Out More
                                    <img
                                        src={LINKICON}
                                        alt="link"
                                        className={'icon'}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right">
                    <div className="mobileContent">
                        {projectDataPresent.map((data, index) => (
                            <React.Fragment key={index}>
                                <div className={'mobileContentContainer'}>
                                    <h1>{data.title}</h1>
                                    <div
                                        className={`mobilePhoto ${data.color}`}
                                    >
                                        <img
                                            className={'image'}
                                            src={data.image}
                                            alt={data.title}
                                        />
                                    </div>
                                    <h4>{data.description}</h4>
                                    <p>{data.date}</p>
                                    <a
                                        href={data.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="link"
                                    >
                                        Find Out More
                                        <img
                                            src={LINKICON}
                                            alt="link"
                                            className={'icon'}
                                        />
                                    </a>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="desktopPhotos">
                        {projectDataPresent.map((data, index) => (
                            <div
                                className={`desktopPhoto ${data.color}`}
                                key={index}
                                ref={(el) => (photosRefs.current[index] = el)}
                            >
                                <img
                                    className={'image'}
                                    src={data.image}
                                    alt={data.title}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Projects2
