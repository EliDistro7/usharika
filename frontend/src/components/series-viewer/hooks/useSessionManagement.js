// hooks/useSessionManagement.js
import { useState } from 'react';
import { toast } from 'react-toastify';

export const useSessionManagement = (seriesId, refetchSeries) => {
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    content: '',
    date: '',
    audio: { link: '', isFree: true },
    video: { link: '', isFree: true }
  });

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/series/${seriesId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession)
      });

      if (response.ok) {
        toast.success('Session added successfully!');
        setShowAddSession(false);
        setNewSession({
          title: '', content: '', date: '',
          audio: { link: '', isFree: true },
          video: { link: '', isFree: true }
        });
        refetchSeries();
      } else {
        toast.error('Failed to add session');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Error adding session');
    }
  };

  return {
    showAddSession,
    setShowAddSession,
    newSession,
    setNewSession,
    handleAddSession
  };
};
