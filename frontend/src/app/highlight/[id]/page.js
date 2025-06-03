'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Image, Video, FileText, ChevronDown, ChevronUp, Share2, Bookmark, Play, Pause, Menu, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const HighlightDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [highlight, setHighlight] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data based on your schema
  useEffect(() => {
    // Simulate API call
    const fetchHighlightData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/getHighlightById/${params.id}`);
     
        if (response.ok) {
          const data = await response.json();
          setHighlight(data.data);
        } else {
          toast.error('Failed to load highlight');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching highlight:', error);
        toast.error('Error loading highlight');
      } finally {
        setLoading(false);
      }
    }
    fetchHighlightData();
  }, []);

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleVideo = (itemId) => {
    setPlayingVideos(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}>
        <div className="text-center px-4">
          <div className="spinner-border text-light mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-light fs-5">Loading highlight details...</p>
        </div>
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}>
        <div className="text-center px-4">
          <h3 className="text-light">Highlight not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8fafc'}}>
      {/* Enhanced Mobile-First Header Section */}
      <div className="position-relative overflow-hidden" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}></div>
        
        <div className="container py-4 py-md-5 position-relative">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              {/* Mobile-optimized badge and meta info */}
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-3 gap-3">
                <span className="badge rounded-pill px-3 px-sm-4 py-2 fs-6" style={{
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  ✨ Highlight
                </span>
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center text-light gap-2 gap-sm-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle p-2 me-2" style={{background: 'rgba(255,255,255,0.2)'}}>
                      <User size={14} className="text-light" />
                    </div>
                    <span className="small">{highlight.author}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Calendar size={14} className="me-2" />
                    <span className="small">{formatDate(highlight.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Mobile-optimized title */}
              <h1 className="display-5 display-md-4 fw-bold text-light mb-3 lh-base" style={{textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>{highlight.name}</h1>
              
              <div className="d-flex align-items-center text-light opacity-75">
                <Clock size={14} className="me-2" />
                <span className="small">Last updated: {formatDate(highlight.lastUpdated)}</span>
              </div>
            </div>
            
            {/* Mobile-optimized action buttons */}
            <div className="col-12 col-lg-4 mt-4 mt-lg-0">
              <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-lg-end justify-content-lg-end">
                <button className="btn btn-light px-4 py-2 rounded-pill flex-fill flex-sm-grow-0" style={{
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <Share2 size={16} className="me-2" />
                  Share
                </button>
                <button className="btn px-4 py-2 rounded-pill flex-fill flex-sm-grow-0" style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Bookmark size={16} className="me-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-First Stats Bar */}
      <div className="py-3 py-md-4" style={{
        background: 'linear-gradient(90deg, #A855F7 0%, #8B5CF6 50%, #7C3AED 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="rounded-circle p-2 p-md-3 me-3 shadow-sm" style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  color: 'white'
                }}>
                  <FileText size={16} className="d-md-none" />
                  <FileText size={20} className="d-none d-md-block" />
                </div>
                <div className="text-start">
                  <div className="fs-4 fs-md-3 fw-bold text-white">{highlight.content.length}</div>
                  <small className="text-white opacity-75 fw-medium">Content Groups</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="rounded-circle p-2 p-md-3 me-3 shadow-sm" style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white'
                }}>
                  <Image size={16} className="d-md-none" />
                  <Image size={20} className="d-none d-md-block" />
                </div>
                <div className="text-start">
                  <div className="fs-4 fs-md-3 fw-bold text-white">
                    {highlight.content.reduce((total, tab) => 
                      total + tab.content.reduce((tabTotal, item) => 
                        tabTotal + (item.imageUrl ? 1 : 0), 0), 0)}
                  </div>
                  <small className="text-white opacity-75 fw-medium">Images</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="rounded-circle p-2 p-md-3 me-3 shadow-sm" style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: 'white'
                }}>
                  <Video size={16} className="d-md-none" />
                  <Video size={20} className="d-none d-md-block" />
                </div>
                <div className="text-start">
                  <div className="fs-4 fs-md-3 fw-bold text-white">
                    {highlight.content.reduce((total, tab) => 
                      total + tab.content.reduce((tabTotal, item) => 
                        tabTotal + (item.videoUrl ? 1 : 0), 0), 0)}
                  </div>
                  <small className="text-white opacity-75 fw-medium">Videos</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="d-lg-none">
        <div className="container py-3">
          <button 
            className="btn w-100 d-flex align-items-center justify-content-between p-3 rounded-3" 
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none'
            }}
            onClick={toggleSidebar}
          >
            <div className="d-flex align-items-center">
              <Menu size={20} className="me-3" />
              <span className="fw-medium">Content Groups</span>
            </div>
            <span className="badge rounded-pill px-3 py-2" style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: 'white'
            }}>
              {highlight.content.length}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`d-lg-none position-fixed top-0 start-0 w-100 h-100 ${sidebarOpen ? 'd-block' : 'd-none'}`} style={{zIndex: 1050}}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" onClick={toggleSidebar}></div>
        <div className="position-absolute top-0 start-0 h-100 bg-white shadow-lg" style={{width: '280px', zIndex: 1051}}>
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0">Content Groups</h6>
              <button className="btn btn-light rounded-circle p-2" onClick={toggleSidebar}>
                <X size={16} />
              </button>
            </div>
            <nav className="nav flex-column">
              {highlight.content.map((tab, index) => (
                <button
                  key={tab._id}
                  className={`nav-link text-start border-0 rounded-3 mb-2 p-3 ${
                    activeTab === index 
                      ? 'text-white' 
                      : 'text-dark'
                  }`}
                  style={{
                    background: activeTab === index 
                      ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' 
                      : 'rgba(139, 92, 246, 0.05)',
                  }}
                  onClick={() => {
                    setActiveTab(index);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium">{tab.groupName}</span>
                    <span className="badge rounded-pill px-2 py-1" style={{
                      backgroundColor: activeTab === index 
                        ? 'rgba(255,255,255,0.25)' 
                        : '#8B5CF6',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}>
                      {tab.content.length}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4 py-md-5">
        <div className="row">
          {/* Desktop Sidebar Navigation */}
          <div className="col-lg-3 mb-4 d-none d-lg-block">
            <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{
              top: '20px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <h6 className="fw-bold text-dark mb-4 d-flex align-items-center">
                <div className="rounded-circle p-2 me-2" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}>
                  <FileText size={14} className="text-white" />
                </div>
                Content Groups
              </h6>
              <nav className="nav flex-column">
                {highlight.content.map((tab, index) => (
                  <button
                    key={tab._id}
                    className={`nav-link text-start border-0 rounded-3 mb-2 p-3 transition-all ${
                      activeTab === index 
                        ? 'text-white shadow-sm' 
                        : 'text-dark'
                    }`}
                    style={{
                      background: activeTab === index 
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' 
                        : 'rgba(139, 92, 246, 0.05)',
                      transition: 'all 0.3s ease',
                      transform: activeTab === index ? 'translateX(5px)' : 'translateX(0)'
                    }}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">{tab.groupName}</span>
                      <span className="badge rounded-pill px-2 py-1" style={{
                        backgroundColor: activeTab === index 
                          ? 'rgba(255,255,255,0.25)' 
                          : '#8B5CF6',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}>
                        {tab.content.length}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Mobile-First Content Area */}
          <div className="col-lg-9">
            {highlight.content.map((tab, tabIndex) => (
              <div
                key={tab._id}
                className={`${tabIndex === activeTab ? 'd-block' : 'd-none'}`}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 mb-md-5 gap-3">
                  <div>
                    <h2 className="fw-bold text-dark mb-2 display-6">{tab.groupName}</h2>
                    <p className="text-muted mb-0 d-flex align-items-center small">
                      <Clock size={14} className="me-2" />
                      Last updated: {formatDate(tab.lastUpdated)}
                    </p>
                  </div>
                  <span className="badge rounded-pill px-3 px-md-4 py-2 fs-6 align-self-start" style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    color: 'white'
                  }}>
                    {tab.content.length} items
                  </span>
                </div>

                <div className="row g-3 g-md-4">
                  {tab.content.map((item, itemIndex) => (
                    <div key={item._id} className="col-12">
                      <div className="card border-0 shadow-sm h-100 overflow-hidden rounded-4" style={{
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        
                        {/* Enhanced Mobile-First Image Display */}
                        {item.imageUrl && (
                          <div className="position-relative">
                            <img
                              src={item.imageUrl}
                              alt="Content"
                              className="card-img-top w-100"
                              style={{
                                height: 'auto',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                backgroundColor: '#f8f9fa'
                              }}
                            />
                            <div className="position-absolute top-0 end-0 m-2 m-md-3">
                              <span className="badge rounded-pill px-2 px-md-3 py-1 py-md-2 small" style={{
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(10px)',
                                color: 'white'
                              }}>
                                <Image size={12} className="me-1" />
                                Image
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Mobile-First Video Display */}
                        {item.videoUrl && (
                          <div className="position-relative">
                            <video
                              src={item.videoUrl}
                              className="card-img-top w-100"
                              style={{
                                height: 'auto',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                backgroundColor: '#000'
                              }}
                              controls={playingVideos[item._id]}
                              poster={item.imageUrl}
                            />
                            {!playingVideos[item._id] && (
                              <div className="position-absolute top-50 start-50 translate-middle">
                                <button 
                                  className="btn btn-light rounded-circle p-2 p-md-3 shadow"
                                  onClick={() => toggleVideo(item._id)}
                                  style={{width: '50px', height: '50px'}}
                                >
                                  <Play size={20} className="text-dark ms-1" />
                                </button>
                              </div>
                            )}
                            <div className="position-absolute top-0 end-0 m-2 m-md-3">
                              <span className="badge rounded-pill px-2 px-md-3 py-1 py-md-2 small" style={{
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                backdropFilter: 'blur(10px)',
                                color: 'white'
                              }}>
                                <Video size={12} className="me-1" />
                                Video
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="card-body p-3 p-md-4">
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3 mb-md-4 gap-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle p-2 p-md-3 me-3 shadow-sm" style={{
                                background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)'
                              }}>
                                <User size={16} className="text-white" />
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{item.author}</div>
                                <small className="text-muted">Content Author</small>
                              </div>
                            </div>
                            
                            <div className="d-flex gap-2 align-self-start">
                              {!item.imageUrl && !item.videoUrl && (
                                <span className="badge rounded-pill px-2 px-md-3 py-1 py-md-2 small" style={{
                                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                  color: 'white'
                                }}>
                                  <FileText size={12} className="me-1" />
                                  Text
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="content-text">
                            <p className="card-text text-dark lh-lg small" style={{lineHeight: '1.7'}}>
                              {expandedItems[item._id] || item.description.length <= 200
                                ? item.description
                                : `${item.description.substring(0, 200)}...`}
                            </p>
                            
                            {item.description.length > 200 && (
                              <button
                                className="btn btn-link p-0 text-decoration-none fw-medium small"
                                style={{color: '#8B5CF6'}}
                                onClick={() => toggleItemExpansion(item._id)}
                              >
                                {expandedItems[item._id] ? (
                                  <>
                                    <ChevronUp size={14} className="me-1" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={14} className="me-1" />
                                    Read more
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {item.videoUrl && (
                            <div className="mt-3 mt-md-4">
                              <button 
                                className="btn rounded-pill px-3 px-md-4 py-2 w-100 w-sm-auto"
                                onClick={() => toggleVideo(item._id)}
                                style={{
                                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                  border: 'none',
                                  color: 'white'
                                }}
                              >
                                {playingVideos[item._id] ? (
                                  <>
                                    <Pause size={16} className="me-2" />
                                    Pause Video
                                  </>
                                ) : (
                                  <>
                                    <Play size={16} className="me-2" />
                                    Play Video
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightDetailPage;