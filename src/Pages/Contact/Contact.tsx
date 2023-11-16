import React from 'react'
import './Contact.scss'
import carmen from '../../assets/images/camren2.jpeg'
import { FaTwitter } from 'react-icons/fa'
import { FaLinkedinIn } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'

function Contact() {
    return (
        <div className="contact">
            <div className="contact-wrapper">
                <img className="carmen" src={carmen} alt="carmen" />

                <div className="details">
                    <h1>Get in touch</h1>
                    <p>cs.sergiou@gmail.com | neurosciencenft@gmail.com</p>
                    <div className="social-buttons">
                        <a
                            href="mailto:cs.sergiou@gmail.com"
                            className="social-button social-button--mail"
                            aria-label="Mail"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <IoMail />
                        </a>
                        <a
                            href="https://twitter.com/SergiouCarmen"
                            className="social-button social-button--twitter"
                            aria-label="Twitter"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/carmensergiou"
                            className="social-button social-button--linkedin"
                            aria-label="LinkedIn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
