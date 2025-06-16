// components/SessionMediaControls.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { Headphones, Video, Download, Lock } from 'lucide-react';

const SessionMediaControls = ({ session, playingAudio, user, onPlayAudio }) => {
  return (
    <div className="d-flex flex-column gap-2">
      {/* Audio Controls */}
      {session.audio && session.audio.link && (
        <Button
          variant={session.audio.isFree ? "outline-success" : "outline-warning"}
          size="sm"
          className="d-flex align-items-center justify-content-center gap-2"
          onClick={() => onPlayAudio(session._id, session.audio.link)}
          disabled={!session.audio.isFree && !user}
        >
          <Headphones size={16} />
          {playingAudio === session._id ? 'Pause' : 'Audio'}
          {!session.audio.isFree && <Lock size={12} />}
        </Button>
      )}
      
      {/* Video Controls */}
      {session.video && session.video.link && (
        <Button
          variant={session.video.isFree ? "outline-info" : "outline-warning"}
          size="sm"
          className="d-flex align-items-center justify-content-center gap-2"
          disabled={!session.video.isFree && !user}
        >
          <Video size={16} />
          Video
          {!session.video.isFree && <Lock size={12} />}
        </Button>
      )}
      
      {/* Download Button */}
      {(session.audio?.link || session.video?.link) && (
        <Button
          variant="outline-secondary"
          size="sm"
          className="d-flex align-items-center justify-content-center gap-2"
        >
          <Download size={16} />
          Download
        </Button>
      )}
    </div>
  );
};

export default SessionMediaControls;