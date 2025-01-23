import { formatRoleName } from '@/actions/utils';
import React, { useState } from 'react';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap'; // Added Tabs and Tab for the tab functionality.
import { FaCrown } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserModal = ({ show, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('profile'); // Manage active tab state.

  if (!user) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#4a2ea0');
    doc.setFillColor('#e6e0f8');
    doc.rect(10, 10, 190, 10, 'F');
    doc.text('Profile', 105, 17, null, null, 'center');

    if (user.profilePicture) {
      doc.addImage(user.profilePicture, 'JPEG', 90, 25, 30, 30);
    }

    doc.setFontSize(12);
    doc.text(`${user.name}`, 105, 70, null, null, 'center');
    doc.setTextColor('#000');
    doc.text(`Jumuiya: ${user.jumuiya}`, 105, 75, null, null, 'center');

    const details = [
      ['Hali ya Ndoa', user.maritalStatus],
      ['Kazi', user.occupation],
      ['Simu', user.phone],
      ['Jinsia', user.gender],
      ['Ubatizo', user.ubatizo ? 'ndio' : 'hapana'],
      ['Kipaimara', user.kipaimara ? 'ndio' : 'hapana'],
    ];

    details.forEach((detail, index) => {
      doc.text(`${detail[0]}: ${detail[1]}`, 20, 90 + index * 10);
    });

    doc.setFontSize(14);
    doc.setTextColor('#4a2ea0');
    doc.text('Vikundi Anavyoshiriki', 105, 140, null, null, 'center');

    const groupData =
      user.selectedRoles && user.selectedRoles.length > 0
        ? user.selectedRoles.map((role, index) => [
            index + 1,
            formatRoleName(role),
            role.startsWith('kiongozi') ? '👑 Kiongozi' : '',
          ])
        : [['', 'Hakuna Vikundi Anavyoshiriki', '']];

    doc.autoTable({
      startY: 150,
      head: [['#', 'Jina la Kikundi', 'Alama']],
      body: groupData,
      styles: { fillColor: '#dcd6f7', textColor: '#4a2ea0', halign: 'center' },
      theme: 'striped',
    });

    doc.save(`${user.name}_profile.pdf`);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: '#e6e0f8', color: '#4a2ea0' }}
      >
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f7f3fd' }}>
        <Tabs
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
          className="mb-3"
        >
          {/* Tab for Offerings */}
          <Tab eventKey="offerings" title="SADAKA">
            <div>
              <h5 className="text-center" style={{ color: '#4a2ea0' }}>
                SADAKA
              </h5>
                      {/* Pledges */}
<div className="mb-4">
  <h6 className="text-primary mb-2" style={{ fontWeight: "600" }}>
    Ahadi za Msharika
  </h6>
  <ul className="list-group">
    {/* Default pledge types */}
    <li className="list-group-item">
      <strong>Ahadi:</strong> {user.pledges.ahadi} TZS / Iliyolipwa:{" "}
      {user.pledges.paidAhadi} TZS
    </li>
    <li className="list-group-item">
      <strong>Jengo:</strong> {user.pledges.jengo} TZS / Iliyolipwa:{" "}
      {user.pledges.paidJengo} TZS
    </li>

 {/* Dynamic pledge types from 'other' */}
{user.pledges.other && (
  <div className="mt-4">
    <h6 className="text-primary" style={{ color: '#4a2ea0' }}>
     Ahadi Nyingine
    </h6>
    <table className="table table-bordered mt-2" style={{ backgroundColor: '#fff' }}>
      <thead>
        <tr style={{ backgroundColor: '#dcd6f7', color: '#4a2ea0' }}>
          <th>#</th>
          <th>Aina ya Ahadi</th>
          <th>Jumla ya Ahadi (TZS)</th>
          <th>Iliyolipwa (TZS)</th>
          <th>Baki (TZS)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(user.pledges.other).map(([key, { total, paid }], index) => (
          <tr key={key}>
            <td>{index + 1}</td>
            <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
            <td>{total.toLocaleString()}</td>
            <td>{paid.toLocaleString()}</td>
            <td>{(total - paid).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

  </ul>
</div>
            </div>
          </Tab>


          {/* Tab for Profile Details */}
          <Tab eventKey="profile" title="Profile">
            <div className="text-center">
              <img
                src={user.profilePicture || 'https://via.placeholder.com/100'}
                alt={user.name}
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h5>{user.name}</h5>
              <p className="text-muted">{user.jumuiya}</p>
            </div>
            <div>
              <p>
                <strong>Hali ya Ndoa:</strong> {user.maritalStatus}
              </p>
              <p>
                <strong>Kazi:</strong> {user.occupation}
              </p>
              <p>
                <strong>Simu:</strong> {user.phone}
              </p>
              <p>
                <strong>Jinsia:</strong> {user.gender}
              </p>

              <div className="mt-4">
                <h6 className="text-center" style={{ color: '#4a2ea0' }}>
                  Vikundi Anavyoshiriki
                </h6>
                <table
                  className="table table-bordered mt-2"
                  style={{ backgroundColor: '#fff' }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: '#dcd6f7',
                        color: '#4a2ea0',
                      }}
                    >
                      <th>#</th>
                      <th>Jina la Kikundi</th>
                      <th>Alama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.selectedRoles && user.selectedRoles.length > 0 ? (
                      user.selectedRoles.map((role, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{formatRoleName(role)}</td>
                          <td>
                            {role.startsWith('kiongozi') && (
                              <FaCrown
                                style={{
                                  color: '#FFD700',
                                  fontSize: '1.2rem',
                                }}
                                title="Kiongozi"
                              />
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          Hakuna Vikundi Anavyoshiriki
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p>
                <strong>Ubatizo:</strong> {user.ubatizo ? 'ndio' : 'hapana'}
              </p>
              <p>
                <strong>Kipaimara:</strong> {user.kipaimara ? 'ndio' : 'hapana'}
              </p>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#e6e0f8' }}>
        <Button variant="secondary" onClick={onClose}>
          Funga
        </Button>
        {/* <Button variant="primary" onClick={generatePDF}>
          Pakua PDF
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
