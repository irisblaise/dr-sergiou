import React from 'react'
import VideoTextOverlay from '../../Components/videoTextOverlay/videoTextOverlay'
import VisualBrain3 from '../../assets/videos/VisualBrain3.mp4'
import './brainwaveBoulevard.scss'
import VR from '../../assets/images/icons/VR.png'
import CODING from '../../assets/images/icons/code.svg'
import BEHAVIOR from '../../assets/images/icons/brainheart.svg'
import FORENSIC from '../../assets/images/icons/forensic.svg'
import NEUROSCIENCE from '../../assets/images/icons/NEUROSCIENCE.png'
import MUSIC_NOTE from '../../assets/images/icons/music-note-3.png'

function BrainwaveBoulevard() {
    return (
        <div className="panel-wrapper">
            <div className="panel project-header">
                <VideoTextOverlay
                    video={VisualBrain3}
                    text="BRAINWAVE BOULEVARD"
                />
            </div>
            <div className="panel brainwave-boulevard">
                <div className="skills">
                    <div className="skill">
                        <h3>NEURO</h3>
                        <img src={NEUROSCIENCE} alt={'neuro'}></img>
                        <div className="skill-description">
                            EEG | fMRI | Networks | Neuromodolation
                        </div>
                    </div>
                    <div className="skill">
                        <h3>CODING</h3>
                        <img src={CODING} alt={'coding'}></img>
                        <div className="skill-description">
                            MatLab | EEGlab | Python (beginner)
                        </div>
                    </div>
                    <div className="skill">
                        <h3>VR</h3>
                        <img src={VR} alt={'vr'}></img>
                        <div className="skill-description">
                            Virtual Burglary | VR-RTA
                        </div>
                    </div>
                    <div className="skill">
                        <h3>FORENSIC</h3>
                        <img src={FORENSIC} alt={'forensic'}></img>
                        <div className="skill-description">
                            11 Prisons | 3 TBS | 5 Addiction Clinics
                        </div>
                    </div>
                    <div className="skill">
                        <h3>BEHAVIOR</h3>
                        <img src={BEHAVIOR} alt={'behavior'}></img>
                        <div className="skill-description">
                            Antisocial | Aggression | Addiction | Criminal
                            Decision-making | Emotion-Regulation | Empathy |
                            Psychopathy
                        </div>
                    </div>
                    <div className="skill">
                        <h3>MUSIC</h3>
                        <img
                            style={{ marginRight: '30px' }}
                            src={MUSIC_NOTE}
                            alt={'behavior'}
                        ></img>
                        <div className="skill-description">
                            VentroMedial | Kraft und Licht - Performance manager
                            Milkshake | Der Hintergarten | Manager Subduction
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrainwaveBoulevard
