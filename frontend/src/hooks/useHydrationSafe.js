// hooks/useHydrationSafe.js
import { useState, useEffect } from 'react';

export const useHydrationSafe = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

