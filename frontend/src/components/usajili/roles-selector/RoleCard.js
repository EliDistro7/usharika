'use client';
import React, { useState } from "react";
import { Card, Form, Button, Badge } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { formatRoleName } from "@/actions/utils";

export default function RoleCard({ 
  role, 
  isLeadership = false, 
  isHidden = false, 
  isSelected = false,
  leadershipPositions = [],
  selectedLeadershipPositions = {},
  onRoleChange,
  onLeadershipPositionChange
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasPositions = leadershipPositions.length > 0;
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLeadershipChange = (position, isChecked) => {
    if (onLeadershipPositionChange) {
      onLeadershipPositionChange(role, position, isChecked);
    }
  };
  
  return (
    <Card 
      className={`mb-2 border-0 shadow-sm transition-all ${isSelected ? 'border-start border-success border-3' : ''} ${isHidden ? 'opacity-75' : ''}`} 
      style={{ 
        borderLeft: isSelected ? '4px solid #28a745' : '4px solid #e9ecef',
        transition: 'all 0.3s ease'
      }}
    >
      <Card.Body className="p-3">
        {/* Row 1: Main role info */}
        <div className="d-flex align-items-start">
          <Form.Check
            type="checkbox"
            id={role}
            checked={isSelected}
            onChange={() => onRoleChange && onRoleChange(role)}
            className="me-3 flex-shrink-0"
          />
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className={`fw-medium ${isSelected ? 'text-success' : ''}`}>
                {formatRoleName(role)}
              </span>
              {isLeadership && (
                <Badge bg="warning" text="dark" className="flex-shrink-0">
                  Uongozi
                </Badge>
              )}
              {isSelected && (
                <Badge bg="success" className="flex-shrink-0">
                  ✓ Imechaguliwa
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Row 2: Leadership positions button (if applicable) */}
        {isLeadership && hasPositions && isSelected && (
          <div className="mt-2 d-flex justify-content-end">
            <Button
              variant="outline-success"
              size="sm"
              onClick={toggleExpanded}
              className="border-0 d-flex align-items-center"
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              <span className="ms-1 d-none d-sm-inline">Nafasi ({leadershipPositions.length})</span>
              <span className="ms-1 d-sm-none">({leadershipPositions.length})</span>
            </Button>
          </div>
        )}
        
        {/* Leadership Positions */}
        {isLeadership && hasPositions && isSelected && isExpanded && (
          <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <small className="text-muted fw-medium">Chagua nafasi za uongozi:</small>
            <div className="mt-2">
              {leadershipPositions.map((position, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  id={`${role}-${position}`}
                  label={position}
                  checked={
                    selectedLeadershipPositions[role]?.includes(position) || false
                  }
                  onChange={(e) => handleLeadershipChange(position, e.target.checked)}
                  className="mb-1"
                />
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}