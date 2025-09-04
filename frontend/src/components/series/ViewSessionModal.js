'use client';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const ViewSessionModal = ({ show, handleClose, session }) => {
  // Early return if no session data
  if (!session) return null;

  // Memoized formatted data
  const formattedData = useMemo(() => ({
    date: new Date(session.date).toLocaleDateString(),
    hasAudio: session.audio?.link,
    audioStatus: session.audio?.isFree ? 'Free' : 'Paid',
    paidBy: session.audio?.paidBy
  }), [session]);

  // Render functions for better organization
  const renderDetailItem = (label, value, icon = null) => (
    <div key={label} className="flex items-start gap-4 p-4 border-b border-border-light last:border-b-0">
      <div className="flex-shrink-0 w-24">
        <div className="flex items-center gap-2 text-text-secondary font-medium text-sm">
          {icon && <i className={`fa ${icon} text-primary-600`}></i>}
          <span>{label}:</span>
        </div>
      </div>
      <div className="flex-1 text-text-primary">
        <span className="break-words">{value}</span>
      </div>
    </div>
  );

  const renderAudioItem = () => {
    if (!session.audio) return null;

    return (
      <div key="audio" className="flex items-start gap-4 p-4 border-b border-border-light last:border-b-0">
        <div className="flex-shrink-0 w-24">
          <div className="flex items-center gap-2 text-text-secondary font-medium text-sm">
            <i className="fa fa-music text-primary-600"></i>
            <span>Audio:</span>
          </div>
        </div>
        <div className="flex-1">
          {formattedData.hasAudio ? (
            <div className="space-y-2">
              <a 
                href={session.audio.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                <i className="fa fa-play"></i>
                Listen to Audio
              </a>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  session.audio.isFree 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {formattedData.audioStatus}
                </span>
                {formattedData.paidBy && (
                  <span className="text-text-tertiary text-sm">
                    Paid by {formattedData.paidBy}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-text-tertiary italic">No audio available</span>
          )}
        </div>
      </div>
    );
  };

  const sessionDetails = [
    { label: 'Date', value: formattedData.date, icon: 'fa-calendar' },
    { label: 'Title', value: session.title, icon: 'fa-bookmark' },
    { label: 'Content', value: session.content, icon: 'fa-file-text' },
    { label: 'Attendance', value: session.attendanceCount, icon: 'fa-users' }
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-background-50 rounded-2xl shadow-strong w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-primary-gradient p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <i className="fa fa-eye"></i>
              Session Details
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <i className="fa fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="bg-background-50">
            {sessionDetails.map(({ label, value, icon }) => 
              renderDetailItem(label, value, icon)
            )}
            {renderAudioItem()}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background-100 border-t border-border-light px-6 py-4 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <i className="fa fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewSessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  session: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    attendanceCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    audio: PropTypes.shape({
      link: PropTypes.string,
      isFree: PropTypes.bool,
      paidBy: PropTypes.string
    })
  })
};

export default ViewSessionModal;