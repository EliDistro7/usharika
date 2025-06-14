'use client';

import React, { useMemo } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ViewSessionModal = ({ show, handleClose, session }) => {
  // Early return if no session data
  if (!session) return null;

  // Memoized formatted data
  const formattedData = useMemo(() => ({
    date: new Date(session.date).toLocaleDateString(),
    hasAudio: session.audio?.link,
    audioStatus: session.audio?.isFree ? 'Free' : 'Paid',
    paidBy: session.audio?.paidBy
  }), [session]);

  // Render functions for better organization
  const renderDetailItem = (label, value, icon = null) => (
    <ListGroup.Item key={label}>
      <strong>{icon && <i className={`fa ${icon} me-2`}></i>}{label}:</strong> {value}
    </ListGroup.Item>
  );

  const renderAudioItem = () => {
    if (!session.audio) return null;

    return (
      <ListGroup.Item key="audio">
        <strong><i className="fa fa-music me-2"></i>Audio:</strong>
        <br />
        {formattedData.hasAudio ? (
          <div className="mt-2">
            <a 
              href={session.audio.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="d-inline-flex align-items-center"
            >
              <i className="fa fa-play me-2"></i>
              Listen to Audio
            </a>
            <br />
            <small className="text-muted mt-1">
              {formattedData.audioStatus}
              {formattedData.paidBy && ` - Paid by ${formattedData.paidBy}`}
            </small>
          </div>
        ) : (
          <span className="text-muted">No audio available</span>
        )}
      </ListGroup.Item>
    );
  };

  const sessionDetails = [
    { label: 'Date', value: formattedData.date, icon: 'fa-calendar' },
    { label: 'Title', value: session.title, icon: 'fa-bookmark' },
    { label: 'Content', value: session.content, icon: 'fa-file-text' },
    { label: 'Attendance', value: session.attendanceCount, icon: 'fa-users' }
  ];

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fa fa-eye me-2"></i>
          Session Details
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <ListGroup variant="flush">
          {sessionDetails.map(({ label, value, icon }) => 
            renderDetailItem(label, value, icon)
          )}
          {renderAudioItem()}
        </ListGroup>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="fa fa-times me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ViewSessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  session: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    attendanceCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    audio: PropTypes.shape({
      link: PropTypes.string,
      isFree: PropTypes.bool,
      paidBy: PropTypes.string
    })
  })
};

export default ViewSessionModal;