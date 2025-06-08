import React from 'react';
import { Volume2 } from 'lucide-react';

const AudioPlayer = ({ isPlaying, isReceivingAudio, socketConnected, onTogglePlay }) => {
  return (
    <>
      {/* Speaker Indicator */}
      <div className="mb-4">
        <div className="position-relative">
          <div
            className="rounded-circle bg-purple d-flex align-items-center justify-content-center"
            style={{ width: '120px', height: '120px' }}
          >
            <Volume2 size={48} className="text-white" />
          </div>
          {isPlaying && isReceivingAudio && (
            <div className="position-absolute top-0 start-0 w-100 h-100">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="position-absolute border border-purple rounded-circle"
                  style={{
                    width: `${140 + (i * 20)}px`,
                    height: `${140 + (i * 20)}px`,
                    top: `${-10 - (i * 10)}px`,
                    left: `${-10 - (i * 10)}px`,
                    animation: `pulse 2s infinite ${i * 0.5}s`,
                    opacity: 0.3
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        {isPlaying ? (
          <div>
            <h5 className="mb-2 text-success">
              {isReceivingAudio ? 'Listening' : 'Waiting for broadcast...'}
            </h5>
            <p className="text-muted mb-0">
              {isReceivingAudio ? 'Live audio streaming' : 'No active broadcast'}
            </p>
          </div>
        ) : (
          <div>
            <h5 className="mb-2 text-muted">Ready to Listen</h5>
            <p className="text-muted mb-0">
              {socketConnected ? 'Click play to join the service' : 'Connecting to server...'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AudioPlayer;