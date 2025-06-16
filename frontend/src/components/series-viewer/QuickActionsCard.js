// components/QuickActionsCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Share2, Download, BookOpen } from 'lucide-react';

const QuickActionsCard = ({ user }) => {
  return (
    <Card className="shadow-sm border-0">
      <Card.Header 
        className="bg-light border-0"
        style={{ borderBottom: '2px solid #6f42c1' }}
      >
        <h5 className="mb-0">Quick Actions</h5>
      </Card.Header>
      <Card.Body>
        <div className="d-grid gap-2">
          <Button variant="outline-primary" size="sm">
            <Share2 size={16} className="me-2" />
            Share Series
          </Button>
          <Button variant="outline-success" size="sm">
            <Download size={16} className="me-2" />
            Download All
          </Button>
          {user && (
            <Button variant="outline-info" size="sm">
              <BookOpen size={16} className="me-2" />
              Mark as Favorite
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuickActionsCard;
