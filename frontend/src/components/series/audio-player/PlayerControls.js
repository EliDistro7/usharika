'use client';

import React from 'react';
import { Button } from 'react-bootstrap';

const PlayerControls = ({
  isPlaying,
  currentIndex,
  totalTracks,
  onTogglePlayPause,
  onPrev,
  onNext,
  currentTime,
  duration,
  onProgressBarClick,
  formatTime,
  progressBarRef
}) => {
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Control buttons */}
      <div className="d-flex justify-content-center mb-3">
        <Button
          style={{ backgroundColor: '#6a0dad', color: '#fff', border: 'none' }}
          className="mx-2"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          <i className="fas fa-backward"></i>
        </Button>
        <Button
          style={{ backgroundColor: '#ffd700', color: '#1a1a1a', border: 'none' }}
          className="mx-2"
          onClick={onTogglePlayPause}
        >
          {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
        </Button>
        <Button
          style={{ backgroundColor: '#6a0dad', color: '#fff', border: 'none' }}
          className="mx-2"
          onClick={onNext}
          disabled={currentIndex >= totalTracks - 1}
        >
          <i className="fas fa-forward"></i>
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mt-3" ref={progressBarRef} onClick={onProgressBarClick} style={{ cursor: 'pointer' }}>
        <div className="progress" style={{ height: '5px', backgroundColor: '#333' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progressPercentage}%`, backgroundColor: '#ffd700' }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <span style={{ color: '#bfbfbf' }}>{formatTime(currentTime)}</span>
          <span style={{ color: '#bfbfbf' }}>{formatTime(duration)}</span>
        </div>
      </div>
    </>
  );
};

export default PlayerControls;