'use client';

import React, { useState, useCallback } from 'react';
import { Table, Button, Alert, Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import AddSessionModal from '@/components/series/AddSessionModal';
import ViewSessionModal from '@/components/series/ViewSessionModal';
import { addSession } from '@/actions/series';
import MusicPlayer from './audio-player/index';
import './SeriesList2.css';

const SeriesList = ({ seriesList, onDeleteSeries }) => {
  // State management
  const [state, setState] = useState({
    showSessionModal: false,
    showViewSessionModal: false,
    selectedSeries: null,
    selectedSession: null,
    playingSeriesId: null,
    errorMessage: '',
    expandedSeries: {}
  });

  // Helper functions
  const seriesHasAudio = useCallback((series) => {
    return series.sessions?.some(session => session.audio?.link);
  }, []);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Event handlers
  const handleOpenSessionModal = useCallback((series) => {
    updateState({
      selectedSeries: series,
      showSessionModal: true
    });
  }, [updateState]);

  const handleCloseSessionModal = useCallback(() => {
    updateState({
      showSessionModal: false,
      selectedSeries: null
    });
  }, [updateState]);

  const handleSessionSubmit = useCallback(async (sessionData) => {
    if (!state.selectedSeries) return;
    
    try {
      await addSession({
        seriesId: state.selectedSeries._id,
        ...sessionData,
      });
      alert('Session added successfully!');
      handleCloseSessionModal();
    } catch (error) {
      updateState({ errorMessage: error.message });
    }
  }, [state.selectedSeries, updateState, handleCloseSessionModal]);

  const handleViewSession = useCallback((session) => {
    updateState({
      selectedSession: session,
      showViewSessionModal: true
    });
  }, [updateState]);

  const handleCloseViewModal = useCallback(() => {
    updateState({
      showViewSessionModal: false,
      selectedSession: null
    });
  }, [updateState]);

  const toggleExpandSeries = useCallback((seriesId) => {
    updateState({
      expandedSeries: {
        ...state.expandedSeries,
        [seriesId]: !state.expandedSeries[seriesId]
      }
    });
  }, [state.expandedSeries, updateState]);

  const handlePlaySeries = useCallback((seriesId) => {
    updateState({ playingSeriesId: seriesId });
  }, [updateState]);

  const handleStopPlayer = useCallback(() => {
    updateState({ playingSeriesId: null });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ errorMessage: '' });
  }, [updateState]);

  // Render components
  const renderSeriesRow = (series) => (
    <tr key={`series-${series._id}`}>
      <td>{series.name}</td>
      <td className="d-none d-md-table-cell">
        {new Date(series.startDate).toLocaleDateString()}
      </td>
      <td className="d-none d-md-table-cell">
        {new Date(series.endDate).toLocaleDateString()}
      </td>
      <td>
        <Button
          variant="warning"
          size="sm"
          className="me-2"
          onClick={() => toggleExpandSeries(series._id)}
        >
          <i className="fa fa-eye"></i> 
          {state.expandedSeries[series._id] ? 'Funga' : 'Fungua'}
        </Button>
        {seriesHasAudio(series) && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePlaySeries(series._id)}
          >
            <i className="fa fa-play"></i> Cheza
          </Button>
        )}
      </td>
    </tr>
  );

  const renderSessionsTable = (sessions) => (
    <Table bordered size="sm" responsive className="custom-table">
      <thead>
        <tr>
          <th>Tarehe</th>
          <th>Kichwa</th>
          <th className="d-none d-sm-table-cell">Audio</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session._id}>
            <td>{new Date(session.date).toLocaleDateString()}</td>
            <td>{session.title}</td>
            <td className="d-none d-sm-table-cell">
              {session.audio?.link ? (
                <>
                  <i className="fa fa-music me-1"></i>
                  <a href={session.audio.link} target="_blank" rel="noopener noreferrer">
                    Sikiliza
                  </a>
                </>
              ) : (
                'N/A'
              )}
            </td>
            <td>
              <Button 
                variant="dark" 
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
  );

  const renderExpandedRow = (series) => (
    <tr key={`expanded-${series._id}`}>
      <td colSpan="4" className="p-0">
        <Collapse in={state.expandedSeries[series._id]}>
          <div className="p-3 bg-light">
            {series.sessions?.length > 0 ? (
              renderSessionsTable(series.sessions)
            ) : (
              <p className="mb-0">Hakuna sessions kwa series hii.</p>
            )}
          </div>
        </Collapse>
      </td>
    </tr>
  );

  const renderSeriesRows = () => (
    seriesList?.length > 0 ? (
      seriesList.flatMap((series) => [
        renderSeriesRow(series),
        renderExpandedRow(series)
      ])
    ) : (
      <tr>
        <td colSpan="4" className="text-center">
          Hakuna series zilizopatikana.
        </td>
      </tr>
    )
  );

  return (
    <>
      {state.errorMessage && (
        <Alert variant="danger" onClose={clearError} dismissible>
          {state.errorMessage}
        </Alert>
      )}

      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>Kichwa</th>
            <th className="d-none d-md-table-cell">Kuanzia</th>
            <th className="d-none d-md-table-cell">Kuisha</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderSeriesRows()}
        </tbody>
      </Table>

      <AddSessionModal
        show={state.showSessionModal}
        handleClose={handleCloseSessionModal}
        onSubmit={handleSessionSubmit}
      />

      <ViewSessionModal
        show={state.showViewSessionModal}
        handleClose={handleCloseViewModal}
        session={state.selectedSession}
      />

      {state.playingSeriesId && (
        <div className="mt-3">
          <Button variant="secondary" size="sm" onClick={handleStopPlayer}>
            Funga Player
          </Button>
          <MusicPlayer seriesId={state.playingSeriesId} />
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