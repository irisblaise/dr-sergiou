import React, {useEffect} from 'react';
import './Home.scss';
// @ts-ignore
import carmen3 from './carmen3.png';
// @ts-ignore
import brainVisual from './assets/Brain-visuals.jpg'
// @ts-ignore
import brainVisual2 from './assets/Brain-visual-plaatje.jpg'
// @ts-ignore
import brainVisual4 from './assets/Brain-visual-home-banner.jpg'
// @ts-ignore
import brainVisual3 from './assets/Brain-visual-about-phd.jpg'
// @ts-ignore
import brainVisual5 from './assets/NeuroscienceNFT.png'
// @ts-ignore
import brainVisual6 from './assets/NeuroscienceNFt_BH1.jpeg'

import BrainAnimation from "../../Components/brainAnimation/brainAnimation";
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

function Home() {
        ScrollTrigger.defaults({
        markers: false
    });

    useEffect(()=> {
        const stage = document.querySelector('.stage');
        const slides = document.querySelectorAll(".slide");
    let slideID = 0;

    function initIntro() {
        // animate the intro elements into place
        let tl = gsap.timeline({delay: 1.2});

        tl.from('.intro__content', {
            x: 200,
            y: 400,
            ease: 'power4',
            duration: 3
        })
        // set up scrollTrigger animation for the when the intro scrolls out
        let stl = gsap.timeline({
            scrollTrigger: {
                trigger: '.intro',
                scrub: 1,
                start: "top bottom", // position of trigger meets the scroller position
                end: "bottom top"
            }
        });

        stl.to('.intro__title', {
            y: 250,
            autoRound: false,
            ease: 'power4.in',
            duration: 2,
            fontSize: 10,
            zIndex: 10,
        })
    }

    function initSlides() {
        // Animation of each slide scrolling into view
        slides.forEach((slide) => {

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    start: "40% 50%", // position of trigger meets the scroller position
                }
            });

            tl.from(slide.querySelectorAll('.col__content-title'), {
                ease: "power4",
                y: "+=5vh",
                duration: 2.5,
            })
                .from(slide.querySelectorAll('.line__inner'), {
                    y: 200,
                    duration: 2,
                    ease: "power4",
                    stagger: 0.1
                }, 0)
                .from(slide.querySelectorAll('.col__content-txt'), {
                    x: 100,
                    y: 50,
                    opacity: 0,
                    duration: 2,
                    ease: "power4"
                }, 0.4)
                .from(slide.querySelectorAll('.slide-link'), {
                    x: -100,
                    y: 100,
                    opacity: 0,
                    duration: 2,
                    ease: "power4"
                }, 0.3)
                .from(slide.querySelectorAll('.slide__scroll-link'), {
                    y: 200,
                    duration: 3,
                    ease: "power4"
                }, 0.4)
                .to(slide.querySelectorAll('.slide__scroll-line'), {
                    scaleY: 0.6,
                    transformOrigin: "bottom left",
                    duration: 2.5,
                    ease: "elastic(1,0.5)"
                }, 1.4)
        });
        // External footer link scroll animation
        gsap.from('.footer__link', {
            scrollTrigger: {
                trigger: '.footer',
                scrub: 4,
                start: "50% 100%", // position of trigger meets the scroller position
                end: "0% 0%",
            },
            y: "20vh",
            ease: 'sine'
        })
    }

    function initParallax() {
        slides.forEach((slide) => {
            let imageWrappers = slide.querySelectorAll('.col__image-wrap');

            gsap.fromTo(imageWrappers, {
                y: "-30vh"
            },{
                y: "30vh",
                scrollTrigger: {
                    trigger: slide,
                    scrub: true,
                    start: "top bottom", // position of trigger meets the scroller position
                    snap: {
                        snapTo: 0.5, // 0.5 'cause the scroll animation range is 200vh for parallax effect
                        duration: 1,
                        ease: 'power4.inOut'
                    }
                },
                ease: 'none'
            })
        });
    }

    function scrollTop() {
        gsap.to(window, {
            duration: 2,
            scrollTo: {
                y: "#slide-0"
            },
            ease: "power2.inOut"
        });
        gsap.to('.footer__link-top-line', {
            scaleY: 1,
            transformOrigin: "bottom center",
            duration: 0.6,
            ease: "power4"
        });
    }

    function initKeys() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            if(e.keyCode === 40) { //down arrow to next slide
                if(slideID <= slides.length) {
                    slideID++;
                    gsap.to(window, {
                        duration: 2,
                        scrollTo:{
                            y: "#slide-" + slideID
                        },
                        ease: "power2.inOut"
                    });
                }
            }
            else if(e.keyCode === 38) { // up arrow to top
                slideID = 0;
                scrollTop();
            }
        });
    }

    function init() {
        gsap.set(stage, { autoAlpha: 1 });
        initIntro();
        initSlides();
        initParallax();
        initKeys();
    }

    window.onload = () => {
        init();
    };
    }, [])


  return (
    <div className="home">
        <div id="smooth-wrapper">
        <div className="stage" id="smooth-content">
            <section className="intro slide--0" id="slide-0">
                <div className="intro__content">
                    <h1 className="intro__title">The never ending exploration fo the brain.</h1>
                </div>
                <div className="intro__img">
                    <BrainAnimation />
                </div>
            </section>

            <section className="slide slide--1" id="slide-1">
                <div className="col col--1">
                    <div className="col__content col__content--1">
                        <h2 className="col__content-title"><span className="line__inner">Hello there,</span></h2>
                        <div className="col__content-wrap">
                            <p className="col__content-txt">I am a mega brain enthusiast with a PhD in Forensic Neuroscience.
                                Currently I am working as a post-doctoral researcher in the Netherlands for the Max Planck Institute for Crime, Security and Law on the Virtual Burglary Project.
                                My passions for Neuroscience and the Forensic Field intersects in the emerging field of Forensic Neuropsychology.
                                In addition I am very interested and gaining knowledge in the field of using NFT’s as a funding opportunity for science and to contribute in making open science available for everybody. Therefore I started the Neuroscience NFT project together with talented 3D artist Sytske Nijp and Computer science hero Emanuel Boderash.
                                Furthermore my interests lay in contributing to the implementation of ketamine, MDMA and psilocybine in the Dutch mental health care. I believe that psychedelic treatment can be of great importance for future interventions when well implemented.
                                On this website you can find my previous work, my projects, the Neuroscience NFT project, further interests and above all: "My never ending enthusiasm for the Brain".

                                <br/><br/><span style={{fontWeight: 600}}>Enjoy getting to know me better, and have a look at my at my five main passions in life listed below!</span>
                            </p>
                            <a href="#" className="slide-link">
                                <div className="slide-link__circ"></div>
                                <div className="slide-link__line"></div>
                            </a>
                        </div>
                    </div>
                    <a href="#slide-2" className="slide__scroll-link">
                        <div className="slide__scroll-line"></div>
                    </a>
                </div>
                <div className="col col--2">
                    <div className="col__image-wrap">
                        <img className="img img--1" src={brainVisual}/>
                    </div>
                </div>
            </section>

            <section className="slide slide--2" id="slide-2">
                <div className="col col--1">
                    <div className="col__content col__content--2">
                        <h2 className="col__content-title"><span
                            className="line__inner number">No. 1</span><span className="line__inner">Forensic Science</span></h2>
                        <div className="col__content-wrap">
                            <p className="col__content-txt">Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod. Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod</p>
                            <a href="#" className="slide-link">
                                <div className="slide-link__circ"></div>
                                <div className="slide-link__line"></div>
                            </a>
                        </div>
                    </div>
                    <a href="#slide-3" className="slide__scroll-link">
                        <div className="slide__scroll-line"></div>
                    </a>
                </div>
                <div className="col col--2">
                    <div className="col__image-wrap">
                        <img className="img img--1" src={brainVisual6}/>
                    </div>
                </div>
            </section>

            <section className="slide slide--3" id="slide-3">
                <div className="col col--1">
                    <div className="col__content col__content--3">
                        <h2 className="col__content-title"><span
                            className="line__inner number">No. 2</span><span className="line__inner">Neuro</span></h2>
                        <div className="col__content-wrap">
                            <p className="col__content-txt">Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod.</p>
                            <a href="#" className="slide-link">
                                <div className="slide-link__circ"></div>
                                <div className="slide-link__line"></div>
                            </a>
                        </div>
                    </div>
                    <a href="#slide-4" className="slide__scroll-link">
                        <div className="slide__scroll-line"></div>
                    </a>
                </div>
                <div className="col col--2">
                    <div className="col__image-wrap">
                        <img className="img img--1" src={brainVisual4}/>
                    </div>
                </div>
            </section>

            <section className="slide slide--4" id="slide-4">
                <div className="col col--1">
                    <div className="col__content col__content--4">
                        <h2 className="col__content-title"><span
                            className="line__inner number">No. 3</span><span className="line__inner">Research</span></h2>
                        <div className="col__content-wrap">
                            <p className="col__content-txt">Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod.</p>
                            <a href="#" className="slide-link">
                                <div className="slide-link__circ"></div>
                                <div className="slide-link__line"></div>
                            </a>
                        </div>
                    </div>
                    <a href="#slide-5" className="slide__scroll-link">
                        <div className="slide__scroll-line"></div>
                    </a>
                </div>
                <div className="col col--2">
                    <div className="col__image-wrap">
                        <img className="img img--1" src={brainVisual3}/>
                    </div>
                </div>
            </section>

            <section className="slide slide--5" id="slide-5">
                <div className="col col--1">
                    <div className="col__content col__content--5">
                        <h2 className="col__content-title"><span
                            className="line__inner number">No. 4</span><span className="line__inner">NFT's</span></h2>
                        <div className="col__content-wrap">
                            <p className="col__content-txt">Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod.Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod.</p>
                            <a href="#" className="slide-link">
                                <div className="slide-link__circ"></div>
                                <div className="slide-link__line"></div>
                            </a>
                        </div>
                    </div>
                    <a href="#slide-6" className="slide__scroll-link">
                        <div className="slide__scroll-line"></div>
                    </a>
                </div>
                <div className="col col--2">
                    <div className="col__image-wrap">
                        <img className="img img--1" src={brainVisual5}/>
                    </div>
                </div>
            </section>

            <section className="slide slide--6" id="slide-6">
                <div className="col col--1">
                    <div className="col__content col__content--6">
                        <h2 className="col__content-title"><span
                            className="line__inner number">No. 5</span><span className="line__inner">Music</span></h2>
                        <div className="col__content-wrap">
                            <p className="col__content-txt">Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur et. Etiam porta sem malesuada magna mollis euismod.</p>
                            <a href="#" className="slide-link">
                                <div className="slide-link__circ"></div>
                                <div className="slide-link__line"></div>
                            </a>
                        </div>
                    </div>
                    <a href="#slide-7" className="slide__scroll-link">
                        <div className="slide__scroll-line"></div>
                    </a>
                </div>
                <div className="col col--2">
                    <div className="col__image-wrap">
                        <img className="img img--1" src={brainVisual2}/>
                    </div>
                </div>
            </section>


            <footer className="footer" id="slide-7">
                <img className="contact__photo" src={carmen3} alt="carmen"/>
                <a className="footer__link" href="http://www.duda.ie/" target="_blank">Dr. Carmen Silva Sergiou</a>
                <p>carmen@carmen.com</p>
                <a className="footer__link-top" href="#slide-0">Top<span className="footer__link-top-line"></span></a>
            </footer>
        </div>
    </div>
    </div>
  );
}

export default Home;
