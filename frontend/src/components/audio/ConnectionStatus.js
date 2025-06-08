import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = ({ socketConnected, connectionQuality }) => {
  const getStatusColor = () => {
    if (!socketConnected) return 'danger';
    if (connectionQuality === 'excellent') return 'success';
    if (connectionQuality === 'good') return 'success';
    if (connectionQuality === 'fair') return 'warning';
    return 'danger';
  };

  const getStatusText = () => {
    if (!socketConnected) return 'disconnected';
    return connectionQuality || 'connected';
  };

  return (
    <span className={`badge bg-${getStatusColor()}`}>
      {socketConnected ? (
        <Wifi size={16} className="me-1" />
      ) : (
        <WifiOff size={16} className="me-1" />
      )}
      {getStatusText()}
    </span>
  );
};

export default ConnectionStatus;