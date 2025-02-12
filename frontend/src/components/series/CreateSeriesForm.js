

// components/CreateSeriesForm.jsx
'use client';

import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';


const CreateSeriesForm = ({ newSeries, onChange, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit} className="mt-4">
      <Form.Group controlId="seriesName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter series name"
          value={newSeries.name}
          onChange={(e) => onChange({ ...newSeries, name: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group controlId="seriesDescription" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description"
          value={newSeries.description}
          onChange={(e) => onChange({ ...newSeries, description: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group controlId="seriesStartDate" className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={newSeries.startDate}
          onChange={(e) => onChange({ ...newSeries, startDate: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group controlId="seriesEndDate" className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={newSeries.endDate}
          onChange={(e) => onChange({ ...newSeries, endDate: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group controlId="seriesAuthor" className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter author name"
          value={newSeries.author}
          onChange={(e) => onChange({ ...newSeries, author: e.target.value })}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        <i className="fa fa-save"></i> Unda Series
      </Button>
    </Form>
  );
};

CreateSeriesForm.propTypes = {
  newSeries: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateSeriesForm;
