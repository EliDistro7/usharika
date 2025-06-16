// components/LoadingSpinner.jsx
import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <Spinner animation="border" className="mb-3" style={{ color: '#6f42c1' }} />
        <p className="text-muted">{message}</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;