

import React, { useEffect, useRef, useState } from 'react';
import './RotatingTree.css'; // Assuming styles are in ChristmasTree.css

const RotatingTree = () => {
  const mainRef = useRef(null);
  const [steps, setSteps] = useState('1234');
  const [rate, setRate] = useState(1);

  // Initialize tree parts and ornaments
  useEffect(() => {
    const parts = document.querySelectorAll('.tree');
    const ornaments = document.querySelectorAll('.ornament');
    document.documentElement.setAttribute('data-steps', steps);

    parts.forEach((part, i) => {
      part.style.setProperty('--i', i);
    });
    ornaments.forEach((ornament, i) => {
      ornament.style.setProperty('--i', i * 3.6 + 12); // Magic numbers as provided
    });
  }, [steps]);

  // Update playback rate
  useEffect(() => {
    const main = mainRef.current;
    if (main && main.getAnimations) {
      const animation = main.getAnimations()[0];
      if (animation) {
        if (animation.playState === 'paused') {
          animation.play();
        }
        animation.playbackRate = rate;
      }
    }
  }, [rate]);

  const handleStepChange = (e) => {
    setSteps(e.target.value);
    document.documentElement.setAttribute('data-steps', e.target.value);
  };

  const handleRateChange = (e) => {
    setRate(parseFloat(e.target.value));
  };

  return (
    <div className="container">
      <main ref={mainRef} style={{ '--length': 90 }}>
        {Array.from({ length: 90 }).map((_, i) => (
          <div className="tree" key={`tree-${i}`}></div>
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            className={`ornament ${i > 21 ? 'star' : ''}`}
            key={`ornament-${i}`}
          ></div>
        ))}
      </main>
      <form>
        <div>
          {[0, 12, 123, 1234, 12345].map((val, index) => (
            <React.Fragment key={val}>
              <input
                id={`step${index}`}
                type="radio"
                name="step"
                value={val}
                checked={steps === val.toString()}
                onChange={handleStepChange}
              />
              <label htmlFor={`step${index}`}>{index + 1}</label>
            </React.Fragment>
          ))}
        </div>
        <div>
          <label htmlFor="rate">Spin Rate</label>
          <input
            id="rate"
            type="range"
            min="0"
            max="2"
            step="0.025"
            value={rate}
            onChange={handleRateChange}
          />
        </div>
      </form>
    </div>
  );
};

export default RotatingTree;
