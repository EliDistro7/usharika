import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserTable.css"; // Add any additional styles as needed

const Attendance = ({ data, onSubmit }) => {
  const [sessionName, setSessionName] = useState("");
  const [date, setDate] = useState("");
  const [ratingEnabled, setRatingEnabled] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [attendance, setAttendance] = useState({});

// Helper function to calculate rating
const calculateRating = (sessionTime, arrivalTime) => {
  if (!sessionTime || !arrivalTime) return null;

  const sessionMinutes =
    parseInt(sessionTime.split(":")[0], 10) * 60 +
    parseInt(sessionTime.split(":")[1], 10);
  const arrivalMinutes =
    parseInt(arrivalTime.split(":")[0], 10) * 60 +
    parseInt(arrivalTime.split(":")[1], 10);
  const diff = sessionMinutes - arrivalMinutes; // Positive if early, negative if late

  let rating;

  if (diff >= 15) {
    rating = 10; // Perfect score for arriving 15 minutes early or earlier
  } else if (diff > 0) {
    rating = 7 + diff / 7; // Linear score reduction for arriving less than 15 minutes early
  } else if (diff === 0) {
    rating = 7; // On time
  } else {
    rating = Math.max(0, 7 + diff / 15); // Linear score reduction for being late
  }

  // Return the rating rounded to 2 decimal places
  return parseFloat(rating.toFixed(2));
};


  // Handle checkbox change
  const handleCheckboxChange = (userId, userName, checked) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        userId,
        name: userName,
        present: checked,
      },
    }));
  };

  // Handle arrival time change
  const handleArrivalTimeChange = (userId, arrivalTime) => {
    const rating = calculateRating(sessionStartTime, arrivalTime);

    setAttendance((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        arrivalTime,
        rating,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const attendees = Object.values(attendance)
      .filter((entry) => entry.present) // Only include present attendees
      .map(({ present, ...rest }) => rest); // Exclude 'present' field from final data

    if (attendees.length === 0) {
      toast.error("Tafadhali, chagua walau mwanakikundi mmoja liyehudhuri.");
      return;
    }

    if (ratingEnabled && !sessionStartTime) {
      toast.error("Tafadhali, ingiza kwanza muda wa kuanza kipindi.");
      return;
    }

    if (onSubmit) {
      onSubmit({ sessionName, date, ratingEnabled, sessionStartTime, attendees });
      toast.success("Mahudhurio yamerekodiwa kikamilifu!");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
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

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="ratingEnabled"
                  className="form-check-input"
                  checked={ratingEnabled}
                  onChange={(e) => setRatingEnabled(e.target.checked)}
                />
                <label htmlFor="ratingEnabled" className="form-check-label">
                  Enable Ratings (Washa Ukadiriaji)
                </label>
              </div>
            </div>

            {ratingEnabled && (
              <div className="mb-3">
                <label htmlFor="sessionStartTime" className="form-label">
                  Session Start Time (Muda wa Kuanzia)
                </label>
                <input
                  type="time"
                  id="sessionStartTime"
                  className="form-control"
                  value={sessionStartTime}
                  onChange={(e) => setSessionStartTime(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="table-responsive mb-3">
              <table className="table table-striped table-responsive-sm">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center">Photo (Picha)</th>
                    <th>Name (Jina)</th>
                    <th className="text-center">Present (Waliohudhuria)</th>
                    {ratingEnabled && (
                      <>
                        <th className="text-center">Arrival Time (Muda wa Kufika)</th>
                        <th className="text-center">Rating (Ukadiriaji)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => (
                    <tr key={user._id}>
                      <td className="text-center">
                        <img
                          src={user.profilePicture || "https://via.placeholder.com/50"}
                          alt={user.name}
                          className="rounded-circle"
                          style={{ width: "50px", height: "50px" }}
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
                      {ratingEnabled && (
                        <>
                          <td className="text-center align-middle">
                            <input
                              type="time"
                              className="form-control"
                              onChange={(e) =>
                                handleArrivalTimeChange(user._id, e.target.value)
                              }
                              disabled={!attendance[user._id]?.present}
                            />
                          </td>
                          <td className="text-center align-middle">
                            {attendance[user._id]?.rating !== undefined
                              ? attendance[user._id].rating
                              : "-"}
                          </td>
                        </>
                      )}
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
