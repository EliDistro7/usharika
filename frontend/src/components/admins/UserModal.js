import { formatRoleName } from '@/actions/utils';
import React, { useState } from 'react';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap'; // Added Tabs and Tab for the tab functionality.
import { FaCrown } from 'react-icons/fa';


const UserModal = ({ show, onClose, user }) => {
  console.log('user', user)
  const [activeTab, setActiveTab] = useState('profile'); // Manage active tab state.

  if (!user) return null;

  

  // Convert leadershipPositions from Map (or object) into an object if needed
  // Here, we assume it's an object where keys are group names and values are arrays of positions.
  const leadershipPositionsObj =
    user.leadershipPositions && typeof user.leadershipPositions === 'object'
      ? user.leadershipPositions
      : {};

 

      return (
        <Modal show={show} onHide={onClose} centered>
          {/* Modal Header */}
          <Modal.Header
            closeButton
            style={{ backgroundColor: '#f5f3ff', borderBottom: '1px solid #e0d8ff' }}
          >
            <Modal.Title style={{ color: '#6a0dad', fontWeight: '600' }}>Profile</Modal.Title>
          </Modal.Header>
      
          {/* Modal Body */}
          <Modal.Body style={{ backgroundColor: '#faf9ff', padding: '1.5rem' }}>
            <Tabs
              activeKey={activeTab}
              onSelect={(tab) => setActiveTab(tab)}
              className="mb-3"
              variant="pills"
              style={{ borderBottom: '1px solid #e0d8ff' }}
            >
              {/* Profile Details Tab */}
              <Tab eventKey="profile" title="Profile">
                <div className="text-center mb-4">
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/100'}
                    alt={user.name}
                    className="rounded-circle mb-3"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      border: '3px solid #e0d8ff',
                    }}
                  />
                  <h5 style={{ color: '#4a2ea0', fontWeight: '600' }}>{user.name}</h5>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{user.jumuiya}</p>
                </div>
                <div className="mt-3">
                  <div className="mb-3">
                    <strong style={{ color: '#6a0dad' }}>Hali ya Ndoa:</strong> {user.maritalStatus}
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: '#6a0dad' }}>Kazi:</strong> {user.occupation}
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: '#6a0dad' }}>Simu:</strong> {user.phone}
                  </div>
                  <div>
                    <strong style={{ color: '#6a0dad' }}>Jinsia:</strong> {user.gender}
                  </div>
                </div>
              </Tab>
      
              {/* Leadership Positions Tab */}
              <Tab eventKey="leadership" title="Uongozi">
                {Object.keys(leadershipPositionsObj).length > 0 ? (
                  <div className="mt-4">
                    <h5
                      className="text-center mb-4"
                      style={{ color: '#6a0dad', fontWeight: '600' }}
                    >
                      <FaCrown className="me-2" /> Nafasi za Uongozi
                    </h5>
                    <table className="table table-hover" style={{ backgroundColor: '#fff' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f3ff', color: '#6a0dad' }}>
                          <th>#</th>
                          <th>Kundi</th>
                          <th>Nafasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(leadershipPositionsObj).map(
                          ([group, positions], index) => (
                            <tr key={group}>
                              <td>{index + 1}</td>
                              <td>{formatRoleName(group.replace('kiongozi_', ''))}</td>
                              <td>
                                {positions && positions.length > 0
                                  ? positions.join(', ')
                                  : 'Hakuna Nafasi'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted mt-4">Hakuna Nafasi za Uongozi.</p>
                )}
              </Tab>
      
              {/* SADAKA / Pledges Tab */}
              <Tab eventKey="offerings" title="SADAKA">
                <div className="mt-4">
                  <h5 className="text-center mb-4" style={{ color: '#6a0dad', fontWeight: '600' }}>
                    SADAKA
                  </h5>
                  <table className="table table-hover" style={{ backgroundColor: '#fff' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f3ff', color: '#6a0dad' }}>
                        <th>#</th>
                        <th>Aina ya Ahadi</th>
                        <th>Jumla ya Ahadi (TZS)</th>
                        <th>Iliyolipwa (TZS)</th>
                        <th>Baki (TZS)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Default Pledge: Ahadi */}
                      <tr>
                        <td>1</td>
                        <td>Ahadi</td>
                        <td>{user.pledges.ahadi.toLocaleString()}</td>
                        <td>{user.pledges.paidAhadi.toLocaleString()}</td>
                        <td>
                          {(user.pledges.ahadi - user.pledges.paidAhadi).toLocaleString()}
                        </td>
                      </tr>
                      {/* Default Pledge: Jengo */}
                      <tr>
                        <td>2</td>
                        <td>Jengo</td>
                        <td>{user.pledges.jengo.toLocaleString()}</td>
                        <td>{user.pledges.paidJengo.toLocaleString()}</td>
                        <td>
                          {(user.pledges.jengo - user.pledges.paidJengo).toLocaleString()}
                        </td>
                      </tr>
                      {/* Dynamic Pledges from 'other' */}
                      {user.pledges.other &&
                        Object.keys(user.pledges.other).length > 0 &&
                        Object.entries(user.pledges.other).map(
                          ([key, { total, paid }], index) => (
                            <tr key={key}>
                              <td>{index + 3}</td>
                              <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                              <td>{total.toLocaleString()}</td>
                              <td>{paid.toLocaleString()}</td>
                              <td>{(total - paid).toLocaleString()}</td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
      
          {/* Modal Footer */}
          <Modal.Footer style={{ backgroundColor: '#f5f3ff', borderTop: '1px solid #e0d8ff' }}>
            <Button variant="outline-secondary" onClick={onClose}>
              Funga
            </Button>
          </Modal.Footer>
        </Modal>
      );
};

export default UserModal;
