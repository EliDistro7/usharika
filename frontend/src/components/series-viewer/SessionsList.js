// components/SessionsList.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Calendar, Plus, BookOpen } from 'lucide-react';
import SessionCard from './SessionCard';

const SessionsList = ({ 
  series, 
  isCreator, 
  playingAudio, 
  user, 
  onAddSession, 
  onPlayAudio 
}) => {
  const totalSessions = series?.sessions?.length || 0;

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header 
        className="bg-white border-0 py-3"
        style={{ borderBottom: '2px solid #6f42c1' }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0 d-flex align-items-center">
            <Calendar size={24} className="me-2" style={{ color: '#6f42c1' }} />
            Sessions ({totalSessions})
          </h4>
          {isCreator && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={onAddSession}
            >
              <Plus size={16} className="me-1" />
              Add Session
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {series.sessions && series.sessions.length > 0 ? (
          series.sessions
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((session, index) => (
              <SessionCard
                key={session._id}
                session={session}
                index={index}
                isCreator={isCreator}
                playingAudio={playingAudio}
                user={user}
                onPlayAudio={onPlayAudio}
              />
            ))
        ) : (
          <EmptySessionsState isCreator={isCreator} onAddSession={onAddSession} />
        )}
      </Card.Body>
    </Card>
  );
};

export default SessionsList;