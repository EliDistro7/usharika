import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaClipboardCheck, 
  FaClock, 
  FaCalendarAlt, 
  FaStar, 
  FaUserCheck, 
  FaUsers,
  
  FaToggleOn,
  FaToggleOff,
  FaCheck,
  FaStopwatch
} from "react-icons/fa";

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

    return parseFloat(rating.toFixed(2));
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return "text-green-600 bg-green-100";
    if (rating >= 7) return "text-yellow-600 bg-yellow-100";
    if (rating >= 5) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
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
      .filter((entry) => entry.present)
      .map(({ present, ...rest }) => rest);

    if (attendees.length === 0) {
      toast.error("Tafadhali, chagua walau mwanakikundi mmoja aliyehudhuria.");
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

  const presentCount = Object.values(attendance).filter(entry => entry.present).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          className="mt-16"
          toastClassName="bg-white shadow-medium rounded-2xl"
        />

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-4 animate-gentle-float">
            <FaClipboardCheck className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            Fomu ya Mahudhurio
          </h1>
          <p className="text-text-secondary text-lg">
            Rekodi mahudhurio ya wanakikundi na kadiri umahiri wao
          </p>
        </div>

        {/* Main Form Card */}
        <div className="glass backdrop-blur-xl rounded-3xl shadow-strong overflow-hidden animate-slide-up">
          {/* Form Header */}
          <div className="bg-primary-gradient px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaUsers className="text-white text-2xl animate-pulse-soft" />
                <div>
                  <h2 className="text-2xl font-display font-bold text-white text-shadow">
                    Sajili Mahudhurio
                  </h2>
                  <p className="text-primary-100 font-medium">
                    Jaza taarifa za kipindi na chagua waliohudhuria
                  </p>
                </div>
              </div>
              {presentCount > 0 && (
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-white font-bold">
                    {presentCount} waliohudhuria
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/90 backdrop-blur-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Session Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Session Name */}
                <div className="group">
                  <label 
                    htmlFor="sessionName" 
                    className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                  >
                    <FaClipboardCheck className="text-primary-500" />
                    <span>Jina la Tukio/Kipindi</span>
                  </label>
                  <input
                    type="text"
                    id="sessionName"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Mfano: Ibada ya Jumapili"
                    required
                    className="
                      w-full px-4 py-4 rounded-2xl border-2 border-border-light
                      focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20
                      transition-all duration-300
                      bg-background-50 text-text-primary placeholder-text-tertiary
                      font-medium group-hover:border-border-medium
                    "
                  />
                </div>

                {/* Date */}
                <div className="group">
                  <label 
                    htmlFor="date" 
                    className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                  >
                    <FaCalendarAlt className="text-green-500" />
                    <span>Tarehe ya Tukio</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="
                      w-full px-4 py-4 rounded-2xl border-2 border-border-light
                      focus:border-green-500 focus:ring-4 focus:ring-green-500/20
                      transition-all duration-300
                      bg-background-50 text-text-primary
                      font-medium group-hover:border-border-medium
                    "
                  />
                </div>
              </div>

              {/* Rating Toggle */}
              <div className="bg-background-200 p-6 rounded-2xl border border-border-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaStar className="text-yellow-500 text-xl" />
                    <div>
                      <h3 className="font-bold text-text-primary">Ukadiriaji wa Umahiri</h3>
                      <p className="text-text-secondary text-sm">
                        Washa ili kupima umahiri wa kutunza muda
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRatingEnabled(!ratingEnabled)}
                    className="transition-all duration-300 hover:scale-110"
                  >
                    {ratingEnabled ? (
                      <FaToggleOn className="text-green-500 text-3xl" />
                    ) : (
                      <FaToggleOff className="text-gray-400 text-3xl" />
                    )}
                  </button>
                </div>

                {/* Session Start Time (conditional) */}
                {ratingEnabled && (
                  <div className="mt-4 animate-slide-down">
                    <label 
                      htmlFor="sessionStartTime" 
                      className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                    >
                      <FaClock className="text-yellow-600" />
                      <span>Muda wa Kuanzia Kipindi</span>
                    </label>
                    <input
                      type="time"
                      id="sessionStartTime"
                      value={sessionStartTime}
                      onChange={(e) => setSessionStartTime(e.target.value)}
                      required
                      className="
                        w-full md:w-1/2 px-4 py-4 rounded-2xl border-2 border-border-light
                        focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20
                        transition-all duration-300
                        bg-background-50 text-text-primary font-medium
                      "
                    />
                  </div>
                )}
              </div>

              {/* Attendees Table */}
              <div className="bg-background-200 rounded-2xl p-6 border border-border-light">
                <div className="flex items-center space-x-2 mb-6">
                  <FaUserCheck className="text-primary-500 text-xl" />
                  <h3 className="font-bold text-text-primary text-lg">
                    Orodha ya Wanakikundi ({data.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Table Header */}
                    <div className={`
                      grid gap-4 p-4 bg-primary-700 text-white rounded-2xl mb-4 font-bold
                      ${ratingEnabled ? 'grid-cols-5' : 'grid-cols-3'}
                    `}>
                      <div className="text-center">Picha</div>
                      <div>Jina la Mwanakikundi</div>
                      <div className="text-center">Mahudhurio</div>
                      {ratingEnabled && (
                        <>
                          <div className="text-center">Muda wa Kufika</div>
                          <div className="text-center">Alama</div>
                        </>
                      )}
                    </div>

                    {/* Table Body */}
                    <div className="space-y-3">
                      {data.map((user) => (
                        <div
                          key={user._id}
                          className={`
                            grid gap-4 p-4 rounded-2xl border-2 transition-all duration-300
                            ${attendance[user._id]?.present 
                              ? 'bg-green-50 border-green-200 shadow-green' 
                              : 'bg-white border-border-light hover:border-primary-300'
                            }
                            ${ratingEnabled ? 'grid-cols-5' : 'grid-cols-3'}
                          `}
                        >
                          {/* Profile Picture */}
                          <div className="flex justify-center">
                            <img
                              src={user.profilePicture || "https://via.placeholder.com/50"}
                              alt={user.name}
                              className="w-12 h-12 rounded-full border-2 border-border-medium object-cover"
                            />
                          </div>

                          {/* Name */}
                          <div className="flex items-center">
                            <span className="font-medium text-text-primary">
                              {user.name}
                            </span>
                          </div>

                          {/* Attendance Checkbox */}
                          <div className="flex justify-center items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                onChange={(e) =>
                                  handleCheckboxChange(user._id, user.name, e.target.checked)
                                }
                              />
                              <div className="
                                w-6 h-6 bg-white border-2 border-border-medium rounded-lg
                                peer-checked:bg-green-500 peer-checked:border-green-500
                                transition-all duration-300 flex items-center justify-center
                                hover:border-green-400 peer-checked:hover:bg-green-600
                              ">
                                {attendance[user._id]?.present && (
                                  <FaCheck className="text-white text-sm" />
                                )}
                              </div>
                            </label>
                          </div>

                          {/* Conditional Rating Fields */}
                          {ratingEnabled && (
                            <>
                              {/* Arrival Time */}
                              <div className="flex justify-center items-center">
                                <input
                                  type="time"
                                  onChange={(e) =>
                                    handleArrivalTimeChange(user._id, e.target.value)
                                  }
                                  disabled={!attendance[user._id]?.present}
                                  className="
                                    px-3 py-2 rounded-xl border-2 border-border-light text-center
                                    focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    bg-background-50 text-text-primary font-medium
                                    transition-all duration-300
                                  "
                                />
                              </div>

                              {/* Rating Display */}
                              <div className="flex justify-center items-center">
                                {attendance[user._id]?.rating !== undefined ? (
                                  <span className={`
                                    px-3 py-2 rounded-full text-sm font-bold flex items-center space-x-1
                                    ${getRatingColor(attendance[user._id].rating)}
                                  `}>
                                    <FaStar className="text-xs" />
                                    <span>{attendance[user._id].rating}</span>
                                  </span>
                                ) : (
                                  <span className="text-text-tertiary font-medium">-</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="
                    btn-success px-8 py-4 rounded-2xl text-white font-bold text-lg
                    flex items-center space-x-3 min-w-[200px] justify-center
                    shadow-green-lg hover:shadow-green-lg transition-all duration-300
                    hover:scale-105
                  "
                >
                  <FaStopwatch className="text-xl" />
                  <span>Wasilisha Mahudhurio</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        {ratingEnabled && (
          <div className="mt-8 glass backdrop-blur-sm rounded-2xl p-6 shadow-medium">
            <div className="text-center mb-4">
              <h3 className="font-bold text-text-primary text-lg mb-2">
                Jinsi ya Kupima Umahiri wa Kutunza Muda
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-green-600 font-bold text-xl mb-1">9-10</div>
                <div className="text-green-700 text-sm font-medium">Alifika mapema (15+ dakika)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="text-yellow-600 font-bold text-xl mb-1">7-8.9</div>
                <div className="text-yellow-700 text-sm font-medium">Alifika kwa wakati</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-orange-600 font-bold text-xl mb-1">5-6.9</div>
                <div className="text-orange-700 text-sm font-medium">Alichelewa kidogo</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="text-red-600 font-bold text-xl mb-1">0-4.9</div>
                <div className="text-red-700 text-sm font-medium">Alichelewa sana</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;