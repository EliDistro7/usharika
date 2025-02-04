import React from 'react';
import { Card, Button, Accordion, ListGroup, ProgressBar } from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaBook, FaChartLine } from 'react-icons/fa'; // Import icons
import './Series.css'; // Optional: For custom styles

const Series = () => {
  const seriesData = {
    name: 'Church Seminar 2024',
    description: 'A three-day seminar focused on spiritual growth and community building.',
    startDate: '2024-05-01',
    endDate: '2024-05-03',
    totalAttendance: 350,
    sessions: [
      {
        title: 'Day 1: Foundation of Faith',
        content: 'Discussion on the core principles of faith and how to strengthen them.',
        date: '2024-05-01',
        attendanceCount: 120,
      },
      {
        title: 'Day 2: Living the Word',
        content: 'Practical applications of biblical teachings in daily life.',
        date: '2024-05-02',
        attendanceCount: 110,
      },
      {
        title: 'Day 3: Spreading the Light',
        content: 'Techniques and inspiration for evangelism and community service.',
        date: '2024-05-03',
        attendanceCount: 120,
      },
    ],
  };

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-4 text-purple">{seriesData.name}</h1>
        <p className="lead text-muted">{seriesData.description}</p>
        <div className="d-flex justify-content-center align-items-center">
          <FaCalendarAlt className="me-2 text-purple" />
          <span className="text-muted">{seriesData.startDate} - {seriesData.endDate}</span>
        </div>
      </div>

      {/* Attendance Summary */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center">
            <FaUsers className="me-3 text-purple fs-2" />
            <div>
              <h5 className="mb-0">Total Attendance</h5>
              <p className="mb-0 fw-bold fs-3">{seriesData.totalAttendance}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Sessions Section */}
      <div className="row g-4">
        {seriesData.sessions.map((session, index) => (
          <div className="col-md-4" key={index}>
            <Card className="h-100 shadow-sm border-0 session-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaBook className="me-2 text-purple fs-4" />
                  <h5 className="mb-0 fw-bold">{session.title}</h5>
                </div>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex align-items-center border-0 p-0 mb-2">
                    <FaCalendarAlt className="me-2 text-purple" />
                    <strong>Date:</strong> {session.date}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center border-0 p-0 mb-2">
                    <FaBook className="me-2 text-purple" />
                    <strong>Content:</strong> {session.content}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center border-0 p-0">
                    <FaChartLine className="me-2 text-purple" />
                    <strong>Attendance:</strong> {session.attendanceCount}
                    <ProgressBar
                      now={(session.attendanceCount / seriesData.totalAttendance) * 100}
                      label={`${Math.round((session.attendanceCount / seriesData.totalAttendance) * 100)}%`}
                      className="ms-3 flex-grow-1"
                      variant="purple"
                    />
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* View Full Details Button */}
      <div className="text-center mt-5">
        <Button variant="purple" size="lg" className="px-5">
          View Full Details
        </Button>
      </div>
    </div>
  );
};

export default Series;