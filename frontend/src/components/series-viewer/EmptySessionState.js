// components/EmptySessionsState.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { BookOpen, Plus } from 'lucide-react';

const EmptySessionsState = ({ isCreator, onAddSession }) => {
  return (
    <div className="text-center py-5">
      <BookOpen size={48} className="text-muted mb-3" />
      <h5 className="text-muted">No sessions yet</h5>
      <p className="text-muted">Sessions will appear here as they are added.</p>
      {isCreator && (
        <Button
          variant="primary"
          onClick={onAddSession}
          className="mt-3"
        >
          <Plus size={16} className="me-2" />
          Add First Session
        </Button>
      )}
    </div>
  );
};

export default EmptySessionsState;