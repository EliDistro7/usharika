'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Attendance from '@/components/admins/Attendance';
import AttendanceRecords from '@/components/admins/AttendanceRecords';
import { getUsersByRole } from '@/hooks/useUser';
import { createAttendance, fetchSessionsByGroup } from '@/actions/attendance';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previousSessions, setPreviousSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance'); // Default tab
  const [activeSession, setActiveSession] = useState(null);

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
          console.log('data', data);
          setPreviousSessions(data);
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

      // Dynamically update the sessions list
      setPreviousSessions((prev) => [...new Set([attendanceData.sessionName, ...prev])]);
      setSuccessMessage('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error creating attendance:', error);
      setError('Failed to submit attendance. Please try again.');
    }
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

               {/* Previous Sessions Navigation */}
<nav className="bg-white shadow-sm rounded mt-4 p-3">
  <h5 className="fw-bold mb-3">Vipindi vya Nyuma</h5>
  {previousSessions.length > 0 ? (
    <div className="d-flex flex-wrap gap-2">
      {previousSessions.map((session, index) => (
        <button
          key={index}
          onClick={() => {
          
            setActiveTab('records');
            setActiveSession(session);
          }}
          className="btn btn-outline-primary px-4 py-2 rounded-pill shadow-sm"
        >
          {session}
        </button>
      ))}
    </div>
  ) : (
    <div className="text-muted">Hakuna vipindi vilivyorekodiwa</div>
  )}
</nav>

      {/* Content Rendering */}
      {activeTab === 'attendance' && (
        <>
          {/* Attendance Component */}
          <Attendance data={users} onSubmit={handleAttendanceSubmit} />



        </>
      )}

      {activeTab === 'records' && activeSession && (
        <AttendanceRecords group={Cookies.get('role')} />
      )}

      {/* Success/Error Messages */}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
      {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
    </div>
  );
}
