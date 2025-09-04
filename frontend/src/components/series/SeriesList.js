'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddSessionModal from '@/components/series/AddSessionModal'; // adjust the import path as needed
import ViewSessionModal from '@/components/series/ViewSessionModal'; // adjust the import path as needed
import { addSession } from '@/actions/series'; // adjust the import path as needed
import MusicPlayer from './MusicPlayer'; // adjust the import path as needed

const SeriesList = ({ seriesList, onDeleteSeries }) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedSeries, setExpandedSeries] = useState({}); // key: series._id, value: boolean
  const [showViewSessionModal, setShowViewSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [playingSeriesId, setPlayingSeriesId] = useState(null);

  // Trigger the modal for adding a session and set the selected series
  const handleOpenSessionModal = (series) => {
    setSelectedSeries(series);
    setShowSessionModal(true);
  };

  // Toggle the expansion state for showing sessions of a series
  const toggleExpandSeries = (seriesId) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  };

  // Called when the modal form is submitted to add a session
  const handleSessionSubmit = async (sessionData) => {
    if (!selectedSeries) return;
    try {
      // Combine session data with the selected series' ID and author
      await addSession({
        seriesId: selectedSeries._id,
        ...sessionData,
      });
      alert('Session added successfully!');
      setShowSessionModal(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Trigger the view session modal by setting the selected session
  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowViewSessionModal(true);
  };

  // Helper to check if a series has any audio available in its sessions
  const seriesHasAudio = (series) => {
    return series.sessions && series.sessions.some(session => session.audio && session.audio.link);
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
          <div className="flex-shrink-0">
            <i className="fa fa-exclamation-triangle text-error-500"></i>
          </div>
          <div className="flex-1">
            <p className="text-error-700 font-medium">Error</p>
            <p className="text-error-600 text-sm">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="flex-shrink-0 text-error-400 hover:text-error-600 transition-colors"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
      )}

      {/* Series Table */}
      <div className="bg-background-50 rounded-xl shadow-soft border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-200 border-b border-border-default">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Kichwa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Maelezo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Kuanzia</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Kuisha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {seriesList && seriesList.length > 0 ? (
                seriesList.map((series) => (
                  <React.Fragment key={series._id}>
                    <tr className="hover:bg-background-100 transition-colors duration-200">
                      <td className="px-6 py-4 text-text-primary font-medium">{series.name}</td>
                      <td className="px-6 py-4 text-text-secondary max-w-xs truncate">{series.description}</td>
                      <td className="px-6 py-4 text-text-secondary text-sm">{new Date(series.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-text-secondary text-sm">{new Date(series.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-text-secondary">{series.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => onDeleteSeries(series._id, series.author)}
                            className="px-3 py-1.5 bg-error-500 hover:bg-error-600 text-white text-xs font-medium rounded-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                          <button
                            onClick={() => handleOpenSessionModal(series)}
                            className="btn-primary px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1"
                          >
                            <i className="fa fa-plus"></i>
                            <span className="hidden sm:inline">Add Session</span>
                          </button>
                          <button
                            onClick={() => toggleExpandSeries(series._id)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
                          >
                            <i className={`fa ${expandedSeries[series._id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            <span className="hidden sm:inline">{expandedSeries[series._id] ? 'Hide' : 'View'} Sessions</span>
                          </button>
                          {seriesHasAudio(series) && (
                            <button
                              onClick={() => setPlayingSeriesId(series._id)}
                              className="btn-success px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1"
                            >
                              <i className="fa fa-play"></i>
                              <span className="hidden sm:inline">Play Series</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Collapsible Sessions Row */}
                    <tr className={`transition-all duration-300 ease-in-out ${expandedSeries[series._id] ? 'opacity-100' : 'opacity-0 h-0'}`}>
                      <td colSpan="6" className="p-0">
                        {expandedSeries[series._id] && (
                          <div className="bg-background-200 border-t border-border-light animate-slide-down">
                            <div className="p-6">
                              {series.sessions && series.sessions.length > 0 ? (
                                <div className="bg-white rounded-lg shadow-soft overflow-hidden">
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead className="bg-background-100 border-b border-border-light">
                                        <tr>
                                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Date</th>
                                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Title</th>
                                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Content</th>
                                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Attendance</th>
                                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Audio</th>
                                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border-light">
                                        {series.sessions.map((session) => (
                                          <tr key={session._id} className="hover:bg-background-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-text-secondary">{new Date(session.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-sm text-text-primary font-medium">{session.title}</td>
                                            <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">{session.content}</td>
                                            <td className="px-4 py-3 text-sm text-text-secondary">{session.attendanceCount}</td>
                                            <td className="px-4 py-3 text-sm">
                                              {session.audio && session.audio.link ? (
                                                <div className="space-y-1">
                                                  <div className="flex items-center gap-1">
                                                    <i className="fa fa-music text-primary-500"></i>
                                                    <a
                                                      href={session.audio.link}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                                    >
                                                      Listen
                                                    </a>
                                                  </div>
                                                  <div className="text-xs text-text-tertiary">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                      session.audio.isFree 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                      {session.audio.isFree ? 'Free' : 'Paid'}
                                                    </span>
                                                    {session.audio.paidBy && (
                                                      <span className="ml-1">- Paid by {session.audio.paidBy}</span>
                                                    )}
                                                  </div>
                                                </div>
                                              ) : (
                                                <span className="text-text-tertiary">N/A</span>
                                              )}
                                            </td>
                                            <td className="px-4 py-3">
                                              <button
                                                onClick={() => handleViewSession(session)}
                                                className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
                                              >
                                                <i className="fa fa-eye"></i>
                                                <span>View</span>
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="text-text-tertiary mb-2">
                                    <i className="fa fa-calendar-times text-2xl"></i>
                                  </div>
                                  <p className="text-text-secondary">No sessions available for this series.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-text-tertiary mb-2">
                      <i className="fa fa-list text-3xl"></i>
                    </div>
                    <p className="text-text-secondary font-medium">No series found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Music Player */}
      {playingSeriesId && (
        <div className="bg-background-50 rounded-xl shadow-soft border border-border-light p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <i className="fa fa-music text-primary-500"></i>
              Now Playing
            </h3>
            <button
              onClick={() => setPlayingSeriesId(null)}
              className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Close Player
            </button>
          </div>
          <MusicPlayer seriesId={playingSeriesId} />
        </div>
      )}

      {/* Modal for adding a session */}
      <AddSessionModal
        show={showSessionModal}
        handleClose={() => setShowSessionModal(false)}
        onSubmit={handleSessionSubmit}
      />

      {/* Modal for viewing a session */}
      <ViewSessionModal
        show={showViewSessionModal}
        handleClose={() => setShowViewSessionModal(false)}
        session={selectedSession}
      />
    </div>
  );
};

SeriesList.propTypes = {
  seriesList: PropTypes.array.isRequired,
  onDeleteSeries: PropTypes.func.isRequired,
};

export default SeriesList;