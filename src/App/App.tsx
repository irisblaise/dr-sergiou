import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '../Components/Navbar/navbar'
import Publications from '../Pages/Publications/Publications'
import Contact from '../Pages/Contact/Contact'
import Home from '../Pages/Home/Home'
import Impact from '../Pages/Impact/impact'
import Footer from '../Components/Footer/footer'
import BrainwaveBoulevard from '../Pages/BrainwaveBoulevard/BrainwaveBoulevard'
import Projects2 from '../Pages/Projects/Projects2'

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects2 />} />
                    <Route path="/impact" element={<Impact />} />
                    <Route path="/publications" element={<Publications />} />
                    <Route path="/skills" element={<BrainwaveBoulevard />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>
            </Routes>
            <Footer />
        </Router>
    )
}

export default App
