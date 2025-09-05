'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSingleSeries } from '@/actions/series';
import { toast } from 'react-toastify';
import { getUser } from '@/hooks/useUser';

// Import the three separate components
import SeriesHero from './SeriesHero';
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary">Loading series...</h3>
            <p className="text-text-secondary">Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  // Series not found state
  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fa fa-exclamation-triangle text-2xl text-error-500"></i>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Series not found</h3>
            <p className="text-text-secondary max-w-md">
              The series you're looking for might have been removed or doesn't exist.
            </p>
          </div>
          <button
            onClick={() => router.push('/series')}
            className="btn-primary px-6 py-3 rounded-lg font-medium text-white shadow-primary hover:shadow-primary-lg transform transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <i className="fa fa-arrow-left"></i>
            Back to Series
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sessions List - Main Content */}
          <div className="lg:col-span-8">
            <SessionsList
              sessions={series.sessions}
              isCreator={isCreator}
              user={user}
              playingAudio={playingAudio}
              onAddSession={handleShowAddSession}
              onPlayAudio={handlePlayAudio}
              totalSessions={totalSessions}
              seriesId={params.id}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <SeriesSidebar
                series={series}
                user={user}
                isCreator={isCreator}
                completedSessions={completedSessions}
                totalSessions={totalSessions}
                progressPercentage={progressPercentage}
                onAddSession={handleShowAddSession}
                onEditSeries={handleShowEditSeries}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-background-50 rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-primary-gradient p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <i className="fa fa-plus-circle"></i>
                  Add New Session
                </h2>
                <button
                  onClick={() => setShowAddSession(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleAddSession} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="sessionTitle" className=" text-sm font-semibold text-text-primary flex items-center gap-2">
                    <i className="fa fa-heading text-primary-600"></i>
                    Title
                  </label>
                  <input
                    id="sessionTitle"
                    type="text"
                    placeholder="Enter session title"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label htmlFor="sessionContent" className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                    <i className="fa fa-file-text text-primary-600"></i>
                    Content
                  </label>
                  <textarea
                    id="sessionContent"
                    rows={4}
                    placeholder="Enter session content"
                    value={newSession.content}
                    onChange={(e) => setNewSession({ ...newSession, content: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label htmlFor="sessionDate" className=" text-sm font-semibold text-text-primary flex items-center gap-2">
                    <i className="fa fa-calendar text-primary-600"></i>
                    Date
                  </label>
                  <input
                    id="sessionDate"
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>

                {/* Audio Link */}
                <div className="space-y-2">
                  <label htmlFor="audioLink" className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                    <i className="fa fa-music text-primary-600"></i>
                    Audio Link (Optional)
                  </label>
                  <input
                    id="audioLink"
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={newSession.audio.link}
                    onChange={(e) => setNewSession({ 
                      ...newSession, 
                      audio: { ...newSession.audio, link: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>

                {/* Audio Options */}
                <div className="flex items-center gap-3">
                  <input
                    id="audioIsFree"
                    type="checkbox"
                    checked={newSession.audio.isFree}
                    onChange={(e) => setNewSession({ 
                      ...newSession, 
                      audio: { ...newSession.audio, isFree: e.target.checked }
                    })}
                    className="w-5 h-5 text-primary-600 bg-background-50 border-border-default rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="audioIsFree" className="text-sm font-medium text-text-primary cursor-pointer">
                    Free Audio
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
                  <button
                    type="button"
                    onClick={() => setShowAddSession(false)}
                    className="px-6 py-3 border border-border-medium text-text-secondary hover:bg-background-100 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <i className="fa fa-times"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-3 rounded-lg font-medium text-white shadow-primary hover:shadow-primary-lg transform transition-all duration-300 flex items-center gap-2"
                  >
                    <i className="fa fa-save"></i>
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesPage;