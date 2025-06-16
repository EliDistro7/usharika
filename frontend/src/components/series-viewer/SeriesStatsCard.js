// components/SeriesStatsCard.jsx
import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const SeriesStatsCard = ({ series, completedSessions, totalSessions }) => {
  return (
    <Card className="shadow-sm border-0 mb-4">
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
  );
};

export default SeriesStatsCard;