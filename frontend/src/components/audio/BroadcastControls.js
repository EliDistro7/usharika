import React from 'react';
import { Mic, MicOff } from 'lucide-react';

const BroadcastControls = ({
  isBroadcasting,
  isMuted,
  socketConnected,
  onToggleBroadcast,
  onToggleMute
}) => {
  return (
    <div className="d-flex gap-3">
      <button
        className={`btn btn-lg rounded-circle ${isBroadcasting ? 'btn-danger' : 'btn-purple'}`}
        style={{ width: '80px', height: '80px' }}
        onClick={onToggleBroadcast}
        disabled={!socketConnected}
      >
        {isBroadcasting ? 'Stop' : 'Start'}
      </button>
      
      <button
        className={`btn btn-lg rounded-circle ${isMuted ? 'btn-warning' : 'btn-outline-secondary'}`}
        style={{ width: '60px', height: '60px' }}
        onClick={onToggleMute}
        disabled={!isBroadcasting}
      >
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
    </div>
  );
};

export default BroadcastControls;