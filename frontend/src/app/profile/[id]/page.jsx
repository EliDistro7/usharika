'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '@/components/dashboard/UserCard'; // Child component to display user data
import { getLoggedInUserId } from '@/hooks/useUser';

const UserPage = ( ) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(getLoggedInUserId());
    const fetchUser = async () => {
      try {
        setLoading(true);
          // console.log('userId ', userId);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError(err.message || 'Kuna kitu hakikwenda sawa, tunalifanyia kazi kuhakikisha kila kitu kipo sawa');
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center mt-4" role="alert">
        Error: {error}
      </div>
    );

  return (
    <div className="container">
    
      {user ? <UserCard user={user} /> : <p className="text-center">hakuna mtumiaji</p>}
    </div>
  );
};

export default UserPage;
