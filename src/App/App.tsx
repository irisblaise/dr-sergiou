import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar";
import Publications from "../Pages/Publications/Publications";
import Contact from "../Pages/Contact/Contact";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Projects from "../Pages/Projects/Projects";
import Media from "../Pages/Media/media";

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/projects' element={<Projects />} />
            <Route path='/media' element={<Media />} />
            <Route path='/publications' element={<Publications />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Router>
  );
}

export default App;
