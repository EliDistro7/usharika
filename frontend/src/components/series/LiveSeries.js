import React, { useState, useEffect } from 'react';
import { getAllSeries } from '@/actions/series';
import { Calendar, Users, Play, Clock, Star, BookOpen, Heart, Cross } from 'lucide-react';
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
      background: 'linear-gradient(135deg, #8B5A3C 0%, #6B4226 50%, #4A2C17 100%)',
      minHeight: '200px',
      borderRadius: '24px',
      marginBottom: '3rem',
      position: 'relative',
      overflow: 'hidden'
    },
    liveCard: {
      background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #f9f7f4 100%)',
      borderRadius: '24px',
      border: '1px solid rgba(139, 90, 60, 0.08)',
      boxShadow: '0 8px 32px rgba(139, 90, 60, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      overflow: 'hidden',
      position: 'relative'
    },
    headerGradient: {
      background: 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 50%, #8B4513 100%)',
      borderRadius: '24px 24px 0 0',
      position: 'relative',
      overflow: 'hidden'
    },
    liveIndicator: {
      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
      animation: 'gentle-pulse 3s ease-in-out infinite',
      boxShadow: '0 0 12px rgba(255, 215, 0, 0.6)'
    },
    sessionBadge: {
      background: 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 100%)',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(139, 90, 60, 0.3)'
    },
    attendanceBadge: {
      background: 'linear-gradient(135deg, #6B4226 0%, #8B5A3C 100%)',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(107, 66, 38, 0.3)'
    },
    viewButton: {
      background: 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 50%, #8B4513 100%)',
      border: 'none',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(139, 90, 60, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    loadingSpinner: {
      width: '64px',
      height: '64px',
      border: '5px solid rgba(139, 90, 60, 0.1)',
      borderTop: '5px solid #8B5A3C',
      borderRadius: '50%',
      animation: 'spin 1.2s linear infinite'
    },
    decorativePattern: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      opacity: '0.1',
      fontSize: '24px'
    },
    glowEffect: {
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
      borderRadius: '26px',
      zIndex: '-1',
      opacity: '0',
      transition: 'opacity 0.4s ease'
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{ backgroundColor: '#faf9f7', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div style={customStyles.loadingSpinner} className="mx-auto mb-4"></div>
            <h4 className="text-muted fw-light">Inapakia Mafundisho...</h4>
            <p className="small text-muted opacity-75">Subiri kidogo tukukaribishe</p>
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
      <div className="container-fluid py-5" style={{ backgroundColor: '#faf9f7' }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert border-0 shadow-lg p-4" style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%)',
              border: '1px solid rgba(220, 53, 69, 0.1)'
            }}>
              <div className="d-flex align-items-center">
                <div className="alert-icon me-3">
                  <div className="d-flex align-items-center justify-content-center rounded-circle" 
                       style={{ width: '48px', height: '48px', background: 'rgba(220, 53, 69, 0.1)' }}>
                    <i className="fas fa-exclamation-triangle text-danger"></i>
                  </div>
                </div>
                <div>
                  <h5 className="alert-heading mb-2 fw-bold text-danger">Hitilafu ya Kupakia Mahubiri</h5>
                  <p className="mb-0 text-muted">{error}</p>
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
      <div className="container-fluid py-5" style={{ backgroundColor: '#faf9f7', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="p-5">
              <div className="mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle position-relative" 
                     style={{ 
                       width: '120px', 
                       height: '120px', 
                       background: 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 100%)',
                       boxShadow: '0 16px 40px rgba(139, 90, 60, 0.3)'
                     }}>
                  <BookOpen size={48} className="text-white" />
                  <div className="position-absolute" style={{ top: '8px', right: '8px' }}>
                    <Heart size={20} className="text-white opacity-75" />
                  </div>
                </div>
              </div>
              <h2 className="fw-bold mb-4" style={{ color: '#6B4226' }}>
                Hakuna Mahubiri yanayoendelea kwa sasa
              </h2>
              <p className="text-muted lead mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Kwa sasa hakuna mahubiri ya moja kwa moja yanaoendelea. 
                
              </p>
            
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#faf9f7' }}>
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
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(139, 90, 60, 0.25), 0 8px 32px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.querySelector('.glow-effect').style.opacity = '0.6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 90, 60, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.querySelector('.glow-effect').style.opacity = '0';
                }}
              >
                {/* Glow Effect */}
                <div className="glow-effect" style={customStyles.glowEffect}></div>
                
                {/* Decorative Pattern */}
                <div style={customStyles.decorativePattern}>
                  <Cross size={32} style={{ color: '#8B5A3C' }} />
                </div>

                {/* Live Header */}
                <div className="card-header border-0 text-white p-4 position-relative" style={customStyles.headerGradient}>
                  {/* Subtle Pattern Overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="3" cy="3" r="1"/%3E%3Ccircle cx="13" cy="13" r="1"/%3E%3C/g%3E%3C/svg%3E")',
                    opacity: '0.5'
                  }}></div>
                  
                  <div className="position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle me-2" 
                          style={{ width: '14px', height: '14px', ...customStyles.liveIndicator }}
                        ></div>
                        <span className="fw-bold small text-uppercase tracking-wide" style={{ letterSpacing: '1px' }}>
                          MUBASHARA
                        </span>
                      </div>
                      <div className="d-flex align-items-center small bg-white px-3 py-1 rounded-pill">
                        <Clock size={14} className="me-1" />
                        <span className="fw-medium text-black">
                          {daysRemaining > 0 ? `Siku ${daysRemaining} zimebaki` : 'Inaisha hivi karibuni'}
                        </span>
                      </div>
                    </div>
                    <h4 className="card-title fw-bold mb-2 text-truncate" style={{ fontSize: '1.4rem' }}>
                      {series.name}
                    </h4>
                    <p className="card-subtitle mb-0 opacity-90 d-flex align-items-center">
                      <BookOpen size={16} className="me-2" />
                      <span className="fw-medium">{series.group}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                  <p className="text-muted mb-4" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                  }}>
                    {series.description}
                  </p>

                  {/* Statistics */}
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="text-center text-white p-4 rounded-3 position-relative" style={customStyles.attendanceBadge}>
                        <div className="position-absolute top-0 start-0 w-100 h-100 rounded-3" style={{
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
                          backgroundSize: '8px 8px'
                        }}></div>
                        <div className="position-relative">
                          <div className="fw-bold h3 mb-2 d-flex align-items-center justify-content-center">
                            <BookOpen size={24} className="me-2" />
                            {series.sessions?.length || 0}
                          </div>
                          <small className="opacity-90 fw-medium text-uppercase" style={{ letterSpacing: '0.5px' }}>
                            Audio Files
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="d-flex align-items-center text-muted small mb-3 bg-light bg-opacity-50 p-3 rounded-3">
                    <Calendar size={16} className="me-2 text-primary" />
                    <span className="fw-medium">
                      {formatDate(series.startDate)} - {formatDate(series.endDate)}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <Link href={`/series/${series._id}`} className="text-decoration-none">
                    <button 
                      className="btn text-white fw-bold py-3 w-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                      style={customStyles.viewButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 90, 60, 0.4), 0 4px 16px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 90, 60, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {/* Button Shine Effect */}
                      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s ease'
                      }}></div>
                      
                      <Play size={20} className="me-2" />
                      <span className="text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        Sikiliza Mahubiri
                      </span>
                      <Heart size={16} className="ms-2 opacity-75" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .card {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .btn:hover .position-absolute {
          transform: translateX(100%) !important;
        }
        
        .tracking-wide {
          letter-spacing: 1px;
        }
        
        /* Smooth hover animations */
        .card:hover .decorative-pattern {
          opacity: 0.3;
          transform: rotate(10deg) scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default LiveSeries;