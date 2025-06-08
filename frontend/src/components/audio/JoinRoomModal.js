import React, { useState } from 'react';

// Join Room Modal Component
const JoinRoomModal = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState('listener');

  const handleSubmit = () => {
    if (roomId && userName) {
      onJoin(selectedRole, roomId, userName);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-purple text-white">
            <h5 className="modal-title">Join Church Service</h5>
          </div>
          <div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Room ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Join as</label>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="listener"
                      checked={selectedRole === 'listener'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <label className="form-check-label">Listener (Congregation)</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="broadcaster"
                      checked={selectedRole === 'broadcaster'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <label className="form-check-label">Broadcaster (Pastor/Leader)</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleSubmit} className="btn btn-purple w-100">
                Join Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;