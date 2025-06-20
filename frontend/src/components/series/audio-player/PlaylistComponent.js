'use client';

import React from 'react';
import { Card, ListGroup, Image, Collapse } from 'react-bootstrap';

const PlaylistComponent = ({ 
  audioSessions, 
  currentIndex, 
  showPlaylist, 
  onSelectTrack,
  formatTime 
}) => {
  return (
    <Collapse in={showPlaylist}>
      <div>
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: '#6a0dad', color: '#fff' }}>
            <h5 className="mb-0 text-white">Playlist</h5>
          </Card.Header>
          <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {audioSessions.map((session, index) => (
              <ListGroup.Item
                key={session._id}
                action
                active={index === currentIndex}
                onClick={() => onSelectTrack(index)}
                style={{
                  backgroundColor: index === currentIndex ? '#ffd700' : '#333',
                  color: index === currentIndex ? '#1a1a1a' : '#ffd700',
                  border: 'none',
                }}
                className="d-flex align-items-center"
              >
                <Image
                  src={'/img/lutherRose.jpg'}
                  alt="Track Art"
                  roundedCircle
                  className="me-3"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div>
                  <strong>{session.title}</strong>
                  <br />
                  <small style={{ color: '#bfbfbf' }}>{formatTime(session.duration || 0)}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </div>
    </Collapse>
  );
};

export default PlaylistComponent;