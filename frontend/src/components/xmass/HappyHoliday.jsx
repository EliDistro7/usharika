

import React, { useEffect } from 'react';
import AnimateBG from './AnimateBG'; // Adjust the path as needed
import './HappyHoliday.css'

const HappyHoliday = () => {
  useEffect(() => {
    const bgAnimation = new AnimateBG('canvasBG', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/131045/animatebg.js');
    bgAnimation.start();
  }, []);

  return (
    <div id="bgContainer">
      <canvas id="canvasBG" width="800" height="500"></canvas>
      <div id="main_body">
        <div className="page">
          <div className="content">
            <p>
              Happy Holidays!<br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HappyHoliday;
