


import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Alert } from 'react-bootstrap';
import { getAttendanceById } from '@/actions/attendance'; // Import your API function

const AttendanceModal = ({ attendanceId, showModal, handleClose }) => {
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
  console.log('atttendance Id', attendanceId)

  // Fetch the attendance record by ID when the modal opens
  useEffect(() => {
    if (attendanceId && showModal) {
      const fetchAttendance = async () => {
        try {
          const data = await getAttendanceById(attendanceId);
          console.log('attendance modal data', data);
          setAttendance(data);
        } catch (err) {
          setError('Failed to load attendance record.');
          console.error('Error fetching attendance:', err);
        }
      };
      fetchAttendance();
    }
  }, [attendanceId, showModal]);

  const handleDownload = () => {
    // Logic for downloading the attendance record
    console.log('Download attendance record');
  };

  const handleArchive = () => {
    // Logic for archiving the attendance record
    console.log('Archive attendance record');
  };

  if (!attendance && !error) {
    return null; // Return null if no attendance data is available yet
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{attendance ? attendance.session_name : 'Loading...'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <h5>Session Date: {new Date(attendance.date).toLocaleDateString()}</h5>
            <ListGroup>
              <ListGroup.Item>
                <strong>Group:</strong> {attendance.group}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Attendees:</strong>
                <ListGroup>
                  {attendance.attendees.map((attendee) => (
                    <ListGroup.Item key={attendee._id}>
                      {attendee.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        
        <Button variant="primary" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="warning" onClick={handleArchive}>
          Archive 
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceModal;
