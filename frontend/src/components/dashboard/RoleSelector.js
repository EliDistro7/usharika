'use client';
import React, { useState } from 'react';
import { Tabs, Tab, Row, Col, Form, Accordion, Button } from 'react-bootstrap';
import { formatRoleName } from '@/actions/utils';
import { addRegisterNotification } from '@/actions/admin';
import { toast } from 'react-toastify';

export default function RoleSelector({ userRoles, user }) {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [newRole, setNewRole] = useState('');

  // Toggle a role or role-position selection.
  const handleRoleChange = (role) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(role)
        ? prevSelected.filter((r) => r !== role)
        : [...prevSelected, role]
    );
  };

  // When the form is submitted, loop through all selected roles and send notifications.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process each selected role.
      for (const role of selectedRoles) {
        await addRegisterNotification({
          selectedRole: role,
          userId: user._id,
          type: 'kujiungaKikundi',
          name: user.name,
        });
      }
      toast.success('Maombi ya kujiunga yamefanikiwa kutumwa.');
      // Optionally, clear the selections after successful submission:
      // setSelectedRoles([]);
    } catch (err) {
      toast.error('Imeshindikana kutuma maombi ya kujiunga.');
    }
  };

  // Group roles by prefix for organizing into tabs.
  const groupRoles = (prefix) => {
    return userRoles.filter(
      (roleObj) =>
        roleObj.role.startsWith(prefix) ||
        roleObj.role.startsWith(`kiongozi_${prefix}`)
    );
  };

  const jumuiyaGroup = groupRoles('jumuiya');
  const kwayaGroup = groupRoles('kwaya');
  const otherGroup = userRoles.filter(
    (roleObj) =>
      !roleObj.role.startsWith('jumuiya') &&
      !roleObj.role.startsWith('kiongozi_jumuiya') &&
      !roleObj.role.startsWith('kwaya') &&
      !roleObj.role.startsWith('kiongozi_kwaya')
  );

  // Render the roles for a given group.
  const renderRoleRows = (groupRoles) => {
    return groupRoles.map((roleObj) => {
      const { role, defaultPositions } = roleObj;
      const isKiongozi = role.startsWith('kiongozi');
      return (
        <Row key={role} className="align-items-center mb-3">
          <Col xs={12} md={6}>
            {isKiongozi ? (
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{formatRoleName(role)}</Accordion.Header>
                  <Accordion.Body>
                    {defaultPositions.length > 0 ? (
                      defaultPositions.map((position) => (
                        <Form.Check
                          key={position}
                          type="checkbox"
                          id={`${role}-${position}`}
                          label={position}
                          checked={selectedRoles.includes(`${role}-${position}`)}
                          onChange={() => handleRoleChange(`${role}-${position}`)}
                        />
                      ))
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id={role}
                        label={formatRoleName(role)}
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                      />
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : (
              <Form.Check
                type="checkbox"
                id={role}
                label={formatRoleName(role)}
                checked={selectedRoles.includes(role)}
                onChange={() => handleRoleChange(role)}
              />
            )}
          </Col>
        </Row>
      );
    });
  };

  return (
    <div>
      <h3 className="mb-3">Jiunge na Vikundi Vingine</h3>
      <Form onSubmit={handleSubmit}>
        <Tabs defaultActiveKey="jumuiya" className="mb-3">
          <Tab eventKey="jumuiya" title="Jumuiya">
            {renderRoleRows(jumuiyaGroup)}
          </Tab>
          <Tab eventKey="kwaya" title="Kwaya">
            {renderRoleRows(kwayaGroup)}
          </Tab>
          <Tab eventKey="others" title="Mengine">
            {renderRoleRows(otherGroup)}
          </Tab>
        </Tabs>
        {selectedRoles.length > 0 && (
          <div className="mt-4">
            <h5>Umechagua:</h5>
            <ul>
              {selectedRoles.map((role) => (
                <li key={role}>{formatRoleName(role)}</li>
              ))}
            </ul>
            <Button type="submit" variant="primary">
              Tuma Maombi
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
