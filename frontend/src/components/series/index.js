'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSingleSeries } from '@/actions/series';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Spinner, 
  Modal, 
  Form
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getUser } from '@/hooks/useUser';

// Import the three separate components
import SeriesHero from './SeriesHero'; // Fixed the import path
import SessionsList from './SessionsList';
import SeriesSidebar from './SeriesSidebar';

const SeriesPage = () => {
  const params = useParams();
  const router = useRouter();
  const [series, setSeries] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showEditSeries, setShowEditSeries] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    content: '',
    date: '',
    audio: { link: '', isFree: true },
    video: { link: '', isFree: true }
  });

  useEffect(() => {
    fetchSeriesData();
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchSeriesData = async () => {
    try {
      setLoading(true);
      
      const response = await getSingleSeries(params.id);
      console.log('single series', response);
        
      setSeries(response);
  
    } catch (error) {
      console.error('Error fetching series:', error);
      toast.error('Error loading series');
    } finally {
      setLoading(false);
    }
  };

  const isCreator = user && series && user.username === series.author;
  const completedSessions = series?.sessions?.filter(session => 
    new Date(session.date) <= new Date()
  ).length || 0;
  const totalSessions = series?.sessions?.length || 0;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/series/${params.id}/sessions`, {
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
        fetchSeriesData();
      } else {
        toast.error('Failed to add session');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Error adding session');
    }
  };

  const handlePlayAudio = (sessionId, audioLink) => {
    if (playingAudio === sessionId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(sessionId);
      // Implement audio player logic here
    }
  };

  const handleShowAddSession = () => {
    setShowAddSession(true);
  };

  const handleShowEditSeries = () => {
    setShowEditSeries(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" className="mb-3" style={{ color: '#6f42c1' }} />
          <p className="text-muted">Loading series...</p>
        </div>
      </Container>
    );
  }

  if (!series) {
    return (
      <Container className="text-center py-5">
        <h3>Series not found</h3>
        <Button variant="primary" onClick={() => router.push('/series')}>
          Back to Series
        </Button>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <SeriesHero
        series={series}
        user={user}
        isCreator={isCreator}
        completedSessions={completedSessions}
        totalSessions={totalSessions}
        progressPercentage={progressPercentage}
        onAddSession={handleShowAddSession}
        onEditSeries={handleShowEditSeries}
      />

      <Container>
        <Row>
       
            {/* Sessions List with seriesId prop */}
            <SessionsList
              sessions={series.sessions}
              isCreator={isCreator}
              user={user}
              playingAudio={playingAudio}
              onAddSession={handleShowAddSession}
              onPlayAudio={handlePlayAudio}
              totalSessions={totalSessions}
              seriesId={params.id} // Pass the seriesId to SessionsList
            />
       
          
   
        </Row>
      </Container>


    </>
  );
};

export default SeriesPage;