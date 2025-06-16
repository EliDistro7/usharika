// components/SeriesHeroSection.jsx
import React from 'react';
import { Container, Row, Col, Badge, Button, ProgressBar } from 'react-bootstrap';
import { BookOpen, User, Calendar, Users, Crown, Plus, Edit3, Share2 } from 'lucide-react';



const SeriesHeroSection = ({ 
  series, 
  isCreator, 
  completedSessions, 
  totalSessions, 
  onAddSession, 
  onEditSeries 
}) => {
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const formatDate = (date) => {
    // Use consistent date formatting to prevent hydration issues
    const targetDate = new Date(date);
    return targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="hero-section py-5 mb-4"
      style={{
        background: 'linear-gradient(135deg, #6f42c1 0%, #495057 50%, #b8860b 100%)',
        color: 'white'
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={8}>
            <div className="d-flex align-items-center mb-3">
              <BookOpen size={32} className="me-3" />
              <div>
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="mb-2"
                  style={{ fontSize: '0.8rem' }}
                >
                  {series.group}
                </Badge>
                <h1 className="display-4 fw-bold mb-0 text-white">{series.name}</h1>
              </div>
            </div>
            
            <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
              <div className="d-flex align-items-center">
                <User size={18} className="me-2" />
                <span>by {series.author}</span>
                {isCreator && <Crown size={16} className="ms-2 text-warning" />}
              </div>
              <div className="d-flex align-items-center">
                <Calendar size={18} className="me-2" />
                <span>{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
              </div>
              <div className="d-flex align-items-center">
                <Users size={18} className="me-2" />
                <span>{series.totalAttendance} total attendance</span>
              </div>
            </div>
            
            <p className="lead mb-4">{series.description}</p>
            
            <div className="progress-section mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Progress</span>
                <span>{completedSessions}/{totalSessions} sessions completed</span>
              </div>
              <ProgressBar 
                now={progressPercentage} 
                style={{ height: '8px' }}
                className="bg-light"
              />
            </div>
          </Col>
          
          <Col lg={4} className="text-lg-end">
            <div className="d-flex flex-column gap-2">
              {isCreator && (
                <>
                  <Button
                    variant="light"
                    size="lg"
                    onClick={onAddSession}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <Plus size={20} />
                    Add Session
                  </Button>
                  <Button
                    variant="outline-light"
                    onClick={onEditSeries}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <Edit3 size={18} />
                    Edit Series
                  </Button>
                </>
              )}
              <Button
                variant="outline-light"
                className="d-flex align-items-center justify-content-center gap-2"
              >
                <Share2 size={18} />
                Share Series
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SeriesHeroSection;