'use client';
import React, { useState } from "react";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import { FaUsers, FaMusic, FaBuilding, FaCog, FaEye, FaEyeSlash, FaFilter } from "react-icons/fa";
import { formatRoleName } from "@/actions/utils";
import CategorySection from "./CategorySection";

export default function RoleSelector({
  userRoles,
  formData,
  handleRoleChange,
  handleLeadershipPositionsChange,
}) {
  const [selectedLeadershipPositions, setSelectedLeadershipPositions] = useState({});
  
  // Toggle states for showing/hiding categories and roles
  const [showCategories, setShowCategories] = useState({
    jumuiya: false,
    kwaya: false,
    ofisi: false,
    others: false
  });
  
  const [showAllRoles, setShowAllRoles] = useState({
    jumuiya: false,
    kwaya: false,
    ofisi: false,
    others: false
  });

  // Group roles by category
  const groupRoles = () => {
    const roleNames = userRoles.map((roleObj) => roleObj.role);
    
    return {
      jumuiya: roleNames.filter(role => 
        role.startsWith("jumuiya") || role.startsWith("kiongozi_jumuiya")
      ),
      kwaya: roleNames.filter(role => 
        role.startsWith("kwaya") || role.startsWith("kiongozi_kwaya")
      ),
      ofisi: roleNames.filter(role => 
        role.startsWith("ofisi") || role.startsWith("kiongozi_ofisi")
      ),
      others: roleNames.filter(role => 
        !role.startsWith("jumuiya") && 
        !role.startsWith("kiongozi_jumuiya") &&
        !role.startsWith("kwaya") && 
        !role.startsWith("kiongozi_kwaya") &&
        !role.startsWith("ofisi") && 
        !role.startsWith("kiongozi_ofisi")
      )
    };
  };

  const roleGroups = groupRoles();

  const toggleCategoryVisibility = (category) => {
    setShowCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleShowAllRoles = (category) => {
    setShowAllRoles(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleLeadershipPositionChange = (role, position, isChecked) => {
    const updatedPositions = selectedLeadershipPositions[role] || [];
    let newPositions;
    
    if (isChecked) {
      newPositions = [...updatedPositions, position];
    } else {
      newPositions = updatedPositions.filter(p => p !== position);
    }
    
    const newSelectedLeadershipPositions = {
      ...selectedLeadershipPositions,
      [role]: newPositions,
    };
    
    setSelectedLeadershipPositions(newSelectedLeadershipPositions);
    
    if (typeof handleLeadershipPositionsChange === "function") {
      handleLeadershipPositionsChange(newSelectedLeadershipPositions);
    }
  };

  const getTotalSelected = () => {
    return formData.selectedRoles.length;
  };

  const getSelectedByCategory = () => {
    const selected = {
      jumuiya: formData.selectedRoles.filter(role => 
        role.startsWith("jumuiya") || role.startsWith("kiongozi_jumuiya")
      ).length,
      kwaya: formData.selectedRoles.filter(role => 
        role.startsWith("kwaya") || role.startsWith("kiongozi_kwaya")
      ).length,
      ofisi: formData.selectedRoles.filter(role => 
        role.startsWith("ofisi") || role.startsWith("kiongozi_ofisi")
      ).length,
      others: formData.selectedRoles.filter(role => 
        !role.startsWith("jumuiya") && !role.startsWith("kiongozi_jumuiya") &&
        !role.startsWith("kwaya") && !role.startsWith("kiongozi_kwaya") &&
        !role.startsWith("ofisi") && !role.startsWith("kiongozi_ofisi")
      ).length
    };
    return selected;
  };

  const selectedByCategory = getSelectedByCategory();

  return (
    <div className='px-0'>
      {/* Header with controls */}
      <div className="mb-4">
        {/* Row 1: Title and badge */}
        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
      
          <Badge bg="purple" className="flex-shrink-0" style={{ backgroundColor: '#6f42c1' }}>
            {getTotalSelected()} Imechaguliwa
          </Badge>
        </div>
        
        {/* Row 2: Control buttons */}
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowCategories({
              jumuiya: true, kwaya: true, ofisi: true, others: true
            })}
            className="flex-shrink-0"
          >
            <FaEye className="me-1" />
            <span className="d-none d-sm-inline">Onyesha Vyote</span>
            <span className="d-sm-none">Vyote</span>
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowCategories({
              jumuiya: false, kwaya: false, ofisi: false, others: false
            })}
            className="flex-shrink-0"
          >
            <FaEyeSlash className="me-1" />
            <span className="d-none d-sm-inline">Ficha Vyote</span>
            <span className="d-sm-none">Ficha</span>
          </Button>
        </div>
      </div>
      
      {/* Summary section */}
      <div className="mb-4 p-3 bg-light rounded">
        <div className="d-flex align-items-center mb-2">
          <FaFilter className="me-2" style={{ color: '#6f42c1' }} />
          <small className="fw-medium">Muhtasari wa chaguzi zako:</small>
        </div>
        <Row>
          <Col md={3}>
            <small className="text-muted">Jumuiya: </small>
            <Badge bg={selectedByCategory.jumuiya > 0 ? 'success' : 'secondary'}>
              {selectedByCategory.jumuiya}
            </Badge>
          </Col>
          <Col md={3}>
            <small className="text-muted">Kwaya: </small>
            <Badge bg={selectedByCategory.kwaya > 0 ? 'success' : 'secondary'}>
              {selectedByCategory.kwaya}
            </Badge>
          </Col>
          <Col md={3}>
            <small className="text-muted">Ofisi: </small>
            <Badge bg={selectedByCategory.ofisi > 0 ? 'success' : 'secondary'}>
              {selectedByCategory.ofisi}
            </Badge>
          </Col>
          <Col md={3}>
            <small className="text-muted">Nyingine: </small>
            <Badge bg={selectedByCategory.others > 0 ? 'success' : 'secondary'}>
              {selectedByCategory.others}
            </Badge>
          </Col>
        </Row>
      </div>

      {/* Category Sections */}
      <CategorySection
        title="Jumuiya"
        icon={<FaUsers />}
        roles={roleGroups.jumuiya}
        bgColor="#6f42c1"
        category="jumuiya"
        isVisible={showCategories.jumuiya}
        showAllRoles={showAllRoles.jumuiya}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      <CategorySection
        title="Kwaya"
        icon={<FaMusic />}
        roles={roleGroups.kwaya}
        bgColor="#8e44ad"
        category="kwaya"
        isVisible={showCategories.kwaya}
        showAllRoles={showAllRoles.kwaya}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      <CategorySection
        title="Ofisi"
        icon={<FaBuilding />}
        roles={roleGroups.ofisi}
        bgColor="#9b59b6"
        category="ofisi"
        isVisible={showCategories.ofisi}
        showAllRoles={showAllRoles.ofisi}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      <CategorySection
        title="Huduma Nyingine"
        icon={<FaCog />}
        roles={roleGroups.others}
        bgColor="#a569bd"
        category="others"
        isVisible={showCategories.others}
        showAllRoles={showAllRoles.others}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      {/* Selected Roles Summary */}
      {getTotalSelected() > 0 && (
        <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid #28a745' }}>
          <Card.Body className="p-3">
            <h6 className="text-success mb-2">
              Nafasi Zilizochaguliwa ({getTotalSelected()}):
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {formData.selectedRoles.map(role => (
                <Badge 
                  key={role} 
                  bg="success" 
                  className="px-2 py-1 d-flex align-items-center"
                  style={{ fontSize: '12px' }}
                >
                  {formatRoleName(role)}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-white p-0 ms-1 border-0"
                    onClick={() => handleRoleChange(role)}
                    style={{ fontSize: '10px', lineHeight: 1 }}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}