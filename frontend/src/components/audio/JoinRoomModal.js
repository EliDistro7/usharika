import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedInUsername } from '@/hooks/useUser';
import { Users, Radio, User, LogIn } from 'lucide-react';

// Join Room Modal Component
const JoinRoomModal = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [selectedRole, setSelectedRole] = useState('listener');
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get logged in username on component mount
    const fetchUsername = async () => {
      try {
        const username = await getLoggedInUsername();
        setLoggedInUsername(username);
      } catch (error) {
        console.error('Error fetching username:', error);
        setLoggedInUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const handleSubmit = () => {
    if (roomId && loggedInUsername) {
      onJoin(selectedRole, roomId, loggedInUsername);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-purple mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!loggedInUsername) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-gradient" style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)' }}>
              <h5 className="modal-title text-white fw-bold d-flex align-items-center">
                <LogIn size={20} className="me-2" />
                Authentication Required
              </h5>
            </div>
            <div className="modal-body text-center py-5">
              <div className="mb-4">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <User size={32} className="text-purple" />
                </div>
              </div>
              <h6 className="fw-bold text-dark mb-3">Please Login First</h6>
              <p className="text-muted mb-4">
                You need to be logged in to join a church service. Please authenticate to continue.
              </p>
              <button 
                onClick={handleLoginRedirect}
                className="btn btn-purple btn-lg px-4 py-2 fw-semibold"
              >
                <LogIn size={18} className="me-2" />
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main modal for logged in users
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxHeight: '90vh' }}>
        <div className="modal-content border-0 shadow-lg" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="modal-header bg-gradient border-0 py-4" 
               style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)' }}>
            <h5 className="modal-title text-white fw-bold d-flex align-items-center fs-4">
              <Radio size={24} className="me-3" />
              Join Church Service
            </h5>
          </div>

          <div className="modal-body p-4" style={{ overflowY: 'auto', flex: '1' }}>
            {/* Welcome Message */}
            <div className="bg-light rounded-3 p-3 mb-4 border">
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                  <User size={20} className="text-purple" />
                </div>
                <div>
                  <p className="mb-1 fw-bold text-dark">{loggedInUsername}</p>
                  <small className="text-secondary">Ready to join the service?</small>
                </div>
              </div>
            </div>

            {/* Room ID Input */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                <Users size={18} className="me-2" />
                Service Room ID
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-2 focus-purple"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter the room ID provided by your church"
                style={{ 
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  borderColor: '#dee2e6',
                  fontSize: '1rem'
                }}
              />
              <small className="text-secondary mt-2 d-block" style={{ fontSize: '0.85rem' }}>
                Ask your pastor or church leader for the room ID
              </small>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark mb-3" style={{ fontSize: '1.1rem' }}>
                How would you like to join?
              </label>
              
              <div className="row g-3">
                {/* Listener Option */}
                <div className="col-md-6">
                  <div className={`card h-100 border-2 cursor-pointer transition-all ${
                    selectedRole === 'listener' 
                      ? 'border-purple bg-purple bg-opacity-10' 
                      : 'border-light hover-shadow'
                  }`}
                  style={{ borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => setSelectedRole('listener')}>
                    <div className="card-body text-center p-4">
                      <div className="form-check d-flex justify-content-center mb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="listener"
                          checked={selectedRole === 'listener'}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      </div>
                      <Users size={32} className={`mb-3 ${
                        selectedRole === 'listener' ? 'text-purple' : 'text-muted'
                      }`} />
                      <h6 className="fw-bold text-dark mb-2">Congregation Member</h6>
                      <small className="text-secondary">
                        Join as a listener to participate in the service
                      </small>
                    </div>
                  </div>
                </div>

                {/* Broadcaster Option */}
                <div className="col-md-6">
                  <div className={`card h-100 border-2 cursor-pointer transition-all ${
                    selectedRole === 'broadcaster' 
                      ? 'border-purple bg-purple bg-opacity-10' 
                      : 'border-light hover-shadow'
                  }`}
                  style={{ borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => setSelectedRole('broadcaster')}>
                    <div className="card-body text-center p-4">
                      <div className="form-check d-flex justify-content-center mb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="broadcaster"
                          checked={selectedRole === 'broadcaster'}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      </div>
                      <Radio size={32} className={`mb-3 ${
                        selectedRole === 'broadcaster' ? 'text-purple' : 'text-muted'
                      }`} />
                      <h6 className="fw-bold text-dark mb-2">Pastor/Leader</h6>
                      <small className="text-secondary">
                        Lead the service and broadcast to congregation
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 p-4 pt-2" style={{ flexShrink: 0 }}>
            <button 
              onClick={handleSubmit} 
              disabled={!roomId || !loggedInUsername}
              className={`btn btn-lg w-100 py-3 fw-bold ${
                roomId && loggedInUsername ? 'btn-purple' : 'btn-secondary'
              }`}
              style={{ 
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem'
              }}
            >
              <Radio size={20} className="me-2" />
              {roomId && loggedInUsername ? 'Join Service Now' : 'Enter Room ID to Continue'}
            </button>
            
            {!roomId && loggedInUsername && (
              <small className="text-secondary text-center w-100 mt-3" style={{ fontSize: '0.9rem' }}>
                Please enter a room ID to continue
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .focus-purple:focus {
          border-color: #6f42c1 !important;
          box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.25) !important;
        }
        
        .btn-secondary {
          background-color: #6c757d !important;
          border: none !important;
          color: white !important;
        }
        
        .btn-secondary:hover {
          background-color: #5a6268 !important;
        }
        
        .btn-purple {
          background: linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%) !important;
          border: none !important;
          color: white !important;
        }
        
        .btn-purple:hover {
          background: linear-gradient(135deg, #5a2d91 0%, #7c3aed 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(111, 66, 193, 0.3);
        }
        
        .btn-purple:disabled {
          background: #6c757d !important;
          transform: none;
          box-shadow: none;
        }
        
        .text-purple {
          color: #6f42c1 !important;
        }
        
        .text-secondary {
          color: #6c757d !important;
        }
        
        .border-purple {
          border-color: #6f42c1 !important;
        }
        
        .bg-purple {
          background-color: #6f42c1 !important;
        }
        
        .hover-shadow:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default JoinRoomModal;