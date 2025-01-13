import { formatRoleName } from '@/actions/utils';
import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap for Modal.
import { FaCrown } from 'react-icons/fa'; // Importing the crown icon to represent leadership.
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserModal = ({ show, onClose, user }) => {
  if (!user) return null;

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(16);
    doc.setTextColor('#4a2ea0');
    doc.setFillColor('#e6e0f8');
    doc.rect(10, 10, 190, 10, 'F');
    doc.text('Profile', 105, 17, null, null, 'center');

    // Add profile picture
    if (user.profilePicture) {
      doc.addImage(
        user.profilePicture,
        'JPEG',
        90,
        25,
        30,
        30
      ); // Placeholder for profile picture
    }

    // Add user info
    doc.setFontSize(12);
    doc.text(`${user.name}`, 105, 70, null, null, 'center');
    doc.setTextColor('#000');
    doc.text(`Jumuiya: ${user.jumuiya}`, 105, 75, null, null, 'center');

    // Add additional details
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

    // Add groups in a table
    doc.setFontSize(14);
    doc.setTextColor('#4a2ea0');
    doc.text('Vikundi Anavyoshiriki', 105, 140, null, null, 'center');

    const groupData = user.selectedRoles && user.selectedRoles.length > 0
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

    // Save PDF
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

          {/* Vikundi Anavyoshiriki in Table Format */}
          <div className="mt-4">
            <h6 className="text-center" style={{ color: '#4a2ea0' }}>
              Vikundi Anavyoshiriki
            </h6>
            <table
              className="table table-bordered mt-2"
              style={{ backgroundColor: '#fff' }}
            >
              <thead>
                <tr style={{ backgroundColor: '#dcd6f7', color: '#4a2ea0' }}>
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
