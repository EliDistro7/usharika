'use client';

import React from 'react';
import { Container, Row, Col, Badge, Button, ProgressBar } from 'react-bootstrap';
import { 
  Calendar, 
  Users, 
  Edit3, 
  Plus, 
  BookOpen,
  User,
  Crown
} from 'lucide-react';
import ShareButton from "@/components/ShareButton";

const SeriesHero = ({ 
  series, 
  user, 
  isCreator, 
  completedSessions, 
  totalSessions, 
  progressPercentage,
  onAddSession,
  onEditSeries,

}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate share URL and title if not provided
  const defaultShareUrl = `https://kkktyombo.org/series/${series._id}`;
  const defaultShareTitle = `${series.name} - ${series.author}`;

  // Define colors to match the ControlButtons approach
  const colors = {
    primary: '#6f42c1',
    surface: 'white',
    text: '#333',
    accent: '#b8860b',
    background: '#f8f9fa'
  };

  return (
    <>
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
                {/*  <span>by {series.author}</span> */}
                  {isCreator && <Crown size={16} className="ms-2 text-warning" />}
                </div>
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="me-2" />
                  <span>{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Users size={18} className="me-2" />
                 <span>400 total attendance</span> 
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
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 10
                }}
              >
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
                {/* Use the same approach as ControlButtons */}
                <ShareButton 
                  url={defaultShareUrl}
                  title={defaultShareTitle}
                  colors={colors}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        
        .hero-section > * {
          position: relative;
          z-index: 2;
        }
        
        .progress-bar {
          background: linear-gradient(90deg, #6f42c1, #b8860b);
        }
      `}</style>
    </>
  );
};

export default SeriesHero;