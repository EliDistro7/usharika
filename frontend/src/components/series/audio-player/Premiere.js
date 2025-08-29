import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Share2, Download, Heart, Clock, Users } from 'lucide-react';

const SermonAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [listeners, setListeners] = useState(127);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Sample sermon data - replace with your actual data
  const sermons = [
    {
      id: 1,
      title: "Imani na Matumaini",
      preacher: "Mchungaji John Doe",
      date: "2024-12-15",
      duration: "45:30",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Replace with actual URL
      description: "Mafundisho kuhusu imani na jinsi ya kuwa na matumaini katika kipindi cha ugumu"
    },
    {
      id: 2,
      title: "Upendo wa Mungu",
      preacher: "Mchungaji Jane Smith", 
      date: "2024-12-08",
      duration: "38:45",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Replace with actual URL
      description: "Kujifunza kuhusu upendo wa Mungu na jinsi wa kuuonyesha kwa wengine"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentTrack]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % sermons.length;
    setCurrentTrack(next);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    const prev = currentTrack === 0 ? sermons.length - 1 : currentTrack - 1;
    setCurrentTrack(prev);
    setIsPlaying(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sermons[currentTrack].title,
        text: sermons[currentTrack].description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const currentSermon = sermons[currentTrack];

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* Main Player Card */}
          <div className="card shadow-lg border-0 mb-4" 
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 borderRadius: '20px'
               }}>
            <div className="card-body p-4 text-white">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Live Premiere</h6>
                    <small className="opacity-75">{listeners} listening now</small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-light btn-sm rounded-pill"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart 
                      size={16} 
                      fill={isLiked ? 'currentColor' : 'none'} 
                    />
                  </button>
                  <button 
                    className="btn btn-outline-light btn-sm rounded-pill"
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                  </button>
                  <button className="btn btn-outline-light btn-sm rounded-pill">
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="text-center mb-4">
                <h3 className="fw-bold mb-2">{currentSermon.title}</h3>
                <p className="mb-1 opacity-75">{currentSermon.preacher}</p>
                <small className="opacity-75">
                  <Clock size={14} className="me-1" />
                  {currentSermon.date} • {currentSermon.duration}
                </small>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div 
                  ref={progressRef}
                  className="bg-white bg-opacity-20 rounded-pill position-relative"
                  style={{ height: '6px', cursor: 'pointer' }}
                  onClick={handleProgressClick}
                >
                  <div 
                    className="bg-white rounded-pill h-100 position-relative"
                    style={{ 
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                      transition: 'width 0.1s ease'
                    }}
                  >
                    <div 
                      className="position-absolute bg-white rounded-circle"
                      style={{
                        width: '12px',
                        height: '12px',
                        right: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="opacity-75">{formatTime(currentTime)}</small>
                  <small className="opacity-75">{formatTime(duration)}</small>
                </div>
              </div>

              {/* Controls */}
              <div className="d-flex justify-content-center align-items-center gap-3">
                <button 
                  className="btn btn-outline-light rounded-circle p-2"
                  onClick={prevTrack}
                >
                  <SkipBack size={20} />
                </button>
                
                <button 
                  className="btn btn-light rounded-circle p-3 d-flex align-items-center justify-content-center"
                  onClick={togglePlayPause}
                  style={{ width: '60px', height: '60px' }}
                >
                  {isPlaying ? <Pause size={24} className="text-purple" /> : <Play size={24} className="text-purple" />}
                </button>
                
                <button 
                  className="btn btn-outline-light rounded-circle p-2"
                  onClick={nextTrack}
                >
                  <SkipForward size={20} />
                </button>
              </div>

              {/* Volume Control */}
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Volume2 size={16} className="me-2" />
                <input 
                  type="range" 
                  className="form-range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                    }
                  }}
                  style={{ width: '100px', accentColor: 'white' }}
                />
              </div>

              <audio ref={audioRef} src={currentSermon.audioUrl} />
            </div>
          </div>

          {/* Description Card */}
          <div className="card shadow border-0 mb-4" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h5 className="card-title text-purple fw-bold mb-3">About This Sermon</h5>
              <p className="card-text text-muted">{currentSermon.description}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-purple bg-opacity-10 rounded-circle p-2 me-3">
                      <Users size={16} className="text-purple" />
                    </div>
                    <div>
                      <small className="text-muted">Preacher</small>
                      <div className="fw-semibold">{currentSermon.preacher}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-purple bg-opacity-10 rounded-circle p-2 me-3">
                      <Clock size={16} className="text-purple" />
                    </div>
                    <div>
                      <small className="text-muted">Date</small>
                      <div className="fw-semibold">{currentSermon.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h5 className="card-title text-purple fw-bold mb-3">Recent Sermons</h5>
              <div className="list-group list-group-flush">
                {sermons.map((sermon, index) => (
                  <div 
                    key={sermon.id}
                    className={`list-group-item list-group-item-action border-0 rounded mb-2 ${
                      index === currentTrack ? 'bg-purple bg-opacity-10 border-start border-purple border-3' : ''
                    }`}
                    onClick={() => {
                      setCurrentTrack(index);
                      setIsPlaying(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-semibold">{sermon.title}</h6>
                        <small className="text-muted">{sermon.preacher} • {sermon.date}</small>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">{sermon.duration}</small>
                        {index === currentTrack && isPlaying && (
                          <div className="mt-1">
                            <small className="text-purple fw-bold">Now Playing</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-purple { color: #6f42c1 !important; }
        .bg-purple { background-color: #6f42c1 !important; }
        .border-purple { border-color: #6f42c1 !important; }
        .btn-outline-light:hover { background-color: rgba(255,255,255,0.2) !important; }
        .form-range::-webkit-slider-thumb { background-color: white !important; }
        .form-range::-moz-range-thumb { background-color: white !important; }
      `}</style>
    </div>
  );
};

export default SermonAudioPlayer;