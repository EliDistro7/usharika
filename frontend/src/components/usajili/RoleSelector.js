'use client';
import React, { useState } from "react";
import { Card, Form, Button, Badge, Row, Col } from "react-bootstrap";
import { FaUsers, FaMusic, FaBuilding, FaCog, FaChevronDown, FaChevronUp, FaEye, FaEyeSlash, FaFilter } from "react-icons/fa";
import { formatRoleName } from "@/actions/utils";

export default function RoleSelector({
  userRoles,
  formData,
  handleRoleChange,
  handleLeadershipPositionsChange,
}) {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedLeadershipPositions, setSelectedLeadershipPositions] = useState({});
  
  // Toggle states for showing/hiding categories and roles
  const [showCategories, setShowCategories] = useState({
    jumuiya: true,
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const getLeadershipPositions = (role) => {
    const roleObj = userRoles.find(r => r.role === role);
    return roleObj?.defaultPositions || [];
  };

  const isLeadershipRole = (role) => {
    return role.startsWith("kiongozi_");
  };

  const isRoleSelected = (role) => {
    return formData.selectedRoles.includes(role);
  };

  // Filter roles based on selection and show/hide preferences
  const getFilteredRoles = (roles, category) => {
    const selectedRoles = roles.filter(role => isRoleSelected(role));
    const unselectedRoles = roles.filter(role => !isRoleSelected(role));
    
    if (showAllRoles[category]) {
      return [...selectedRoles, ...unselectedRoles];
    } else {
      // Show selected roles + limit unselected roles (show first 3, hide rest)
      const limitedUnselected = unselectedRoles.slice(0, 3);
      return [...selectedRoles, ...limitedUnselected];
    }
  };

  const RoleCard = ({ role, isLeadership = false, isHidden = false }) => {
    const leadershipPositions = isLeadership ? getLeadershipPositions(role) : [];
    const hasPositions = leadershipPositions.length > 0;
    const isExpanded = expandedSections[role];
    const selected = isRoleSelected(role);
    
    return (
      <Card 
        className={`mb-2 border-0 shadow-sm transition-all ${selected ? 'border-start border-success border-3' : ''} ${isHidden ? 'opacity-75' : ''}`} 
        style={{ 
          borderLeft: selected ? '4px solid #28a745' : '4px solid #e9ecef',
          transition: 'all 0.3s ease'
        }}
      >
        <Card.Body className="p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                id={role}
                checked={selected}
                onChange={() => handleRoleChange(role)}
                className="me-3"
              />
              <div>
                <span className={`fw-medium ${selected ? 'text-success' : ''}`}>
                  {formatRoleName(role)}
                </span>
                {isLeadership && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    Uongozi
                  </Badge>
                )}
                {selected && (
                  <Badge bg="success" className="ms-2">
                    ✓ Imechaguliwa
                  </Badge>
                )}
              </div>
            </div>
            
            {isLeadership && hasPositions && selected && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => toggleSection(role)}
                className="border-0"
              >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                <span className="ms-1">Nafasi ({leadershipPositions.length})</span>
              </Button>
            )}
          </div>
          
          {/* Leadership Positions */}
          {isLeadership && hasPositions && selected && isExpanded && (
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
                    onChange={(e) =>
                      handleLeadershipPositionChange(role, position, e.target.checked)
                    }
                    className="mb-1"
                  />
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const CategorySection = ({ title, icon, roles, bgColor, category }) => {
    const plainRoles = roles.filter(role => !isLeadershipRole(role));
    const leadershipRoles = roles.filter(role => isLeadershipRole(role));
    const allRoles = [...plainRoles, ...leadershipRoles];
    
    const filteredRoles = getFilteredRoles(allRoles, category);
    const hiddenRolesCount = allRoles.length - filteredRoles.length;
    const selectedCount = allRoles.filter(role => isRoleSelected(role)).length;
    const isVisible = showCategories[category];
    
    return (
      <Card className="mb-4 border-0 shadow">
        <Card.Header 
          className="text-white border-0 d-flex align-items-center cursor-pointer"
          style={{ backgroundColor: bgColor }}
          onClick={() => toggleCategoryVisibility(category)}
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
                  />
                ))}
                
                {/* Show/Hide toggle for remaining roles */}
                {hiddenRolesCount > 0 && (
                  <div className="text-center mt-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => toggleShowAllRoles(category)}
                      className="border-0"
                    >
                      {showAllRoles[category] ? (
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
    <div>
      {/* Header with controls */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <h4 className="mb-0" style={{ color: '#6f42c1' }}>Chagua Vikundi na Nafasi</h4>
          <Badge bg="purple" className="ms-2" style={{ backgroundColor: '#6f42c1' }}>
            {getTotalSelected()} Imechaguliwa
          </Badge>
        </div>
        
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowCategories({
              jumuiya: true, kwaya: true, ofisi: true, others: true
            })}
          >
            <FaEye /> Onyesha Vyote
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowCategories({
              jumuiya: false, kwaya: false, ofisi: false, others: false
            })}
          >
            <FaEyeSlash /> Ficha Vyote
          </Button>
        </div>
      </div>
      
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

      <CategorySection
        title="Jumuiya"
        icon={<FaUsers />}
        roles={roleGroups.jumuiya}
        bgColor="#6f42c1"
        category="jumuiya"
      />
      
      <CategorySection
        title="Kwaya"
        icon={<FaMusic />}
        roles={roleGroups.kwaya}
        bgColor="#8e44ad"
        category="kwaya"
      />
      
      <CategorySection
        title="Ofisi"
        icon={<FaBuilding />}
        roles={roleGroups.ofisi}
        bgColor="#9b59b6"
        category="ofisi"
      />
      
      <CategorySection
        title="Huduma Nyingine"
        icon={<FaCog />}
        roles={roleGroups.others}
        bgColor="#a569bd"
        category="others"
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