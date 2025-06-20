'use client';
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaChevronDown, FaChevronUp, FaEye, FaEyeSlash } from "react-icons/fa";
import RoleCard from "./RoleCard";

export default function CategorySection({ 
  title, 
  icon, 
  roles, 
  bgColor, 
  category,
  isVisible,
  showAllRoles,
  selectedRoles,
  userRoles,
  selectedLeadershipPositions,
  onToggleCategoryVisibility,
  onToggleShowAllRoles,
  onRoleChange,
  onLeadershipPositionChange
}) {
  
  const isLeadershipRole = (role) => {
    return role.startsWith("kiongozi_");
  };

  const isRoleSelected = (role) => {
    return selectedRoles.includes(role);
  };

  const getLeadershipPositions = (role) => {
    const roleObj = userRoles.find(r => r.role === role);
    return roleObj?.defaultPositions || [];
  };

  // Filter roles based on selection and show/hide preferences
  const getFilteredRoles = (roles, category) => {
    const selectedRolesList = roles.filter(role => isRoleSelected(role));
    const unselectedRoles = roles.filter(role => !isRoleSelected(role));
    
    if (showAllRoles) {
      return [...selectedRolesList, ...unselectedRoles];
    } else {
      // Show selected roles + limit unselected roles (show first 3, hide rest)
      const limitedUnselected = unselectedRoles.slice(0, 3);
      return [...selectedRolesList, ...limitedUnselected];
    }
  };

  const plainRoles = roles.filter(role => !isLeadershipRole(role));
  const leadershipRoles = roles.filter(role => isLeadershipRole(role));
  const allRoles = [...plainRoles, ...leadershipRoles];
  
  const filteredRoles = getFilteredRoles(allRoles, category);
  const hiddenRolesCount = allRoles.length - filteredRoles.length;
  const selectedCount = allRoles.filter(role => isRoleSelected(role)).length;
  
  return (
    <Card className="mb-4 border-0 shadow">
      <Card.Header 
        className="text-white border-0 d-flex align-items-center cursor-pointer"
        style={{ backgroundColor: bgColor }}
        onClick={() => onToggleCategoryVisibility && onToggleCategoryVisibility(category)}
      >
        <div className="d-flex align-items-center flex-grow-1">
          {icon}
          <span className="ms-2 fw-bold">{title}</span>
          <Badge bg="light" text="dark" className="ms-2">
            {selectedCount > 0 ? `${selectedCount}/${allRoles.length}` : allRoles.length}
          </Badge>
          {selectedCount > 0 && (
            <Badge bg="success" className="ms-2">
              ✓ Imechagua
            </Badge>
          )}
        </div>
        <Button variant="link" className="text-white p-0 border-0">
          {isVisible ? <FaChevronUp /> : <FaChevronDown />}
        </Button>
      </Card.Header>
      
      {isVisible && (
        <Card.Body className="p-3">
          {allRoles.length === 0 ? (
            <p className="text-muted mb-0">Hakuna nafasi zinazopatikana</p>
          ) : (
            <>
              {/* Show filtered roles */}
              {filteredRoles.map(role => (
                <RoleCard 
                  key={role} 
                  role={role} 
                  isLeadership={isLeadershipRole(role)}
                  isSelected={isRoleSelected(role)}
                  leadershipPositions={getLeadershipPositions(role)}
                  selectedLeadershipPositions={selectedLeadershipPositions}
                  onRoleChange={onRoleChange}
                  onLeadershipPositionChange={onLeadershipPositionChange}
                />
              ))}
              
              {/* Show/Hide toggle for remaining roles */}
              {hiddenRolesCount > 0 && (
                <div className="text-center mt-3">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onToggleShowAllRoles && onToggleShowAllRoles(category)}
                    className="border-0"
                  >
                    {showAllRoles ? (
                      <>
                        <FaEyeSlash /> Ficha nafasi {hiddenRolesCount} zaidi
                      </>
                    ) : (
                      <>
                        <FaEye /> Onyesha nafasi {hiddenRolesCount} zaidi
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Quick actions for category */}
              {selectedCount === 0 && allRoles.length > 0 && (
                <div className="mt-3 p-2 bg-light rounded">
                  <small className="text-muted">
                    💡 <strong>Kidokezo:</strong> Chagua nafasi unazotaka ili kuona maelezo zaidi
                  </small>
                </div>
              )}
            </>
          )}
        </Card.Body>
      )}
    </Card>
  );
}