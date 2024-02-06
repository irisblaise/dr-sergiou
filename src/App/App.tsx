import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '../Components/Navbar/navbar'
import Publications from '../Pages/Publications/Publications'
import Contact from '../Pages/Contact/Contact'
import Home from '../Pages/Home/Home'
import Media from '../Pages/Media/media'
import Projects from '../Pages/Projects/Projects'
import Footer from '../Components/Footer/footer'
import BrainwaveBoulevard from '../Pages/BrainwaveBoulevard/BrainwaveBoulevard'

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route>
                    <Route path="/" element={<Home />} />
                    {/*<Route path="/about" element={<About />} />*/}
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/publications" element={<Publications />} />
                    <Route
                        path="/brainwave-boulevard"
                        element={<BrainwaveBoulevard />}
                    />
                    <Route path="/contact" element={<Contact />} />
                </Route>
            </Routes>
            <Footer />
        </Router>
    )
}

export default App
