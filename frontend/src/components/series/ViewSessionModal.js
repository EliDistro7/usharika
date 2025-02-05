

// components/ViewSessionModal.jsx
'use client';

import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';


const ViewSessionModal = ({ show, handleClose, session }) => {
  if (!session) return null; // Render nothing if no session data is provided

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fa fa-file-text-o me-2"></i> Session Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Title:</strong> {session.title}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Content:</strong> {session.content}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Attendance:</strong> {session.attendanceCount}
          </ListGroup.Item>
          {session.audio && (
            <ListGroup.Item>
              <strong>Audio:</strong>
              <br />
              {session.audio.link ? (
                <>
                  <i className="fa fa-music me-2"></i>
                  <a href={session.audio.link} target="_blank" rel="noopener noreferrer">
                    Listen to Audio
                  </a>
                  <br />
                  <small>
                    {session.audio.isFree ? 'Free' : 'Paid'}{' '}
                    {session.audio.paidBy && `- Paid by ${session.audio.paidBy}`}
                  </small>
                </>
              ) : (
                <span>No audio available.</span>
              )}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="fa fa-times"></i> Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ViewSessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  session: PropTypes.object, // session object or null
};

export default ViewSessionModal;
