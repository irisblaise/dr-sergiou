import React from 'react'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import Logo from '../../logo.svg'
import './brainwaveBoulevard.scss'
import VR from '../../assets/images/icons/VR.png'
import CODING from '../../assets/images/icons/CODING.png'
import BEHAVIOR from '../../assets/images/icons/BEHAVIOR.png'
import FORENSIC from '../../assets/images/icons/FORENSIC.png'
import NEUROSCIENCE from '../../assets/images/icons/NEUROSCIENCE.png'

function BrainwaveBoulevard() {
    return (
        <div className="panel-wrapper">
            <div className="panel project-header">
                <VideoTextOverlay video={VisualBrain3} text="SKILLS" />
            </div>

            <div className="panel brainwave-boulevard">
                <div className="skills">
                    <div className="skill">
                        <h3>NEURO</h3>
                        <img src={NEUROSCIENCE}></img>
                        <div className="skill-description">
                            EEG | fMRI | Networks | Neuromodolation
                        </div>
                    </div>
                    <div className="skill">
                        <h3>CODING</h3>
                        <img src={CODING}></img>
                        <div className="skill-description">
                            MatLab | EEGlab | Python (beginner)
                        </div>
                    </div>
                    <div className="skill">
                        <h3>VR</h3>
                        <img src={VR}></img>
                        <div className="skill-description">
                            Virtual Burglary | VR-RTA
                        </div>
                    </div>
                    <div className="skill">
                        <h3>FORENSIC</h3>
                        <img src={FORENSIC}></img>
                        <div className="skill-description">
                            11 Prisons | 3 TBS | 5 Addiction Clinics
                        </div>
                    </div>
                    <div className="skill">
                        <h3>BEHAVIOR</h3>
                        <img src={BEHAVIOR}></img>
                        <div className="skill-description">
                            Antisocial | Aggression | Addiction | Criminal
                            Decision-making | Emotion-Regulation | Empathy |
                            Psychopathy
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrainwaveBoulevard
