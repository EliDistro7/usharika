import React, { useEffect, useState } from 'react';
import { getAttendanceByGroup } from '@/actions/attendance';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Icons for toggling

const AttendanceRecords = ({ group }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRecordIndex, setExpandedRecordIndex] = useState(null); // Track expanded session
  const [attendeesToShow, setAttendeesToShow] = useState(5); // Limit attendees displayed at a time

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch attendance records for the group
        const records = await getAttendanceByGroup(group);
        setAttendanceRecords(records);
      } catch (err) {
        setError('Failed to fetch attendance records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (group) {
      fetchAttendanceRecords();
    }
  }, [group]);

  if (loading) {
    return <div className="text-center my-4">Loading attendance records...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  const toggleAttendees = (index) => {
    // Toggle attendee visibility for a session
    setExpandedRecordIndex(expandedRecordIndex === index ? null : index);
  };

  return (
    <div className="container my-4">
      <h2 className="text-primary fw-bold mb-4">Rekodi za Mahudhurio</h2>
      {attendanceRecords.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Kipindi</th>
                <th>Tarehe</th>
                <th>Idadi ya Waliohudhuria</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <React.Fragment key={index}>
                  {/* Main Row */}
                  <tr>
                    <td>{index + 1}</td>
                    <td>{record.session_name}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.attendees.length}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toggleAttendees(index)}
                      >
                        {expandedRecordIndex === index ? 'Ficha' : 'Ona'} Waliohudhuria{' '}
                        {expandedRecordIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Attendee List Row */}
                  {expandedRecordIndex === index && (
                    <tr>
                      <td colSpan="5">
                        <div className="p-3 bg-light rounded">
                          <strong>Waliohudhuria:</strong>
                          <ul className="list-group mt-2">
                            {record.attendees.slice(0, attendeesToShow).map((attendee, i) => (
                              <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                {attendee.name}
                                <span className="badge badge-info">{attendee.id}</span>
                              </li>
                            ))}
                          </ul>
                          {record.attendees.length > attendeesToShow && (
                            <button
                              className="btn btn-sm btn-outline-info mt-2"
                              onClick={() => setAttendeesToShow(attendeesToShow + 5)}
                            >
                              Tazama zaidi
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted text-center">Bado hakuna rekodi za mahudhurio.</div>
      )}
    </div>
  );
};

export default AttendanceRecords;
