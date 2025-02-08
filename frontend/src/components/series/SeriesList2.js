

'use client';

import React, { useState } from 'react';
import { Table, Button, Alert, Collapse } from 'react-bootstrap';
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
    <>
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          {errorMessage}
        </Alert>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Kichwa</th>
            <th>Maelezo</th>
            <th>Kuanzia</th>
            <th>Kuisha</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {seriesList && seriesList.length > 0 ? (
            seriesList.map((series) => (
              <React.Fragment key={series._id}>
                <tr>
                  <td>{series.name}</td>
                  <td>{series.description}</td>
                  <td>{new Date(series.startDate).toLocaleDateString()}</td>
                  <td>{new Date(series.endDate).toLocaleDateString()}</td>
                  <td>{series.author}</td>
                  <td>
                    
                    
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => toggleExpandSeries(series._id)}
                    >
                      <i className="fa fa-eye"></i> {expandedSeries[series._id] ? 'Funga' : 'Fungua'} Sessions
                    </Button>
                    {seriesHasAudio(series) && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setPlayingSeriesId(series._id)}
                      >
                        <i className="fa fa-play"></i> Cheza Series
                      </Button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className="p-0">
                    <Collapse in={expandedSeries[series._id]}>
                      <div className="p-3 ">
                        {series.sessions && series.sessions.length > 0 ? (
                          <Table bordered size="sm" responsive>
                            <thead>
                              <tr>
                                <th>Tarehe</th>
                                <th>Kichwa</th>
                                <th>Yaliyomo</th>
                                <th>Mahudhurio</th>
                                <th>Audio</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {series.sessions.map((session) => (
                                <tr key={session._id}>
                                  <td>{new Date(session.date).toLocaleDateString()}</td>
                                  <td>{session.title}</td>
                                  <td>{session.content}</td>
                                  <td>{session.attendanceCount}</td>
                                  <td>
                                    {session.audio && session.audio.link ? (
                                      <>
                                        <i className="fa fa-music me-1"></i>
                                        <a
                                          href={session.audio.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Sikiliza
                                        </a>
                                        <br />
                                        <small>
                                          {session.audio.isFree ? 'Free' : 'Paid'}{' '}
                                          {session.audio.paidBy ? `- Paid by ${session.audio.paidBy}` : ''}
                                        </small>
                                      </>
                                    ) : (
                                      'N/A'
                                    )}
                                  </td>
                                  <td>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleViewSession(session)}
                                    >
                                      <i className="fa fa-eye"></i> Tazama
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p className="mb-0">No sessions available for this series.</p>
                        )}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No series found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

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

      {/* Render MusicPlayer if a series is selected to play */}
      {playingSeriesId && (
        <div className="mt-3">
          <Button variant="secondary" size="sm" onClick={() => setPlayingSeriesId(null)}>
            Close Player
          </Button>
          <MusicPlayer seriesId={playingSeriesId} />
        </div>
      )}
    </>
  );
};

SeriesList.propTypes = {
  seriesList: PropTypes.array.isRequired,
  onDeleteSeries: PropTypes.func.isRequired,
};

export default SeriesList;
