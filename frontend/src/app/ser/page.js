'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAllSeries, getSingleSeries } from '@/actions/series';
import { formatRoleName } from '@/actions/utils';
import { 
  Search, 
  XCircle, 
  Funnel, 
  X, 
  Calendar, 
  Person, 
  PlayCircle, 
  PauseCircle,
  SkipBackwardFill,
  SkipForwardFill,
  Lock,
  Film,
  MusicNote,
  List
} from 'react-bootstrap-icons';

const LoadingSpinner = () => (
  <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sw-TZ', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
};

// Compact Audio Player for Series
const SeriesAudioPlayer = ({ sessions }) => {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioSessions = sessions.filter(s => s.audio?.link && s.audio?.isFree !== false);
  const currentSession = audioSessions[currentIndex];

  if (!currentSession) return null;

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < audioSessions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleSelectTrack = (index) => {
    setCurrentIndex(index);
    setShowPlaylist(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-border-light p-6 shadow-soft mb-8">
      <audio
        ref={audioRef}
        src={currentSession.audio.link}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => currentIndex < audioSessions.length - 1 && handleNext()}
      />

      {/* Now Playing */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-16 h-16 bg-primary-gradient rounded-xl flex items-center justify-center">
          <MusicNote size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">{currentSession.title}</h3>
          <p className="text-sm text-text-tertiary">
            Kipindi {currentIndex + 1} kati ya {audioSessions.length}
          </p>
        </div>
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="p-2 hover:bg-background-200 rounded-lg transition-colors"
        >
          <List size={20} className="text-text-secondary" />
        </button>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="mb-4 max-h-60 overflow-y-auto bg-background-100 rounded-xl">
          {audioSessions.map((session, idx) => (
            <button
              key={session._id}
              onClick={() => handleSelectTrack(idx)}
              className={`w-full text-left p-3 border-b border-border-light last:border-0 hover:bg-background-200 transition-colors ${
                idx === currentIndex ? 'bg-primary-100 text-primary-700' : ''
              }`}
            >
              <div className="font-medium text-sm">{session.title}</div>
              <div className="text-xs text-text-tertiary">{formatDate(session.date)}</div>
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg hover:bg-background-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipBackwardFill size={18} className="text-text-primary" />
        </button>

        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-primary"
        >
          {isPlaying ? (
            <PauseCircle size={24} className="text-white" />
          ) : (
            <PlayCircle size={24} className="text-white ml-0.5" />
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex >= audioSessions.length - 1}
          className="p-2 rounded-lg hover:bg-background-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipForwardFill size={18} className="text-text-primary" />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={(e) => {
              const newTime = (e.target.value / 100) * duration;
              audioRef.current.currentTime = newTime;
            }}
            className="w-full h-1.5 bg-background-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Session Item
const SessionItem = ({ session, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasAudio = session.audio?.link && session.audio?.isFree !== false;
  const hasVideo = session.video?.link && session.video?.isFree !== false;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border-light overflow-hidden hover:shadow-soft transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-background-100 transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-semibold text-sm">
          {index + 1}
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <h4 className="font-medium text-text-primary text-sm truncate">{session.title}</h4>
          <p className="text-xs text-text-tertiary">{formatDate(session.date)}</p>
        </div>

        <div className="flex items-center gap-1">
          {hasAudio && <MusicNote size={14} className="text-success-600" />}
          {hasVideo && <Film size={14} className="text-success-600" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <p className="text-sm text-text-secondary leading-relaxed mb-3">{session.content}</p>
          
          {hasVideo && (
            <video
              src={session.video.link}
              controls
              className="w-full rounded-lg border border-border-light"
            />
          )}
        </div>
      )}
    </div>
  );
};

// Compact Series Card
const SeriesCard = ({ series, onClick }) => {
  const sessionCount = series.sessions?.length || 0;
  const hasAudio = series.sessions?.some(s => s.audio?.link);
  
  return (
    <div
      onClick={onClick}
      className="group bg-white/80 backdrop-blur-sm rounded-xl border border-border-light shadow-soft overflow-hidden hover:shadow-primary transition-all duration-300 cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-display font-bold text-text-primary group-hover:text-primary-700 transition-colors line-clamp-2">
            {series.name}
          </h3>
          {hasAudio && (
            <div className="flex-shrink-0 p-2 bg-success-100 rounded-lg">
              <MusicNote size={16} className="text-success-600" />
            </div>
          )}
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
          {series.description}
        </p>

        <div className="flex items-center justify-between text-xs">
        
        
        </div>
      </div>
    </div>
  );
};

// Series Detail Modal with Hero
const SeriesDetailModal = ({ series, onClose }) => {
  if (!series) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full h-full bg-white overflow-hidden" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-soft"
        >
          <X size={20} />
        </button>

        <div className="h-full overflow-y-auto">
          {/* Hero Section with Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end p-6 md:p-8">
              <div className="max-w-4xl w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-3">
                  <Calendar size={12} />
                  <span>{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                  {series.name}
                </h1>

                <p className="text-white/90 leading-relaxed mb-4 line-clamp-2">
                  {series.description}
                </p>

               
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Audio Player */}
            {series.sessions?.some(s => s.audio?.link) && (
              <SeriesAudioPlayer sessions={series.sessions} />
            )}

            {/* Sessions */}
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">
              Vipindi
            </h2>

            {series.sessions && series.sessions.length > 0 ? (
              <div className="space-y-2">
                {series.sessions.map((session, index) => (
                  <SessionItem
                    key={session._id || index}
                    session={session}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MusicNote size={32} className="text-text-tertiary mx-auto mb-2" />
                <p className="text-text-secondary">Hakuna vipindi kwa sasa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component with Hero
const SeriesViewer = () => {
  const [allSeries, setAllSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchAllSeries();
  }, []);

  const fetchAllSeries = async () => {
    try {
      setLoading(true);
      const response = await getAllSeries({ author: "" });
      setAllSeries(response || []);
      setFilteredSeries(response || []);
    } catch (err) {
      setError(err.message || "Tatizo la mtandao.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allSeries];

    if (selectedAuthor !== "All") {
      filtered = filtered.filter(series => 
        series.author.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(series =>
        series.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        series.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    setFilteredSeries(filtered);
  }, [allSeries, selectedAuthor, searchQuery]);

  const handleSeriesClick = async (series) => {
    try {
      const fullSeries = await getSingleSeries(series._id);
      setSelectedSeries(fullSeries);
    } catch (err) {
      console.error("Error loading series:", err);
    }
  };

  const uniqueAuthors = [...new Set(allSeries.map(s => s.author))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <LoadingSpinner />
        <p className="mt-4 text-text-secondary">Tunapakia mafundisho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-error-50 rounded-xl border border-error-200">
        <p className="text-error-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-background-100 to-peaceful-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <MusicNote size={32} />
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Mafundisho
            </h1>

            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Sikiliza na ujifunze neno la Mungu kupitia mafundisho yetu
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <div className="flex items-center gap-2">
            {isSearchOpen && (
              <div className="animate-slide-down flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-border-light shadow-soft px-3 py-2">
                <input
                  type="text"
                  className="w-48 sm:w-64 px-2 py-1 text-sm bg-transparent border-0 outline-none placeholder-text-muted text-text-primary"
                  placeholder="Tafuta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <XCircle size={16} className="text-text-tertiary" />
                  </button>
                )}
              </div>
            )}
            
            <button
              className={`p-3 rounded-xl transition-all ${
                isSearchOpen
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/80 backdrop-blur-sm border-2 border-border-light text-text-primary hover:border-primary-300'
              }`}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={18} />
            </button>
          </div>

          <div className="relative">
            <button
              className={`p-3 rounded-xl transition-all ${
                selectedAuthor !== "All"
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/80 backdrop-blur-sm border-2 border-border-light text-text-primary hover:border-primary-300'
              }`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Funnel size={18} />
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl border-2 border-border-light shadow-primary-lg z-50 overflow-hidden animate-slide-down">
                  <div className="p-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                        selectedAuthor === "All" 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-text-secondary hover:bg-background-200'
                      }`}
                      onClick={() => {
                        setSelectedAuthor("All");
                        setIsFilterOpen(false);
                      }}
                    >
                      Wahubiri Wote
                    </button>
                    {uniqueAuthors.map((author) => (
                      <button
                        key={author}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                          selectedAuthor === author 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'text-text-secondary hover:bg-background-200'
                        }`}
                        onClick={() => {
                          setSelectedAuthor(author);
                          setIsFilterOpen(false);
                        }}
                      >
                        {formatRoleName(author)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Series Grid - More Compact */}
        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSeries.map((series, index) => (
              <div
                key={series._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <SeriesCard
                  series={series}
                  onClick={() => handleSeriesClick(series)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={40} className="text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary">Hakuna matokeo yaliyopatikana</p>
          </div>
        )}
      </div>

      {selectedSeries && (
        <SeriesDetailModal
          series={selectedSeries}
          onClose={() => setSelectedSeries(null)}
        />
      )}
    </div>
  );
};

export default SeriesViewer;