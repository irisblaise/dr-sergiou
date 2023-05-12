import React, { useState} from 'react';
import {  Link } from "react-router-dom";
import './navbar.scss';

const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false)

    const changeBackground = () => {
        if(window.scrollY >= 80) {
            setIsSticky(true);
        } else {
            setIsSticky(false);
        }
    }

    window.addEventListener('scroll', changeBackground)

    return (
        <nav className="navbar">
            <div className="navbarWrapper">
                <div className="navbar--logo-holder">
                    {/*<img src={Logo} alt="logo" className="navbar--logo" />*/}
                    <h1>Dr. Sergiou</h1>
                    <p className={isSticky ? "" : "nav-text"}> The never ending exploration fo the brain.</p>
                </div>
                <ul className="navbar--link">
                    <li className="navbar--link-item">
                        <Link to="/"><p>Home</p></Link>
                    </li>
                    <li className="navbar--link-item">
                        <Link to="/about"><p>About</p></Link>
                    </li>
                    <li className="navbar--link-item">
                        <Link to="/projects"><p>Projects</p></Link>
                    </li>
                    <li className="navbar--link-item">
                        <Link to="/media"><p>Media</p></Link>
                    </li>
                    <li className="navbar--link-item">
                        <Link to="/publications"><p>Publications</p></Link>
                    </li>
                    <li className="navbar--link-item">
                        <Link to="/contact"><p>Contact</p></Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
export default Navbar;



