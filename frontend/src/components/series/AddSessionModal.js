

// components/AddSessionModal.jsx
'use client';

import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddSessionModal = ({ show, handleClose, onSubmit }) => {
  const [sessionData, setSessionData] = useState({
    date: '',
    title: '',
    content: '',
    author: '',
    audio: {
      link: '',
      isFree: true,
      paidBy: ''
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the field is part of the audio object, the name will start with "audio."
    if (name.startsWith('audio.')) {
      const audioField = name.split('.')[1];
      setSessionData((prev) => ({
        ...prev,
        audio: {
          ...prev.audio,
          [audioField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSessionData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass sessionData back to the parent component
    onSubmit(sessionData);
    // Reset form state
    setSessionData({
      date: '',
      title: '',
      content: '',
      author: '',
      audio: {
        link: '',
        isFree: true,
        paidBy: ''
      }
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="sessionDate" className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={sessionData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="sessionTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter session title"
              name="title"
              value={sessionData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="sessionContent" className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter session content"
              name="content"
              value={sessionData.content}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="sessionAuthor" className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter author name"
              name="author"
              value={sessionData.author}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <hr />

          <h5>Audio (Optional)</h5>
          <Form.Group controlId="audioLink" className="mb-3">
            <Form.Label>Audio Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter audio URL"
              name="audio.link"
              value={sessionData.audio.link}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="audioIsFree" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Is audio free?"
              name="audio.isFree"
              checked={sessionData.audio.isFree}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="audioPaidBy" className="mb-3">
            <Form.Label>Paid By (User ID)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user ID if paid"
              name="audio.paidBy"
              value={sessionData.audio.paidBy}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            <i className="fa fa-save"></i> Save Session
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddSessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddSessionModal;
