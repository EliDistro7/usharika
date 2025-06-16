// components/AddSessionModal.jsx
import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const AddSessionModal = ({ 
  show, 
  onHide, 
  newSession, 
  setNewSession, 
  onSubmit 
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Session</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Content/Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newSession.content}
              onChange={(e) => setNewSession({...newSession, content: e.target.value})}
              required
            />
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Audio Link</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://..."
                  value={newSession.audio.link}
                  onChange={(e) => setNewSession({
                    ...newSession, 
                    audio: {...newSession.audio, link: e.target.value}
                  })}
                />
                <Form.Check
                  type="checkbox"
                  label="Free Audio"
                  checked={newSession.audio.isFree}
                  onChange={(e) => setNewSession({
                    ...newSession,
                    audio: {...newSession.audio, isFree: e.target.checked}
                  })}
                  className="mt-2"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Video Link</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://..."
                  value={newSession.video.link}
                  onChange={(e) => setNewSession({
                    ...newSession,
                    video: {...newSession.video, link: e.target.value}
                  })}
                />
                <Form.Check
                  type="checkbox"
                  label="Free Video"
                  checked={newSession.video.isFree}
                  onChange={(e) => setNewSession({
                    ...newSession,
                    video: {...newSession.video, isFree: e.target.checked}
                  })}
                  className="mt-2"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Session
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddSessionModal;