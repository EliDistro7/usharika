// components/SessionCard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Badge, Button, Dropdown } from 'react-bootstrap';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  MoreVertical, 
  Edit3, 
  Headphones, 
  Video, 
  Download, 
  Lock 
} from 'lucide-react';

const SessionCard = ({ 
  session, 
  index, 
  isCreator, 
  playingAudio, 
  user,
  onPlayAudio 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [sessionStatus, setSessionStatus] = useState('upcoming');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session.date) {
      // Format date only on client side to prevent hydration issues
      const sessionDate = new Date(session.date);
      const formatted = sessionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setFormattedDate(formatted);

      // Calculate session status only on client side
      const today = new Date();
      const sessionDateNormalized = new Date(session.date);
      
      // Normalize dates to avoid time zone issues
      today.setHours(0, 0, 0, 0);
      sessionDateNormalized.setHours(0, 0, 0, 0);
      
      let status = 'upcoming';
      if (sessionDateNormalized < today) {
        status = 'completed';
      } else if (sessionDateNormalized.getTime() === today.getTime()) {
        status = 'today';
      }
      
      setSessionStatus(status);
    }
  }, [isClient, session.date]);

  // Fallback values for server-side rendering
  const displayDate = isClient ? formattedDate : 'Loading date...';
  const status = isClient ? sessionStatus : 'upcoming';

  return (
    <div
      className={`p-4 border-bottom ${index === 0 ? '' : 'border-top-0'}`}
      style={{
        backgroundColor: status === 'today' ? '#f8f9ff' : 'white',
        borderLeft: status === 'completed' ? '4px solid #28a745' : 
                   status === 'today' ? '4px solid #6f42c1' : '4px solid #e9ecef'
      }}
    >
      <Row className="align-items-center">
        <Col md={8}>
          <div className="d-flex align-items-start justify-content-between">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <h5 className="mb-0 me-3">{session.title}</h5>
                {isClient && status === 'completed' && (
                  <CheckCircle size={18} className="text-success" />
                )}
                {isClient && status === 'today' && (
                  <Badge bg="primary" className="pulse">Today</Badge>
                )}
                {(!isClient || status === 'upcoming') && (
                  <Badge bg="secondary">Upcoming</Badge>
                )}
              </div>
              
              <div className="text-muted mb-2 d-flex align-items-center">
                <Clock size={16} className="me-2" />
                {displayDate}
              </div>
              
              <p className="text-muted mb-3">{session.content}</p>
              
              {session.attendanceCount > 0 && (
                <div className="d-flex align-items-center text-muted">
                  <Users size={16} className="me-2" />
                  <span>{session.attendanceCount} attended</span>
                </div>
              )}
            </div>
            
            {isCreator && (
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  className="text-muted p-1"
                  style={{ border: 'none', background: 'none' }}
                >
                  <MoreVertical size={16} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Edit3 size={14} className="me-2" />
                    Edit Session
                  </Dropdown.Item>
                  <Dropdown.Item className="text-danger">
                    Delete Session
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Col>
        
        <Col md={4}>
          <SessionMediaControls 
            session={session}
            playingAudio={playingAudio}
            user={user}
            onPlayAudio={onPlayAudio}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SessionCard;