import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedInUsername } from '@/hooks/useUser';
import { Users, Radio, User, LogIn, AlertCircle, X } from 'lucide-react';

// Join Room Modal Component
const JoinRoomModal = ({ onJoin, socket }) => {
  const [roomId, setRoomId] = useState('');
  const [selectedRole, setSelectedRole] = useState('listener');
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [broadcasterError, setBroadcasterError] = useState(null);
  const [showBroadcasterAlert, setShowBroadcasterAlert] = useState(false);
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

  useEffect(() => {
    // Set up socket listeners when socket is available
    if (socket) {
      const handleAlreadyHasBroadcaster = (data) => {
        setBroadcasterError({
          message: data.message,
          existingBroadcaster: data.existingBroadcaster
        });
        setShowBroadcasterAlert(true);
      };

      // Listen for already_has_broadcaster event
      socket.on('already_has_broadcaster', handleAlreadyHasBroadcaster);

      // Cleanup listener on unmount
      return () => {
        socket.off('already_has_broadcaster', handleAlreadyHasBroadcaster);
      };
    }
  }, [socket]);

  const handleSubmit = () => {
    if (roomId && loggedInUsername) {
      // Reset any previous broadcaster errors
      setBroadcasterError(null);
      setShowBroadcasterAlert(false);
      onJoin(selectedRole, roomId, loggedInUsername);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth');
  };

  const closeBroadcasterAlert = () => {
    setShowBroadcasterAlert(false);
    setBroadcasterError(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-2xl">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-purple mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted fs-5">Inakagua utambulisho...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!loggedInUsername) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-2xl">
            <div className="modal-header bg-gradient border-0 py-4" 
                 style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)' }}>
              <h5 className="modal-title text-white fw-bold d-flex align-items-center fs-3">
                <LogIn size={24} className="me-3" />
                Utambulisho Unahitajika
              </h5>
            </div>
            <div className="modal-body text-center py-5">
              <div className="mb-4">
                <div className="bg-purple bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center border border-purple border-opacity-25" 
                     style={{ width: '100px', height: '100px' }}>
                  <User size={40} className="text-purple" />
                </div>
              </div>
              <h4 className="fw-bold text-purple mb-3">Tafadhali Ingia Kwanza</h4>
              <p className="text-dark fs-5 mb-4 opacity-75">
                Unahitaji kuwa umeingia ili ujiunga na huduma ya kanisa. Tafadhali thibitisha ili kuendelea.
              </p>
              <button 
                onClick={handleLoginRedirect}
                className="btn btn-purple btn-lg px-5 py-3 fw-bold fs-5"
              >
                <LogIn size={20} className="me-2" />
                Nenda kwa Kuingia
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main modal for logged in users
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxHeight: '90vh' }}>
        <div className="modal-content border-0 shadow-2xl" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="modal-header bg-gradient border-0 py-4" 
               style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)' }}>
            <div className="w-100 text-center">
              <h3 className="text-white fw-bold mb-1">Usharika wa Yombo</h3>
              <p className="text-white-50 mb-3 fs-6">Huduma ya Mtandaoni Moja kwa Moja</p>
              <h4 className="text-white fw-bold d-flex align-items-center justify-content-center">
                <Radio size={28} className="me-3" />
                Jiunge na Huduma ya Kanisa
              </h4>
            </div>
          </div>

          <div className="modal-body p-4" style={{ overflowY: 'auto', flex: '1' }}>
            {/* Broadcaster Already Exists Alert */}
            {showBroadcasterAlert && broadcasterError && (
              <div className="alert alert-warning border-0 mb-4 position-relative" 
                   style={{ backgroundColor: '#fff3cd', borderRadius: '12px' }}>
                <button 
                  type="button" 
                  className="btn-close position-absolute top-0 end-0 mt-2 me-2"
                  onClick={closeBroadcasterAlert}
                  style={{ fontSize: '0.75rem' }}
                ></button>
                <div className="d-flex align-items-start">
                  <AlertCircle size={24} className="text-warning me-3 mt-1 flex-shrink-0" />
                  <div>
                    <h6 className="alert-heading fw-bold text-purple mb-2">Msambazaji Tayari Yupo</h6>
                    <p className="mb-2 text-dark">
                      Chumba hiki tayari kina msambazaji anayefanya kazi: <strong className="text-purple">{broadcasterError.existingBroadcaster?.userName}</strong>
                    </p>
                    <small className="text-muted">
                      Unaweza kujiunga kama mwanajumuiya au jaribu chumba kingine.
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            <div className="bg-purple bg-opacity-5 rounded-3 p-4 mb-4 border border-purple border-opacity-15">
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-circle p-3 me-3 shadow-sm border border-purple border-opacity-25">
                  <User size={24} className="text-purple" />
                </div>
                <div>
                  <h5 className="mb-1 fw-bold text-purple">{loggedInUsername}</h5>
                  <p className="mb-0 text-dark opacity-75">Tayari kujiunga na huduma?</p>
                </div>
              </div>
            </div>

            {/* Room ID Input */}
            <div className="mb-4">
              <label className="form-label fw-bold text-purple mb-3 fs-5">
                <Users size={20} className="me-2" />
                Nambari ya Chumba cha Huduma
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-2 focus-purple"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Ingiza nambari ya chumba uliyopewa na kanisa lako"
                style={{ 
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  borderColor: '#dee2e6',
                  fontSize: '1.1rem',
                  padding: '0.75rem 1rem'
                }}
              />
              <small className="text-muted mt-2 d-block fs-6">
                Muulize mchungaji wako au kiongozi wa kanisa nambari ya chumba
              </small>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold text-purple mb-3 fs-5">
                Ungependa kujiunga vipi?
              </label>
              
              <div className="row g-3">
                {/* Listener Option */}
                <div className="col-md-6">
                  <div className={`card h-100 border-2 cursor-pointer transition-all ${
                    selectedRole === 'listener' 
                      ? 'border-purple bg-purple bg-opacity-10 shadow-lg' 
                      : 'border-light hover-shadow'
                  }`}
                  style={{ borderRadius: '16px', cursor: 'pointer' }}
                  onClick={() => setSelectedRole('listener')}>
                    <div className="card-body text-center p-4">
                      <div className="form-check d-flex justify-content-center mb-3">
                        <input
                          className="form-check-input border-2"
                          type="radio"
                          value="listener"
                          checked={selectedRole === 'listener'}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{ transform: 'scale(1.3)', accentColor: '#6f42c1' }}
                        />
                      </div>
                      <Users size={36} className={`mb-3 ${
                        selectedRole === 'listener' ? 'text-purple' : 'text-muted'
                      }`} />
                      <h5 className="fw-bold text-purple mb-2">Congregation Member</h5>
                      <p className="text-dark opacity-75 mb-0">
                        Join as a listener to participate in the service
                      </p>
                    </div>
                  </div>
                </div>

                {/* Broadcaster Option */}
                <div className="col-md-6">
                  <div className={`card h-100 border-2 cursor-pointer transition-all ${
                    selectedRole === 'broadcaster' 
                      ? 'border-purple bg-purple bg-opacity-10 shadow-lg' 
                      : 'border-light hover-shadow'
                  }`}
                  style={{ borderRadius: '16px', cursor: 'pointer' }}
                  onClick={() => setSelectedRole('broadcaster')}>
                    <div className="card-body text-center p-4">
                      <div className="form-check d-flex justify-content-center mb-3">
                        <input
                          className="form-check-input border-2"
                          type="radio"
                          value="broadcaster"
                          checked={selectedRole === 'broadcaster'}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{ transform: 'scale(1.3)', accentColor: '#6f42c1' }}
                        />
                      </div>
                      <Radio size={36} className={`mb-3 ${
                        selectedRole === 'broadcaster' ? 'text-purple' : 'text-muted'
                      }`} />
                      <h5 className="fw-bold text-purple mb-2">Pastor/Leader</h5>
                      <p className="text-dark opacity-75 mb-0">
                        Lead the service and broadcast to congregation
                      </p>
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
              className={`btn btn-lg w-100 py-3 fw-bold fs-5 ${
                roomId && loggedInUsername ? 'btn-purple' : 'btn-secondary'
              }`}
              style={{ 
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              <Radio size={22} className="me-2" />
              {roomId && loggedInUsername ? 'Join Service Now' : 'Enter Room ID to Continue'}
            </button>
            
            {!roomId && loggedInUsername && (
              <small className="text-muted text-center w-100 mt-3 fs-6">
                Please enter a room ID to continue
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .focus-purple:focus {
          border-color: #6f42c1 !important;
          box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25) !important;
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
          box-shadow: 0 10px 30px rgba(111, 66, 193, 0.4);
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
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          transform: translateY(-3px);
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .spinner-border.text-purple {
          color: #6f42c1 !important;
        }
        
        .alert-warning {
          color: #664d03;
          background-color: #fff3cd;
          border-color: #ffecb5;
        }
        
        .btn-close:focus {
          box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
        }
      `}</style>
    </div>
  );
};

export default JoinRoomModal;