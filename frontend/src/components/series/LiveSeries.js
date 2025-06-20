import React, { useState, useEffect } from 'react';
import { getAllSeries } from '@/actions/series';
import { Play, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { formatRoleName2 } from '@/actions/utils';

const LiveSeries = () => {
  const [liveSeries, setLiveSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveSeries = async () => {
      try {
        setLoading(true);
        const allSeries = await getAllSeries({});
        
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
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

  const calculateDaysRemaining = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const customStyles = {
    container: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh'
    },
    liveCard: {
      background: 'linear-gradient(145deg, rgba(16, 16, 34, 0.9) 0%, rgba(26, 26, 46, 0.8) 100%)',
      borderRadius: '24px',
      border: '1px solid rgba(147, 51, 234, 0.2)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
      overflow: 'hidden',
      position: 'relative'
    },
    liveIndicator: {
      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
      animation: 'live-pulse 2s ease-in-out infinite',
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
    },
    glowBorder: {
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      background: 'linear-gradient(45deg, #7c3aed, #ef4444, #7c3aed)',
      borderRadius: '26px',
      zIndex: '-1',
      opacity: '0',
      transition: 'opacity 0.4s ease'
    },
    viewButton: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)',
      border: 'none',
      borderRadius: '16px',
      transition: 'all 0.4s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    loadingSpinner: {
      width: '64px',
      height: '64px',
      border: '4px solid rgba(124, 58, 237, 0.1)',
      borderTop: '4px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ ...customStyles.container, minHeight: '100vh' }}>
        <div className="text-center">
          <div style={customStyles.loadingSpinner} className="mx-auto mb-4"></div>
          <h4 className="text-white fw-light">Loading Live Events...</h4>
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
      <div className="d-flex justify-content-center align-items-center" style={customStyles.container}>
        <div className="text-center p-5">
          <h4 className="text-danger mb-3">Error Loading Live Events</h4>
          <p className="text-white-50">{error}</p>
        </div>
      </div>
    );
  }

  if (liveSeries.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={customStyles.container}>
        <div className="text-center p-5">
          <div className="mb-4">
            <BookOpen size={64} className="text-purple-400 mb-3" style={{ color: '#a855f7' }} />
          </div>
          <h2 className="text-white fw-bold mb-3">No Live Events</h2>
          <p className="text-white-50">Currently no live events are running</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={customStyles.container}>
      <div className="row g-4">
        {liveSeries.map((series) => {
          const daysRemaining = calculateDaysRemaining(series.endDate);
          
          return (
            <div key={series._id} className="col-lg-4 col-md-6 col-12">
              <div 
                className="card h-100 border-0 position-relative"
                style={customStyles.liveCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(124, 58, 237, 0.3)';
                  e.currentTarget.querySelector('.glow-border').style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.querySelector('.glow-border').style.opacity = '0';
                }}
              >
                {/* Glow Border */}
                <div className="glow-border" style={customStyles.glowBorder}></div>

                {/* Live Indicator */}
                <div className="position-absolute top-0 start-0 m-4 z-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle me-2" 
                      style={{ width: '12px', height: '12px', ...customStyles.liveIndicator }}
                    ></div>
                    <span className="text-white fw-bold small text-uppercase" style={{ 
                      letterSpacing: '1px',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}>
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Days Remaining */}
                <div className="position-absolute top-0 end-0 m-4 z-3">
                  <div className="bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill d-flex align-items-center backdrop-blur">
                    <Clock size={16} className="me-2" />
                    <span className="fw-bold small">
                      {daysRemaining > 0 ? `${daysRemaining} Days` : 'Ending Soon'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-body p-5 pt-6 text-center">
                  <div className="mb-4">
                    <h3 className="text-white fw-bold mb-2" style={{ 
                      fontSize: '1.5rem',
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: 'none'
                    }}>
                      {series.name}
                    </h3>
                    <p className="text-white-50 small mb-0">
                      {formatRoleName2(series.group)}
                    </p>
                  </div>

                  {/* Sessions Count */}
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-purple-600 text-white mb-2" 
                         style={{ 
                           width: '60px', 
                           height: '60px',
                           background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                           boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)'
                         }}>
                      <span className="fw-bold h4 mb-0">{series.sessions?.length || 0}</span>
                    </div>
                    <p className="text-white-50 small mb-0">Sessions</p>
                  </div>

                  {/* Action Button */}
                  <Link href={`/series/${series._id}`} className="text-decoration-none">
                    <button 
                      className="btn text-white fw-bold py-3 px-5 d-flex align-items-center justify-content-center mx-auto position-relative"
                      style={customStyles.viewButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Play size={18} className="me-2" />
                      <span className="text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        Listen Now
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes live-pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2);
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.9);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .card {
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .backdrop-blur {
          backdrop-filter: blur(10px);
        }
        
        .z-3 {
          z-index: 3;
        }
      `}</style>
    </div>
  );
};

export default LiveSeries;