import React, { useCallback, useEffect, useRef } from 'react'
import './Home.scss'
import BrainAnimation from '../../Components/brainAnimation/brainAnimation'
import brainVisual from '../../assets/images/brains/Brain-visuals.webp'
import brainVisual2 from '../../assets/images/brains/Brain-visual-plaatje.webp'
import brainVisual4 from '../../assets/images/brains/Brain-visual-home-banner.webp'
import brainVisual3 from '../../assets/images/brains/Brain-visual-about-phd.webp'
import brainVisual5 from '../../assets/images/brains/NeuroscienceNFT.webp'
import brainVisual6 from '../../assets/images/brains/NeuroscienceNFt_BH1.webp'
import brainVisual7 from '../../assets/images/brains/Brain9.webp'
import carmen3 from '../../assets/images/carmen3.webp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { isMobile } from 'react-device-detect'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

function Home() {
    const stageRef = useRef(null)
    const introContentRef = useRef(null)
    const introRef = useRef(null)
    const introTitleRef = useRef(null)
    const slideIdRef = useRef(0)
    const slidesRef = useRef<Array<HTMLElement>>([])

    const initIntro = useCallback(() => {
        // animate the intro elements into place
        let tl = gsap.timeline({ delay: 1.2 })

        tl.from(introContentRef.current, {
            x: 200,
            y: 400,
            ease: 'power4',
            duration: 3,
        })

        // set up scrollTrigger animation for when the intro scrolls out
        let stl = gsap.timeline({
            scrollTrigger: {
                trigger: introRef.current,
                scrub: 1,
                start: 'top bottom', // position of trigger meets the scroller position
                end: 'bottom top',
            },
        })

        stl.to(introTitleRef.current, {
            y: 250,
            autoRound: false,
            ease: 'power4.in',
            duration: 2,
            fontSize: 10,
            zIndex: 10,
        })
    }, [])

    const initSlides = useCallback(() => {
        // Animation of each slide scrolling into view
        slidesRef.current.forEach((slide) => {
            console.log(slide.querySelectorAll('.slide__scroll-line'))
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    start: isMobile ? '-10% 100%' : '30% 50%', // position of trigger meets the scroller position
                },
            })

            // Animate the title first
            tl.from(slide.querySelectorAll('.col__content-title .line__inner'), {
                y: 200,
                duration: 1.2, // shorter duration for faster title animation
                ease: 'power4',
                stagger: 0.08, // slightly faster stagger
            })
                // Animate the content text almost immediately after the title starts
                .from(
                    slide.querySelectorAll('.col__content-txt'),
                    {
                        x: 100,
                        y: '+=5vh',
                        opacity: 0,
                        ease: 'power4',
                        duration: 2,
                    },
                    '-=1.0' // start content text animation 1s before the title finishes
                )
                .from(
                    slide.querySelectorAll('.slide-link'),
                    {
                        x: -100,
                        y: 100,
                        opacity: 0,
                        duration: 2,
                        ease: 'power4',
                    },
                    0.3
                )
                .from(
                    slide.querySelectorAll('.slide__scroll-link'),
                    {
                        y: 200,
                        duration: 3,
                        ease: 'power4',
                    },
                    0.4
                )
                .to(
                    slide.querySelectorAll('.slide__scroll-line'),
                    {
                        scaleY: 0.6,
                        transformOrigin: 'bottom left',
                        duration: 2.5,
                        ease: 'elastic(1,0.5)',
                    },
                    1.4
                )
        })
        // External footer link scroll animation
        gsap.from('.footer__content', {
            scrollTrigger: {
                trigger: '.footer',
                scrub: 4,
                start: '50% 100%', // position of trigger meets the scroller position
                end: '0% 0%',
            },
            y: '20vh',
            ease: 'sine',
        })
    }, [])

    const initParallax = useCallback(() => {
        if (isMobile) return
        slidesRef.current.forEach((slide) => {
            let imageWrappers = slide.querySelectorAll('.col__image-wrap')

            gsap.fromTo(
                imageWrappers,
                {
                    y: '-30vh',
                },
                {
                    y: '30vh',
                    scrollTrigger: {
                        trigger: slide,
                        scrub: true,
                        start: 'top bottom', // position of trigger meets the scroller position
                    },
                    ease: 'none',
                }
            )
        })
    }, [])

    function scrollTop() {
        gsap.to(window, {
            duration: 2,
            scrollTo: {
                y: '#slide-0',
            },
            ease: 'power2.inOut',
        })
        gsap.to('.footer__link-top-line', {
            scaleY: 1,
            transformOrigin: 'bottom center',
            duration: 0.6,
            ease: 'power4',
        })
    }

    const initKeys = useCallback(() => {
        document.addEventListener('keydown', (event) => {
            event.preventDefault()
            if (event.keyCode === 40) {
                //down arrow to next slide
                if (slideIdRef.current <= slidesRef.current.length) {
                    slideIdRef.current++
                    gsap.to(window, {
                        duration: 2,
                        scrollTo: {
                            y: '#slide-' + slideIdRef.current,
                        },
                        ease: 'power2.inOut',
                    })
                }
            } else if (event.keyCode === 38) {
                // up arrow to top
                slideIdRef.current = 0
                scrollTop()
            }
        })
    }, [])

    useEffect(() => {
        const initAnimations = () => {
            slidesRef.current = gsap.utils.toArray('.slide')
            gsap.set(stageRef.current, { autoAlpha: 1 })
            initKeys()
            // initIntro()
            initSlides()
            initParallax()
        }

        const timeoutId = setTimeout(() => {
            initAnimations()
        }, 0)

        return () => clearTimeout(timeoutId)
    }, [initParallax, initKeys, initIntro, initSlides])

    return (
        <div className="page-body">
            <div className="home">
                <div id="smooth-wrapper">
                    <div ref={stageRef} className="stage" id="smooth-content">
                        <section
                            ref={introRef}
                            className="intro slide--0"
                            id="slide-0"
                        >
                            <div
                                ref={introContentRef}
                                className="intro__content"
                            >
                                <h1 className="intro__title">
                                    The Never Ending Exploration of the Brain.
                                </h1>
                            </div>
                            <div className="intro__img">
                                <BrainAnimation />
                            </div>
                        </section>

                        <section className="slide slide--1" id="slide-1">
                            <div className="col col--1">
                                <div className="col__content col__content--1">
                                    <h2 className="col__content-title">
                                        <span className="line__inner">
                                            Hello there,
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            I'm a mega brain enthusiast with a
                                            PhD in Forensic Neuroscience.
                                            Currently working as a post-doctoral
                                            researcher in using Virtual Reality
                                            (VR) into unraveling criminal
                                            decision making. Soon I will start
                                            my postdoc into unraveling the
                                            neural correlates of high risk
                                            antisocial youth using neuroimaging.
                                            Very excited to work in the field of
                                            using innovative technologies to
                                            investigate the brain in forensic
                                            care. My never ending exploration of
                                            the brain is a journey guided by
                                            <br />
                                            <br />
                                            My passion into the never ending
                                            exploration of the brain is a
                                            journey guided by five profound
                                            passions:
                                            <br />
                                            No.1. (Forensic) Neuroscience
                                            <br />
                                            No.2. Criminal Decision-making
                                            <br />
                                            No.3. Innovative Technologies
                                            <br />
                                            No.4. The Future of Decentralized
                                            Science
                                            <br />
                                            No.5. Psychedelics in Mental Health
                                            Care
                                            <br />
                                            No.6. Musical Synergy
                                            <br />
                                            <br />
                                            You're invited to delve into my
                                            world of neuronerding, past
                                            endeavors, research publications,
                                            and the exciting prospects on the
                                            horizon. It's a glimpse into the
                                            life of a true neuro-enthusiast,
                                            dedicated to unraveling the
                                            underpinnings of the brain and
                                            merging it with cutting-edge
                                            technology. Join me in this
                                            captivating journey, and together,
                                            let's embrace the world of a
                                            neuro-nerd. Your adventure starts
                                            here! 🧠🚀
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-2"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="slide slide--2" id="slide-2">
                            <div className="col col--1">
                                <div className="col__content col__content--2">
                                    <h2 className="col__content-title">
                                        <span className="line__inner number">
                                            No. 1
                                        </span>
                                        <span className="line__inner">
                                            (Forensic) Neuroscience
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            Oh the brain, what a majestic piece
                                            of art. It all started when I was
                                            very young and saw ‘One flew over
                                            the cuckoo’s nest’, to see the
                                            neurodiversity for the first time.
                                            Later on my fascination guided me
                                            towards the criminal brain. To
                                            examine how the neural correlates
                                            can shape decision-making into
                                            making criminal decisions. The
                                            crossroads of Neuroscience and the
                                            Forensic Field is were it all came
                                            together during my PhD. To unravel
                                            the neural underpinnings of
                                            aggression, emotion regulation and
                                            empathy are my main regions of
                                            fascination.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-3"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual6}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="slide slide--3" id="slide-3">
                            <div className="col col--1">
                                <div className="col__content col__content--3">
                                    <h2 className="col__content-title">
                                        <span className="line__inner number">
                                            No. 2
                                        </span>
                                        <span className="line__inner">
                                            Criminal Decision-making
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            Currently I am working as a
                                            post-doctoral researcher at the
                                            Virtual Burglary Project at the Max
                                            Planck Institute for Crime,
                                            Security, and Law (MPI) and Leiden
                                            University. Here we use Virtual
                                            Reality (VR) to study criminal
                                            decision-making in incarcerated
                                            burglars. Starting 2024 I will take
                                            on a new revenue with the Growing up
                                            Together in Society (GUTS) team into
                                            examining the neural correlates of
                                            high-risk antisocial youth using
                                            functional Magnetic Resonance
                                            Imaging (fMRI), cooperating with
                                            their families and the police teams
                                            to prevent these youngsters of
                                            developing a potential criminal
                                            career.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-4"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual4}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="slide slide--4" id="slide-4">
                            <div className="col col--1">
                                <div className="col__content col__content--4">
                                    <h2 className="col__content-title">
                                        <span className="line__inner number">
                                            No. 3
                                        </span>
                                        <span className="line__inner">
                                            Innovative Technologies
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            My fascination with innovative
                                            technologies that can improve
                                            therapy in forensic care is the
                                            common thread throughout my research
                                            trajectory. Technologies like
                                            virtual reality (VR),
                                            neuromodulation, functional Near
                                            Infrared RS, EEG, fMRI and the power
                                            of multi-modal approaches to combine
                                            the neuroscience tools with VR fuels
                                            my passion. Being able to study the
                                            brain responses in real-time in
                                            virtual environments is the future
                                            avenue to unraveling the neural
                                            underpinnings of behavior and I am
                                            so excited to work in this
                                            intersection, combing neuro and
                                            technology.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-5"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual3}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="slide slide--5" id="slide-5">
                            <div className="col col--1">
                                <div className="col__content col__content--5">
                                    <h2 className="col__content-title">
                                        <span className="line__inner number">
                                            No. 4
                                        </span>
                                        <span className="line__inner">
                                            The Future of Decentralized Science
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            I'm on a mission to contribute to
                                            revolutionize open science, to
                                            decentralize science (DeSci).
                                            Science should be available to
                                            everyone, regardless of an
                                            university affiliation. To this end,
                                            I've launched the Neuroscience NFT
                                            project, a collaboration with the
                                            talented 3D artist, Sytske Nijp, and
                                            computer science virtuoso, Emanuel
                                            Boderash. Together, we're merging
                                            the digital world with the realms of
                                            science. Using the brain scans of my
                                            own research studies, Sytske created
                                            3D art.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-6"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual5}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="slide slide--6" id="slide-6">
                            <div className="col col--1">
                                <div className="col__content col__content--6">
                                    <h2 className="col__content-title">
                                        <span className="line__inner number">
                                            No. 5
                                        </span>
                                        <span className="line__inner">
                                            Psychedelics in Mental Health Care
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            I believe in the potential of using
                                            psychedelics in treatment whit a big
                                            emphasis on a safe implementation in
                                            Dutch Mental Healthcare. When
                                            responsibly implemented, these
                                            treatments can be game-changers and
                                            can be keys to a better future. I
                                            co-created a report on using
                                            ketamine therapy in treatment
                                            resistent depression (TRD) to
                                            implement this in a safe and
                                            responsible way in the Netherlands,
                                            in collaboration with the Open
                                            Foundation, who is being doing great
                                            work into scientifically bringing
                                            this treatment form to a next level.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-7"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual2}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="slide slide--7" id="slide-7">
                            <div className="col col--1">
                                <div className="col__content col__content--7">
                                    <h2 className="col__content-title">
                                        <span className="line__inner number">
                                            No. 6
                                        </span>
                                        <span className="line__inner">
                                            Musical Synergy
                                        </span>
                                    </h2>
                                    <div className="col__content-wrap">
                                        <p className="col__content-txt">
                                            Next to all my scientific passions,
                                            I believe Music is a crucial factor
                                            in feeling happy , therefore I am
                                            supporting my favorite open-minded
                                            event organisation in Amsterdam:
                                            Kraft und Licht. Their musical sound
                                            is a mix between intellectual hybrid
                                            underground with a high energetic
                                            pace. The out of this world visual
                                            and light show are something you
                                            have to experience. They make a lot
                                            of their lamps themselves and have
                                            great 3D visuals that complements
                                            the music in a legendary way. They
                                            opened a creative hub called
                                            Krafthaus to support local talent
                                            and help with struggles in young
                                            adolescent minds. Keep an eye out on
                                            this organisation, cause they care
                                            for the future. Furthermore, I
                                            believe dancing is a very powerful
                                            tool to feel empowered and charged
                                            to continue the revenue of being a
                                            devoted researcher.
                                            <br />
                                            <br />
                                            <a href="https://www.kraftundlicht.nl/">
                                                kraftundlicht.nl
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="#slide-8"
                                    className="slide__scroll-link"
                                >
                                    <div className="slide__scroll-line"></div>
                                </a>
                            </div>
                            <div className="col col--2">
                                <div className="col__image-wrap">
                                    <img
                                        alt="brain visual"
                                        className="img img--1"
                                        src={brainVisual7}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="footer" id="slide-7">
                            <img
                                className="contact__photo"
                                src={carmen3}
                                alt="carmen"
                            />
                            <div className="footer__content">
                                <a
                                    className="footer__link"
                                    href="http://www.duda.ie/"
                                >
                                    Dr. Carmen-Silva Sergiou
                                </a>
                                <p>
                                    <a
                                        href="mailto:cs.sergiou@gmail.com"
                                        aria-label="Mail"
                                        target="_blank"
                                        rel="noreferrer"
                                        >
                                         cs.sergiou@gmail.com
                                    </a> 
                                    <br></br>
                                    <a
                                        href="mailto:neurosciencenft@gmail.com"
                                        aria-label="Mail"
                                        target="_blank"
                                        rel="noreferrer"
                                        >
                                        neurosciencenft@gmail.com
                                    </a> 
                                    <br></br>
                                    <a
                                        href="mailto:forneurotech.network@gmail.com"
                                        aria-label="Mail"
                                        target="_blank"
                                        rel="noreferrer"
                                        >
                                        forneurotech.network@gmail.com
                                    </a> 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
