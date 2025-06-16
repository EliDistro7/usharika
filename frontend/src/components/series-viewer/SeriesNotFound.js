// components/SeriesNotFound.jsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const SeriesNotFound = () => {
  const router = useRouter();

  return (
    <Container className="text-center py-5">
      <h3>Series not found</h3>
      <Button variant="primary" onClick={() => router.push('/series')}>
        Back to Series
      </Button>
    </Container>
  );
};

export default SeriesNotFound;