import React from 'react';
import { Users, Hand } from 'lucide-react';

const ParticipantsSidebar = ({ participants, userRole, socket }) => {
  const connectedParticipants = participants.filter(p => p.isConnected);
  
  const handleManageParticipants = () => {
    // You can implement participant management logic here
    console.log('Manage participants clicked');
    // Example: Open a modal or show additional controls
  };

  const handleKickParticipant = (participantId) => {
    if (socket && userRole === 'broadcaster') {
      socket.emit('kick-participant', {
        participantId,
        roomId: socket.roomId // Assuming roomId is available in socket or pass it as prop
      });
    }
  };

  const handleMuteParticipant = (participantId) => {
    if (socket && userRole === 'broadcaster') {
      socket.emit('mute-participant', {
        participantId,
        roomId: socket.roomId // Assuming roomId is available in socket or pass it as prop
      });
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 text-purple">Participants</h5>
        <span className="badge bg-purple">
          {connectedParticipants.length}
        </span>
      </div>

      {/* Participants List */}
      <div className="flex-grow-1 overflow-auto">
        {participants.map((participant) => (
          <div key={participant.id} className="card mb-2 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <strong className="me-2">{participant.name}</strong>
                    
                    {/* Role Badge */}
                    {participant.role === 'broadcaster' && (
                      <span className="badge bg-danger me-1">Live</span>
                    )}
                    
                    {/* Raised Hand Indicator */}
                    {participant.hasRaisedHand && (
                      <Hand size={14} className="text-warning ms-1" title="Hand raised" />
                    )}
                  </div>
                  
                  {/* Connection Status */}
                  <small className={`text-${participant.isConnected ? 'success' : 'muted'}`}>
                    {participant.isConnected ? 'Connected' : 'Disconnected'}
                  </small>
                  
                  {/* Additional Info */}
                  {participant.isConnected && participant.role === 'listener' && (
                    <div className="mt-1">
                      <small className="text-muted">
                        {participant.isListening ? 'Listening' : 'Not listening'}
                      </small>
                    </div>
                  )}
                </div>
                
                {/* Status Indicator */}
                <div className="d-flex flex-column align-items-end">
                  <div
                    className={`rounded-circle ${participant.isConnected ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: '12px', height: '12px' }}
                    title={participant.isConnected ? 'Online' : 'Offline'}
                  />
                  
                  {/* Broadcaster Controls */}
                  {userRole === 'broadcaster' && participant.role !== 'broadcaster' && participant.isConnected && (
                    <div className="dropdown mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                      >
                        •••
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleMuteParticipant(participant.id)}
                          >
                            Mute
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleKickParticipant(participant.id)}
                          >
                            Remove
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {participants.length === 0 && (
          <div className="text-center text-muted py-4">
            <Users size={48} className="mb-3 opacity-50" />
            <p className="mb-0">No participants yet</p>
            <small>People will appear here when they join</small>
          </div>
        )}
      </div>

      {/* Broadcaster Management Controls */}
      {userRole === 'broadcaster' && (
        <div className="mt-3 border-top pt-3">
          <button 
            className="btn btn-outline-purple btn-sm w-100 mb-2"
            onClick={handleManageParticipants}
          >
            <Users size={16} className="me-1" />
            Manage Participants
          </button>
          
          {/* Quick Stats */}
          <div className="row text-center">
            <div className="col-6">
              <small className="text-muted d-block">Listening</small>
              <strong className="text-success">
                {participants.filter(p => p.isConnected && p.isListening).length}
              </strong>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Hands Raised</small>
              <strong className="text-warning">
                {participants.filter(p => p.hasRaisedHand).length}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Listener Info */}
      {userRole === 'listener' && (
        <div className="mt-3 border-top pt-3">
          <div className="text-center">
            <small className="text-muted">
              You are listening with {connectedParticipants.length - 1} others
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsSidebar;