import React, { useState } from 'react';
import './UserTable.css'; // Add any additional styles as needed

const Attendance = ({ data, onSubmit }) => {
  const [sessionName, setSessionName] = useState('');
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState({});

  // Handle checkbox change
  const handleCheckboxChange = (userId, userName, checked) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: checked ? { userId, name: userName } : undefined,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const attendees = Object.values(attendance).filter(Boolean); // Get only selected attendees
    if (onSubmit && attendees.length > 0) {
      onSubmit({ sessionName, date, attendees });
    } else {
      alert('Please fill in session details and select attendees.');
    }
  };

  return (
    <div className="container py-4">
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0 text-white">Fomu ya Mahudhurio</h4>
        <i className="bi bi-clipboard-check fs-4"></i>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="sessionName" className="form-label">
              Event Name (Tukio)
            </label>
            <input
              type="text"
              id="sessionName"
              className="form-control"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter event name"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date (Tarehe)
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
  
          <div className="table-responsive mb-3">
            <table className="table table-striped table-responsive-sm">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">Photo (Picha)</th>
                  <th>Name (Jina)</th>
                  <th className="text-center">Present (Waliohudhuria)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user._id}>
                    <td className="text-center">
                      <img
                        src={user.profilePicture || 'https://via.placeholder.com/50'}
                        alt={user.name}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </td>
                    <td className="align-middle">{user.name}</td>
                    <td className="text-center align-middle">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        title="Mark attendance for this user"
                        onChange={(e) =>
                          handleCheckboxChange(user._id, user.name, e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5 shadow-sm">
              Submit (Wasilisha)
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default Attendance;
