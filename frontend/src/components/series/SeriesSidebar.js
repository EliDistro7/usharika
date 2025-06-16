'use client';

import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { 
  Share2,
  Download,
  BookOpen
} from 'lucide-react';

const SeriesSidebar = ({ 
  series, 
  user, 
  totalSessions, 
  completedSessions 
}) => {
  return (
    <>
   {/*   <Card className="shadow-sm border-0 mb-4">
        <Card.Header 
          className="bg-light border-0"
          style={{ borderBottom: '2px solid #b8860b' }}
        >
          <h5 className="mb-0">Series Stats</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Total Sessions</span>
            <Badge bg="primary" pill>{totalSessions}</Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Completed</span>
            <Badge bg="success" pill>{completedSessions}</Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Remaining</span>
            <Badge bg="secondary" pill>{totalSessions - completedSessions}</Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span>Total Attendance</span>
            <Badge bg="info" pill>{series.totalAttendance}</Badge>
          </div>
        </Card.Body>
      </Card>
      */}
      
      {/* Quick Actions */}
      <Card className="shadow-sm border-0">
        <Card.Header 
          className="bg-light border-0"
          style={{ borderBottom: '2px solid #6f42c1' }}
        >
          <h5 className="mb-0">Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" size="sm">
              <Share2 size={16} className="me-2" />
              Share Series
            </Button>
            <Button variant="outline-success" size="sm">
              <Download size={16} className="me-2" />
              Download All
            </Button>
            {user && (
              <Button variant="outline-info" size="sm">
                <BookOpen size={16} className="me-2" />
                Mark as Favorite
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default SeriesSidebar;