import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop'
import Home from '../pages/Home/Home'
import Projects from '../pages/Projects/Projects'
import Impact from '../pages/Impact/Impact'
import Skills from '../pages/Skills/Skills'
import Publications from '../pages/Publications/Publications'
import Contact from '../pages/Contact/Contact'
import styles from './App.module.scss'

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className={styles.bgGlow} aria-hidden />
            <Navbar />
            <main className={styles.main}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/impact" element={<Impact />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/publications" element={<Publications />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    )
}
