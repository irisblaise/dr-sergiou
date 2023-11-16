import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './navbar.scss'
import { isMobile } from 'react-device-detect'

const Navbar = () => {
    const [click, setClick] = React.useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleClick = () => {
        setClick(!click)
        if (isMobile) setIsMenuOpen(false)
    }
    const Close = () => {
        setClick(false)
    }

    useEffect(() => {
        const body = document.querySelector('body')
        if (body) {
            body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
        }
    }, [isMenuOpen])

    return (
        <div>
            <div
                className={click ? 'main-container' : ''}
                onClick={() => Close()}
            />
            <nav className={`navbar`} onClick={(e) => e.stopPropagation()}>
                <div className="nav-container">
                    <NavLink to="/" className="nav-logo">
                        <h1>Dr. Sergiou</h1>
                    </NavLink>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className="nav-links"
                                onClick={() => handleClick()}
                            >
                                <h3>Home</h3>
                            </NavLink>
                        </li>
                        {/*<li className="nav-item">*/}
                        {/*    <NavLink*/}
                        {/*        to="/projects"*/}
                        {/*        className="nav-links"*/}
                        {/*        onClick={() => handleClick()}*/}
                        {/*    >*/}
                        {/*        <h3>Projects</h3>*/}
                        {/*    </NavLink>*/}
                        {/*</li>*/}
                        <li className="nav-item">
                            <NavLink
                                to="/media"
                                className="nav-links"
                                onClick={() => handleClick()}
                            >
                                <h3>Media</h3>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/publications"
                                className="nav-links"
                                onClick={() => handleClick()}
                            >
                                <h3>Publications</h3>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/contact"
                                className="nav-links"
                                onClick={() => handleClick()}
                            >
                                <h3>Contact</h3>
                            </NavLink>
                        </li>
                    </ul>

                    <div
                        className={
                            click ? 'menu hamburger open' : 'menu hamburger'
                        }
                        onClick={() => {
                            handleClick()
                            setIsMenuOpen(!isMenuOpen)
                        }}
                    >
                        <div className="icon"></div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default Navbar
