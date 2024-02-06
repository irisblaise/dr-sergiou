import React from 'react'
import './footer.scss'

const Footer = () => {
    return (
        <footer className="footer-distributed">
            <div className="footer-left">
                <div className="footer-credits">
                    <p>
                        Pictures are designed by visual artist Sytske Nijp:{' '}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.instagram.com/lijpenijp/"
                        >
                            @lijpenijp
                        </a>{' '}
                        - All pictures are based upon the brainscans from the
                        studies of Dr. Sergiou
                    </p>
                </div>
                <p>Iris Blaise &copy; 2024</p>
            </div>
        </footer>
    )
}
export default Footer
