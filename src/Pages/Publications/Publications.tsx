import React from 'react';
import './Publications.css';
import VerticalAccordion from "../../Components/verticalAccordion/verticalAccordion";

function Publications() {
    return (
    <div className="Public">
        <div className="container">
            <header className="publication-header">
                <h1>Publicated research</h1>
            </header>
            <VerticalAccordion />
        </div>
    </div>
  );
}

export default Publications;
