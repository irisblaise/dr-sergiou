import React from 'react';
import './media.scss';
// @ts-ignore
import podcast from './podcast.png'
// @ts-ignore
import studioErasmus from './studioErasmus.png'
// @ts-ignore
import radio from './radio1.png'

function Media() {
  return (
      <>
        <div className="header">
          <header className="media-header">
          </header>
        <div className="media-list-container">
            <ul className="media-list">
                <li className='media-list-item'>
                    <h3>Radio</h3>
                    <img src={radio} alt="radio"/>
                    <p>Dr. Kelder & Co – Radio 1 Show – Modulating Aggression.</p>
                </li>

                <li>
                    <h3> Podcast</h3>
                    <img src={podcast} alt="podcast"/>
                   <p> Podcast- DPECS -Meeting the Future Society – PhD research</p>
                </li>
                <li>
                    <h3>Live Talkshow at Studio Erasmus</h3>
                    <img src={studioErasmus} alt="studio erasmus"/>
                    <p>Studio Erasmus 29-11-2023 - Live Talkshow Neuromodulation to Reduce Aggression</p>
                </li>
            </ul>
        </div>
        </div>
      </>
  );
}

export default Media;
