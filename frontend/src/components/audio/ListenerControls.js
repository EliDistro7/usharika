import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const ListenerControls = ({
  isPlaying,
  isMuted,
  volume,
  socketConnected,
  onTogglePlay,
  onToggleMute,
  onVolumeChange
}) => {
  return (
    <>
      {/* Main Controls */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className={`btn btn-lg rounded-circle ${isPlaying ? 'btn-outline-purple' : 'btn-purple'}`}
          style={{ width: '80px', height: '80px' }}
          onClick={onTogglePlay}
          disabled={!socketConnected}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          className={`btn btn-lg rounded-circle ${isMuted ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
          style={{ width: '60px', height: '60px' }}
          onClick={onToggleMute}
          disabled={!socketConnected}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Volume Control */}
      <div className="mb-4">
        <label htmlFor="volumeSlider" className="form-label">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          id="volumeSlider"
          type="range"
          className="form-range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          disabled={!socketConnected || isMuted}
        />
      </div>

      {/* Connection Status */}
      <div className="d-flex align-items-center gap-2 text-sm">
        <div 
          className={`rounded-circle ${socketConnected ? 'bg-success' : 'bg-danger'}`}
          style={{ width: '8px', height: '8px' }}
        ></div>
        <span className={socketConnected ? 'text-success' : 'text-danger'}>
          {socketConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </>
  );
};

export default ListenerControls;