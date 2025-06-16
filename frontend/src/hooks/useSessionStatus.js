// hooks/useSessionStatus.js
import { useState, useEffect } from 'react';
import { useHydrationSafe } from './useHydrationSafe';

export const useSessionStatus = (sessionDate) => {
  const isHydrated = useHydrationSafe();
  const [status, setStatus] = useState('upcoming');
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (isHydrated && sessionDate) {
      // Calculate status
      const today = new Date();
      const session = new Date(sessionDate);
      
      // Normalize to UTC to avoid timezone issues
      const todayUTC = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const sessionUTC = new Date(session.getFullYear(), session.getMonth(), session.getDate());
      
      let newStatus = 'upcoming';
      if (sessionUTC < todayUTC) {
        newStatus = 'completed';
      } else if (sessionUTC.getTime() === todayUTC.getTime()) {
        newStatus = 'today';
      }
      
      setStatus(newStatus);

      // Format date
      const formatted = session.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setFormattedDate(formatted);
    }
  }, [isHydrated, sessionDate]);

  return { status, formattedDate, isHydrated };
};