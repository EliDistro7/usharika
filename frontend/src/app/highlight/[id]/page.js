
'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Image, Video, FileText, ChevronDown, ChevronUp, Share2, Bookmark } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const HighlightDetailPage = () => {
   const params = useParams();
    const router = useRouter();
  const [highlight, setHighlight] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data based on your schema
  useEffect(() => {
    // Simulate API call
    const fetchHighlightData = async () => {

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/getHighlightById/${params.id}`);
        console.log('Response:', response);
        if (response.ok) {
          const data = await response.json();
          console.log('data', data)
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

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-purple mb-3" role="status" style={{color: '#6f42c1'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading highlight details...</p>
        </div>
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3 className="text-muted">Highlight not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-2">
                <span className="badge rounded-pill px-3 py-2 me-3" style={{backgroundColor: '#6f42c1', color: 'white'}}>
                  Highlight
                </span>
                <div className="d-flex align-items-center text-muted small">
                  <User size={16} className="me-1" />
                  <span className="me-3">{highlight.author}</span>
                  <Calendar size={16} className="me-1" />
                  <span>{formatDate(highlight.createdAt)}</span>
                </div>
              </div>
              <h1 className="display-6 fw-bold text-dark mb-2">{highlight.name}</h1>
              <div className="d-flex align-items-center text-muted small">
                <Clock size={16} className="me-1" />
                <span>Last updated: {formatDate(highlight.lastUpdated)}</span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <button className="btn btn-outline-purple me-2" style={{borderColor: '#6f42c1', color: '#6f42c1'}}>
                <Share2 size={18} className="me-1" />
                Share
              </button>
              <button className="btn text-white" style={{backgroundColor: '#6f42c1'}}>
                <Bookmark size={18} className="me-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="py-3" style={{backgroundColor: '#fef7e0'}}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="rounded-circle p-2 me-2" style={{backgroundColor: '#6f42c1', color: 'white'}}>
                  <FileText size={16} />
                </div>
                <div>
                  <div className="fw-bold">{highlight.content.length}</div>
                  <small className="text-muted">Groups</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="rounded-circle p-2 me-2" style={{backgroundColor: '#6f42c1', color: 'white'}}>
                  <Image size={16} />
                </div>
                <div>
                  <div className="fw-bold">
                    {highlight.content.reduce((total, tab) => 
                      total + tab.content.reduce((tabTotal, item) => 
                        tabTotal + (item.imageUrl ? 1 : 0), 0), 0)}
                  </div>
                  <small className="text-muted">Images</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="rounded-circle p-2 me-2" style={{backgroundColor: '#6f42c1', color: 'white'}}>
                  <Video size={16} />
                </div>
                <div>
                  <div className="fw-bold">
                    {highlight.content.reduce((total, tab) => 
                      total + tab.content.reduce((tabTotal, item) => 
                        tabTotal + (item.videoUrl ? 1 : 0), 0), 0)}
                  </div>
                  <small className="text-muted">Videos</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 mb-4">
            <div className="bg-white rounded-3 shadow-sm p-3 sticky-top" style={{top: '20px'}}>
              <h6 className="fw-bold text-dark mb-3">Content Groups</h6>
              <nav className="nav flex-column">
                {highlight.content.map((tab, index) => (
                  <button
                    key={tab._id}
                    className={`nav-link text-start border-0 rounded-2 mb-1 p-2 ${
                      activeTab === index 
                        ? 'text-white' 
                        : 'text-dark'
                    }`}
                    style={{
                      backgroundColor: activeTab === index ? '#6f42c1' : 'transparent'
                    }}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">{tab.groupName}</span>
                      <span className="badge rounded-pill" style={{
                        backgroundColor: activeTab === index ? 'rgba(255,255,255,0.2)' : '#6f42c1',
                        color: activeTab === index ? 'white' : 'white'
                      }}>
                        {tab.content.length}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-lg-9">
            {highlight.content.map((tab, tabIndex) => (
              <div
                key={tab._id}
                className={`${tabIndex === activeTab ? 'd-block' : 'd-none'}`}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="fw-bold text-dark mb-1">{tab.groupName}</h2>
                    <p className="text-muted mb-0">
                      Last updated: {formatDate(tab.lastUpdated)}
                    </p>
                  </div>
                  <span className="badge rounded-pill px-3 py-2" style={{backgroundColor: '#6f42c1', color: 'white'}}>
                    {tab.content.length} items
                  </span>
                </div>

                <div className="row g-4">
                  {tab.content.map((item, itemIndex) => (
                    <div key={item._id} className="col-12">
                      <div className="card border-0 shadow-sm h-100 overflow-hidden">
                        {item.imageUrl && (
                          <div className="position-relative">
                            <img
                              src={item.imageUrl}
                              alt="Content"
                              className="card-img-top"
                              style={{height: '200px', objectFit: 'cover'}}
                            />
                            <div className="position-absolute top-0 end-0 m-2">
                              <span className="badge" style={{backgroundColor: '#6f42c1'}}>
                                <Image size={14} className="me-1" />
                                Image
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle p-2 me-2" style={{backgroundColor: '#fef7e0'}}>
                                <User size={16} style={{color: '#6f42c1'}} />
                              </div>
                              <div>
                                <small className="fw-medium text-dark">{item.author}</small>
                                <br />
                                <small className="text-muted">Content Author</small>
                              </div>
                            </div>
                            
                            <div className="d-flex gap-1">
                              {item.videoUrl && (
                                <span className="badge" style={{backgroundColor: '#dc3545'}}>
                                  <Video size={12} className="me-1" />
                                  Video
                                </span>
                              )}
                              {!item.imageUrl && !item.videoUrl && (
                                <span className="badge" style={{backgroundColor: '#28a745'}}>
                                  <FileText size={12} className="me-1" />
                                  Text
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="content-text">
                            <p className="card-text text-dark lh-lg">
                              {expandedItems[item._id] || item.description.length <= 200
                                ? item.description
                                : `${item.description.substring(0, 200)}...`}
                            </p>
                            
                            {item.description.length > 200 && (
                              <button
                                className="btn btn-link p-0 text-decoration-none"
                                style={{color: '#6f42c1'}}
                                onClick={() => toggleItemExpansion(item._id)}
                              >
                                {expandedItems[item._id] ? (
                                  <>
                                    <ChevronUp size={16} className="me-1" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={16} className="me-1" />
                                    Read more
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {item.videoUrl && (
                            <div className="mt-3">
                              <button className="btn btn-outline-danger btn-sm">
                                <Video size={14} className="me-1" />
                                Watch Video
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