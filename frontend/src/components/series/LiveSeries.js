import React, { useState, useEffect } from 'react';
import { getAllSeries } from '@/actions/series';
import { Calendar, Users, Play, Clock, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';


const LiveSeries = () => {
  const [liveSeries, setLiveSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveSeries = async () => {
      try {
        setLoading(true);
        // Fetch all series without author filter
        const allSeries = await getAllSeries({});
        
        // Get current date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
        // Filter for live series (started but not finished)
        const filteredLiveSeries = allSeries.filter(series => {
          const startDate = new Date(series.startDate);
          const endDate = new Date(series.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          
          return startDate <= currentDate && endDate >= currentDate;
        });
        
        setLiveSeries(filteredLiveSeries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSeries();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sw-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const customStyles = {
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '200px',
      borderRadius: '20px',
      marginBottom: '3rem'
    },
    liveCard: {
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      overflow: 'hidden'
    },
    liveCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)'
    },
    headerGradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px 20px 0 0'
    },
    liveIndicator: {
      background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
      animation: 'pulse 2s infinite'
    },
    sessionBadge: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      borderRadius: '15px'
    },
    attendanceBadge: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: '15px'
    },
    viewButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '15px',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
      transition: 'all 0.3s ease'
    },
    loadingSpinner: {
      width: '60px',
      height: '60px',
      border: '4px solid rgba(102, 126, 234, 0.2)',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div style={customStyles.loadingSpinner} className="mx-auto mb-3"></div>
            <h4 className="text-muted">Inapakia Mafundisho...</h4>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger border-0 shadow-lg" style={{ borderRadius: '15px' }}>
              <div className="d-flex align-items-center">
                <div className="alert-icon me-3">
                  <i className="fas fa-exclamation-triangle fa-2x"></i>
                </div>
                <div>
                  <h5 className="alert-heading mb-1">Hitilafu ya Kupakia Mahubiri</h5>
                  <p className="mb-0 small">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (liveSeries.length === 0) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="p-5">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light" 
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Play size={40} className="text-white" />
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-3">Hakuna Mahubiri yanayoendelea kwa sasa</h3>
              <p className="text-muted lead">Kwa sasa hakuna mahubiri ya moja kwa moja yanaoendelea. Rudi baadaye kwa maudhui mapya!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9ff' }}>
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center text-white p-5" style={customStyles.heroSection}>
            <div className="mb-3">
              <Star size={48} className="text-warning mb-3" />
            </div>
            <h1 className="display-4 fw-bold mb-3">Mfululizo wa Moja kwa Moja</h1>
            <div className="mx-auto mb-3" style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
            <p className="lead mb-0">Pata kusikiliza mahubiri yanayoendelea sasa ili ujifunze Neno la Mungu</p>
            <div className="mt-4">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                <Clock size={16} className="me-2" />
                Mfululizo {liveSeries.length} wa Moja kwa Moja Sasa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Series Grid */}
      <div className="row g-4 mb-5">
        {liveSeries.map((series, index) => {
          const daysRemaining = calculateDaysRemaining(series.endDate);
          
          return (
            <div key={series._id} className="col-lg-4 col-md-6 col-12">
              <div 
                className="card h-100 border-0 position-relative"
                style={customStyles.liveCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.1)';
                }}
              >
                {/* Live Header */}
                <div className="card-header border-0 text-white p-4" style={customStyles.headerGradient}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-2" 
                        style={{ width: '12px', height: '12px', ...customStyles.liveIndicator }}
                      ></div>
                      <span className="fw-bold small">MUBASHARA</span>
                    </div>
                    <div className="d-flex align-items-center small">
                      <Clock size={14} className="me-1" />
                      <span>{daysRemaining > 0 ? `Siku ${daysRemaining} zimebaki` : 'Inaisha hivi karibuni'}</span>
                    </div>
                  </div>
                  <h4 className="card-title fw-bold mb-2 text-truncate">{series.name}</h4>
                  <p className="card-subtitle mb-0 opacity-75">
                    <BookOpen size={16} className="me-1" />
                    {series.group}
                  </p>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                  <p className="text-muted mb-4" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {series.description}
                  </p>

                  {/* Statistics */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="text-center text-white p-3 rounded-3" style={customStyles.sessionBadge}>
                        <div className="fw-bold h4 mb-1">{series.sessions?.length || 0}</div>
                        <small className="opacity-90">Jumla</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center text-white p-3 rounded-3" style={customStyles.attendanceBadge}>
                        <div className="fw-bold h4 mb-1 d-flex align-items-center justify-content-center">
                          <Users size={20} className="me-1" />
                          {series.totalAttendance || 0}
                        </div>
                        <small className="opacity-90">Mahudhurio</small>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="d-flex align-items-center text-muted small mb-3">
                    <Calendar size={16} className="me-2" />
                    <span>{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
                  </div>

                  {/* Author */}
                  <div className="text-muted small mb-4">
                    <strong>Mwalimu:</strong> {series.author}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <Link href={`/series/${series._id}`} className="text-decoration-none">
                    <button 
                      className="btn text-white fw-bold py-3 w-100 d-flex align-items-center justify-content-center"
                      style={customStyles.viewButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      <Play size={20} className="me-2" />
                      <span>Chunguza Mfululizo</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="row">
        <div className="col-12">
          <div className="text-center p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="text-white">
              <h5 className="fw-bold mb-2">
                <Star size={20} className="me-2 text-warning" />
                Mfululizo {liveSeries.length} wa Moja kwa Moja Unapatikana
              </h5>
              <p className="mb-0 opacity-75">Jiunge na maelfu ya wanafunzi katika mfululizo wetu wa kila siku</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .btn:hover {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LiveSeries;