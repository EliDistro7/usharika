'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Headphones, 
  Edit3, 
  Plus, 
  MoreVertical,
  Video,
  BookOpen,
  Lock,
  CheckCircle,
  X
} from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import ShareButton from '@/components/ShareButton';

const SessionsList = ({ 
  sessions, 
  isCreator, 
  user, 
  onAddSession, 
  totalSessions,
  seriesId,
  seriesTitle
}) => {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSessionStatus = (sessionDate) => {
    const today = new Date();
    const session = new Date(sessionDate);
    
    if (session < today) return 'completed';
    if (session.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  };

  const hasAudioSessions = sessions?.some(session => 
    session.audio?.link && (session.audio.isFree || user)
  );

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/series/${seriesId}`;
  const shareTitle = `${seriesTitle} - KKKT YOMBO Series`;

  const colors = {
    primary: '#6f42c1',
    surface: 'white',
    text: '#333',
    accent: '#b8860b',
    background: '#f8f9fa'
  };

  return (
    <>
      {/* Sessions Card */}
      <div className="bg-white rounded-xl shadow-soft border border-border-light mb-6 overflow-hidden">
        <div className="bg-white border-b-2 border-primary-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <h4 className="flex items-center text-xl font-semibold text-text-primary">
              <Calendar size={24} className="mr-3 text-primary-600" />
              Sessions ({totalSessions})
            </h4>
            <div className="flex gap-3">
              {hasAudioSessions && (
                <button
                  onClick={() => setShowMusicPlayer(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-success-600 border border-success-300 rounded-lg hover:bg-success-50 transition-colors duration-200"
                >
                  <Headphones size={16} />
                  Audio Player
                </button>
              )}
              {isCreator && (
                <button
                  onClick={onAddSession}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                >
                  <Plus size={16} />
                  Add Session
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-border-light">
          {sessions?.length > 0 ? (
            sessions
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((session, index) => {
                const status = getSessionStatus(session.date);
                const statusColors = {
                  completed: 'border-success-500 bg-success-50',
                  today: 'border-primary-500 bg-primary-50',
                  upcoming: 'border-border-light bg-white'
                };

                return (
                  <div
                    key={session._id}
                    className={`p-6 border-l-4 ${statusColors[status]} hover:bg-background-100 transition-colors duration-200`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="text-lg font-semibold text-text-primary">{session.title}</h5>
                          {status === 'completed' && (
                            <CheckCircle size={18} className="text-success-500" />
                          )}
                          {status === 'today' && (
                            <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full animate-pulse-soft">
                              Today
                            </span>
                          )}
                          {status === 'upcoming' && (
                            <span className="px-3 py-1 bg-text-tertiary text-white text-sm font-medium rounded-full">
                              Upcoming
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-text-secondary mb-3">
                          <Clock size={16} className="mr-2" />
                          {formatDate(session.date)}
                        </div>
                        
                        <p className="text-text-secondary mb-3 text-sm">{session.content}</p>
                        
                        {session.attendanceCount > 0 && (
                          <div className="flex items-center text-text-tertiary text-sm">
                            <Users size={16} className="mr-2" />
                            {session.attendanceCount} attended
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Media Controls */}
                        <div className="flex gap-2">
                          {session.audio?.link && (
                            <button
                              onClick={() => setShowMusicPlayer(true)}
                              disabled={!session.audio.isFree && !user}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                session.audio.isFree 
                                  ? 'text-success-600 border border-success-300 hover:bg-success-50' 
                                  : 'text-warning-600 border border-warning-300 hover:bg-warning-50'
                              } ${!session.audio.isFree && !user ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Headphones size={16} />
                              Audio
                              {!session.audio.isFree && <Lock size={12} />}
                            </button>
                          )}
                          
                          {session.video?.link && (
                            <button
                              disabled={!session.video.isFree && !user}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                session.video.isFree 
                                  ? 'text-blue-600 border border-blue-300 hover:bg-blue-50' 
                                  : 'text-warning-600 border border-warning-300 hover:bg-warning-50'
                              } ${!session.video.isFree && !user ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Video size={16} />
                              Video
                              {!session.video.isFree && <Lock size={12} />}
                            </button>
                          )}
                        </div>

                        {/* Dropdown Menu */}
                        {isCreator && (
                          <div className="relative">
                            <button
                              onClick={() => setDropdownOpen(dropdownOpen === session._id ? null : session._id)}
                              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-background-200 rounded-lg transition-colors duration-200"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {dropdownOpen === session._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-border-light rounded-lg shadow-medium z-20">
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-background-100 flex items-center gap-2">
                                  <Edit3 size={14} />
                                  Edit Session
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2">
                                  Delete Session
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-text-muted mx-auto mb-4" />
              <h5 className="text-text-secondary mb-2">No sessions yet</h5>
              <p className="text-text-tertiary mb-4">Sessions will appear here as they are added.</p>
              {isCreator && (
                <button
                  onClick={onAddSession}
                  className="btn-primary px-6 py-3 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300 shadow-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Add First Session
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Music Player Modal */}
      {showMusicPlayer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 backdrop-blur-sm">
          <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-900 border-b-2 border-purple-700 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <Headphones size={28} className="mr-3 text-purple-400 animate-gentle-float" />
                <h2 className="text-xl font-semibold text-white">KKKT YOMBO Studios</h2>
              </div>
              <div className="flex items-center gap-3">
                <ShareButton url={shareUrl} title={shareTitle} colors={colors} />
                <button
                  onClick={() => setShowMusicPlayer(false)}
                  className="w-12 h-12 bg-purple-800 hover:bg-purple-600 border border-purple-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Player Content */}
            <div className="flex-1 overflow-hidden p-4">
              {seriesId && <MusicPlayer seriesId={seriesId} />}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setDropdownOpen(null)}
        />
      )}
    </>
  );
};

export default SessionsList;