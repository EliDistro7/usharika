'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Attendance from '@/components/admins/Attendance';
import AttendanceRecords from '@/components/admins/AttendanceRecords';
import AttendanceModal from '@/components/admins/AttendanceModal'; // Import AttendanceModal
import { getUsersByRole } from '@/hooks/useUser';
import { createAttendance, fetchSessionsByGroup } from '@/actions/attendance';
import { Accordion, Card, Button } from 'react-bootstrap';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previousSessions, setPreviousSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState({});
  const [activeTab, setActiveTab] = useState('attendance'); // Default tab
  const [activeSession, setActiveSession] = useState(null);
  
  // State for Attendance Modal
  const [showModal, setShowModal] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const role = Cookies.get('role');
        if (!role) {
          console.error('No role found in cookies!');
          setLoading(false);
          return;
        }

        // Fetch users by role
        const fetchedUsers = await getUsersByRole({ role });
        setUsers(fetchedUsers);

        // Fetch previous sessions for the group
        const { success, data, message } = await fetchSessionsByGroup(role);
        if (success) {
          console.log('Fetched sessions data:', data);

          // Group sessions by session_name and sort by date
          const grouped = data.reduce((acc, session) => {
            const { session_name, date, _id } = session;
            if (!acc[session_name]) acc[session_name] = [];
            acc[session_name].push({ date: new Date(date), session_name, _id });
            return acc;
          }, {});

          // Sort each group by date in descending order
          for (const key in grouped) {
            grouped[key] = grouped[key].sort((a, b) => b.date - a.date);
          }

          setGroupedSessions(grouped);
        } else {
          console.error('Failed to fetch sessions:', message);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleAttendanceSubmit = async (attendanceData) => {
    try {
      setError('');
      setSuccessMessage('');

      if (!attendanceData.sessionName || !attendanceData.date || attendanceData.attendees.length === 0) {
        setError('Please provide a session name, date, and select attendees.');
        return;
      }

      const payload = {
        group: Cookies.get('role'),
        session_name: attendanceData.sessionName,
        date: attendanceData.date,
        attendees: attendanceData.attendees,
      };

      await createAttendance(payload);

      setSuccessMessage('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error creating attendance:', error);
      setError('Failed to submit attendance. Please try again.');
    }
  };

  // Handle view button click to open modal
  const handleView = (session) => {
    console.log('session clicked', session)
    setAttendanceId(session._id); // Set attendance ID
    setShowModal(true); // Show modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setAttendanceId(null); // Reset attendance ID when closing
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <header className="rounded p-4 mb-4 shadow">
        <h1 className="display-4 fw-bold">{Cookies.get('role')?.replace('_', ' ')}</h1>
      </header>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Mahudhurio
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            Rekodi za Mahudhurio
          </button>
        </li>
      </ul>

      {/* Previous Sessions */}
      <Accordion defaultActiveKey="0">
        {Object.keys(groupedSessions).map((sessionName, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={idx} className="mb-3 shadow-sm">
            <Accordion.Header className="fw-bold">{sessionName}</Accordion.Header>
            <Accordion.Body>
              <div className="row g-3">
                {groupedSessions[sessionName].map((session, index) => (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div className="card border-primary shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary">
                          {new Date(session.date).toLocaleDateString()}
                        </h5>
                        <p className="card-text text-muted">{session.session_name}</p>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleView(session)} // Open modal with session data
                          >
                            <i className="bi bi-eye me-2"></i>View
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleArchive(session)}
                          >
                            <i className="bi bi-archive me-2"></i>Archive
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleDownload(session)}
                          >
                            <i className="bi bi-download me-2"></i>Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Content Rendering */}
      {activeTab === 'attendance' && (
        <Attendance data={users} onSubmit={handleAttendanceSubmit} />
      )}

      {activeTab === 'records' && activeSession && (
        <AttendanceRecords group={Cookies.get('role')} />
      )}

      {/* Success/Error Messages */}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
      {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}

      {/* Attendance Modal */}
     {showModal && (
                  <AttendanceModal
                  attendanceId={attendanceId}
                  showModal={showModal}
                  handleClose={handleCloseModal} // Close modal
                />
     )
     
     } 
    </div>
  );
}
