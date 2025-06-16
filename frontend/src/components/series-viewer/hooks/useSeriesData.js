// hooks/useSeriesData.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useSeriesData = (seriesId) => {
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSeriesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/series/${seriesId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
        return data;
      } else {
        toast.error('Failed to load series');
        return null;
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      toast.error('Error loading series');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seriesId) {
      fetchSeriesData();
    }
  }, [seriesId]);

  return { series, loading, refetchSeries: fetchSeriesData };
};