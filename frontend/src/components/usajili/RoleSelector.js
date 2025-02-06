'use client';
import React, { useState } from "react";
import { Tabs, Tab, Row, Col, Form, Button } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { formatRoleName } from "@/actions/utils";

export default function RoleSelector({
  userRoles,
  formData,
  handleRoleChange,
  handleLeadershipPositionsChange, // new callback prop from parent
}) {
  // Extract role names from the userRoles array
  const roleNames = userRoles.map((roleObj) => roleObj.role);

  // Split into three groups:
  // Group 1: Roles that start with "jumuiya" or "kiongozi_jumuiya"
  const jumuiyaGroup = roleNames.filter(
    (role) => role.startsWith("jumuiya") || role.startsWith("kiongozi_jumuiya")
  );
  // Group 2: Roles that start with "kwaya" or "kiongozi_kwaya"
  const kwayaGroup = roleNames.filter(
    (role) => role.startsWith("kwaya") || role.startsWith("kiongozi_kwaya")
  );
  // Group 3: All other roles
  const otherGroup = roleNames.filter(
    (role) =>
      !role.startsWith("jumuiya") &&
      !role.startsWith("kiongozi_jumuiya") &&
      !role.startsWith("kwaya") &&
      !role.startsWith("kiongozi_kwaya")
  );

  // Local state to track leadership positions selections per role
  const [selectedLeadershipPositions, setSelectedLeadershipPositions] = useState({});
  // Local state to toggle the leadership UI (the extra positions) for each leadership role
  const [toggleLeadershipUI, setToggleLeadershipUI] = useState({});

  // Toggle the leadership section (show/hide the extra positions UI) for a specific leadership role
  const toggleLeadershipSection = (role) => {
    setToggleLeadershipUI((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  // Handle changes in leadership position checkboxes
  const handleLeadershipPositionChange = (role, position, isChecked) => {
    const updatedPositions = selectedLeadershipPositions[role]
      ? [...selectedLeadershipPositions[role]]
      : [];
    if (isChecked) {
      updatedPositions.push(position);
    } else {
      const index = updatedPositions.indexOf(position);
      if (index > -1) {
        updatedPositions.splice(index, 1);
      }
    }
    const newSelectedLeadershipPositions = {
      ...selectedLeadershipPositions,
      [role]: updatedPositions,
    };
    setSelectedLeadershipPositions(newSelectedLeadershipPositions);
    // Send updated leadership positions back to the parent via the callback
    if (typeof handleLeadershipPositionsChange === "function") {
      handleLeadershipPositionsChange(newSelectedLeadershipPositions);
    }
  };

  // Render rows for a given group of roles
  const renderRoleRows = (groupRoles) => {
    // Plain roles: those that do NOT start with "kiongozi_"
    const plainRoles = groupRoles.filter((role) => !role.startsWith("kiongozi_"));

    return plainRoles.map((plainRole) => {
      // For a plain role like "kwaya_ya_umoja", try to find the corresponding leadership role.
      // For example, find a role that starts with "kiongozi_" and includes the suffix "ya_umoja".
      const plainRoleSuffix = plainRole.split("_").slice(1).join("_");
      const correspondingKiongozi = groupRoles.find(
        (r) => r.startsWith("kiongozi_") && r.includes(plainRoleSuffix)
      );

      // Get available leadership positions from userRoles if the matching leadership role exists
      const leadershipPositions = correspondingKiongozi
        ? userRoles.find((r) => r.role === correspondingKiongozi)?.defaultPositions || []
        : [];

      return (
        <Row key={plainRole} className="align-items-center mb-3">
          {/* Left column: Plain role */}
          <Col xs={12} md={6}>
            <Form.Check
              type="checkbox"
              id={plainRole}
              label={formatRoleName(plainRole)}
              checked={formData.selectedRoles.includes(plainRole)}
              onChange={() => handleRoleChange(plainRole)}
            />
          </Col>

          {/* Right column: Corresponding leadership role (if found) */}
          <Col xs={12} md={6}>
            {correspondingKiongozi && (
              <>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id={correspondingKiongozi}
                    label={formatRoleName(correspondingKiongozi)}
                    checked={formData.selectedRoles.includes(correspondingKiongozi)}
                    onChange={() => handleRoleChange(correspondingKiongozi)}
                  />
                  <Button
                    variant="link"
                    className="ms-2"
                    onClick={() => toggleLeadershipSection(correspondingKiongozi)}
                  >
                    {toggleLeadershipUI[correspondingKiongozi] ? (
                      <>
                        <FaMinusCircle /> Funga Nafasi
                      </>
                    ) : (
                      <>
                        <FaPlusCircle /> Weka Nafasi
                      </>
                    )}
                  </Button>
                </div>

                {/* Show the leadership positions UI if toggled open and the leadership role is selected */}
                {toggleLeadershipUI[correspondingKiongozi] &&
                  formData.selectedRoles.includes(correspondingKiongozi) && (
                    <div className="mt-2 p-2 border rounded bg-light">
                      <Form.Label>Nafasi ya Uongozi:</Form.Label>
                      {leadershipPositions.map((position, index) => (
                        <Form.Check
                          key={index}
                          type="checkbox"
                          id={`${correspondingKiongozi}-${position}`}
                          label={position}
                          checked={
                            selectedLeadershipPositions[correspondingKiongozi]
                              ? selectedLeadershipPositions[correspondingKiongozi].includes(position)
                              : false
                          }
                          onChange={(e) =>
                            handleLeadershipPositionChange(
                              correspondingKiongozi,
                              position,
                              e.target.checked
                            )
                          }
                          className="mb-2"
                        />
                      ))}
                    </div>
                  )}
              </>
            )}
          </Col>
        </Row>
      );
    });
  };

  return (
    <div>
      <h3 className="mb-3">Vikundi na Nafasi ya Uongozi</h3>
      <Tabs defaultActiveKey="jumuiya" className="mb-3">
        <Tab eventKey="jumuiya" title="Jumuiya">
          {renderRoleRows(jumuiyaGroup)}
        </Tab>
        <Tab eventKey="kwaya" title="Kwaya">
          {renderRoleRows(kwayaGroup)}
        </Tab>
        <Tab eventKey="others" title="Huduma Nyingine">
          {renderRoleRows(otherGroup)}
        </Tab>
      </Tabs>
    </div>
  );
}
