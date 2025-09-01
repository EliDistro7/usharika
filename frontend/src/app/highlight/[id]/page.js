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
          console.error('Failed to load highlight');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching highlight:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHighlightData();
  }, [params.id, router]);

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
      <div className="min-h-screen flex items-center justify-center bg-primary-gradient">
        <div className="text-center px-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading highlight details...</p>
        </div>
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-gradient">
        <div className="text-center px-4">
          <h3 className="text-white text-2xl font-bold">Highlight not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-200">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-primary-gradient">
        <div className="absolute inset-0 bg-hero-gradient opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              {/* Badge and meta info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                <span className="glass px-4 py-2 rounded-full text-white font-medium flex items-center">
                  ✨ Highlight
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center text-white/90 gap-4">
                  <div className="flex items-center">
                    <div className="glass-strong rounded-full p-2 mr-3">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{highlight.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">{formatDate(highlight.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight text-shadow">
                {highlight.name}
              </h1>
              
              <div className="flex items-center text-white/75">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Last updated: {formatDate(highlight.lastUpdated)}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:items-end">
                <button className="btn-primary px-6 py-3 rounded-2xl font-semibold text-white flex items-center justify-center shadow-primary-lg hover:shadow-primary group">
                  <Share2 size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                  Share
                </button>
                <button className="glass-strong px-6 py-3 rounded-2xl font-semibold text-white flex items-center justify-center hover:bg-white/20 transition-all">
                  <Bookmark size={18} className="mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Bar */}
      <div className="bg-secondary-gradient py-6 shadow-medium">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center">
              <div className="bg-primary-600 rounded-2xl p-3 mr-4 shadow-primary">
                <FileText size={24} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white">{highlight.content.length}</div>
                <div className="text-white/80 text-sm font-medium">Content Groups</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-success-600 rounded-2xl p-3 mr-4 shadow-success">
                <Image size={24} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white">
                  {highlight.content.reduce((total, tab) => 
                    total + tab.content.reduce((tabTotal, item) => 
                      tabTotal + (item.imageUrl ? 1 : 0), 0), 0)}
                </div>
                <div className="text-white/80 text-sm font-medium">Images</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-yellow-600 rounded-2xl p-3 mr-4 shadow-yellow">
                <Video size={24} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white">
                  {highlight.content.reduce((total, tab) => 
                    total + tab.content.reduce((tabTotal, item) => 
                      tabTotal + (item.videoUrl ? 1 : 0), 0), 0)}
                </div>
                <div className="text-white/80 text-sm font-medium">Videos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            className="w-full btn-primary p-4 rounded-2xl flex items-center justify-between shadow-primary"
            onClick={toggleSidebar}
          >
            <div className="flex items-center">
              <Menu size={20} className="mr-3" />
              <span className="font-semibold">Content Groups</span>
            </div>
            <span className="bg-white/25 rounded-full px-3 py-1 text-sm font-medium">
              {highlight.content.length}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleSidebar}></div>
        <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-strong animate-slide-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h6 className="text-xl font-bold text-text-primary">Content Groups</h6>
              <button 
                className="p-2 rounded-full hover:bg-background-300 transition-colors"
                onClick={toggleSidebar}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-2">
              {highlight.content.map((tab, index) => (
                <button
                  key={tab._id}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${
                    activeTab === index 
                      ? 'btn-primary text-white shadow-primary' 
                      : 'bg-background-300 text-text-primary hover:bg-primary-100'
                  }`}
                  onClick={() => {
                    setActiveTab(index);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{tab.groupName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === index 
                        ? 'bg-white/25 text-white' 
                        : 'bg-primary-600 text-white'
                    }`}>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-medium p-6 sticky top-6 border border-border-light">
              <h6 className="text-lg font-bold text-text-primary mb-6 flex items-center">
                <div className="btn-primary p-2 rounded-xl mr-3">
                  <FileText size={16} className="text-white" />
                </div>
                Content Groups
              </h6>
              <nav className="space-y-2">
                {highlight.content.map((tab, index) => (
                  <button
                    key={tab._id}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      activeTab === index 
                        ? 'btn-primary text-white shadow-primary transform translate-x-1' 
                        : 'bg-primary-50 text-text-primary hover:bg-primary-100'
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{tab.groupName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === index 
                          ? 'bg-white/25 text-white' 
                          : 'bg-primary-600 text-white'
                      }`}>
                        {tab.content.length}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {highlight.content.map((tab, tabIndex) => (
              <div
                key={tab._id}
                className={`${tabIndex === activeTab ? 'block animate-fade-in' : 'hidden'}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
                      {tab.groupName}
                    </h2>
                    <p className="text-text-secondary flex items-center text-sm">
                      <Clock size={16} className="mr-2" />
                      Last updated: {formatDate(tab.lastUpdated)}
                    </p>
                  </div>
                  <span className="bg-primary-gradient text-white px-4 py-2 rounded-full text-sm font-semibold shadow-primary">
                    {tab.content.length} items
                  </span>
                </div>

                <div className="space-y-6">
                  {tab.content.map((item, itemIndex) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-medium border border-border-light overflow-hidden hover:shadow-primary-lg transition-all duration-300 group">
                      
                      {/* Image Display */}
                      {item.imageUrl && (
                        <div className="relative">
                          <img
                            src={item.imageUrl}
                            alt="Content"
                            className="w-full h-auto max-h-80 object-contain bg-background-100"
                          />
                          <div className="absolute top-4 right-4">
                            <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                              <Image size={14} className="mr-1" />
                              Image
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Video Display */}
                      {item.videoUrl && (
                        <div className="relative">
                          <video
                            src={item.videoUrl}
                            className="w-full h-auto max-h-80 object-contain bg-black"
                            controls={playingVideos[item._id]}
                            poster={item.imageUrl}
                          />
                          {!playingVideos[item._id] && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button 
                                className="btn-primary rounded-full p-4 shadow-primary-lg hover:scale-110 transition-transform"
                                onClick={() => toggleVideo(item._id)}
                              >
                                <Play size={24} className="text-white ml-1" />
                              </button>
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-gradient text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                              <Video size={14} className="mr-1" />
                              Video
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                          <div className="flex items-center">
                            <div className="bg-primary-gradient rounded-2xl p-3 mr-4 shadow-primary">
                              <User size={20} className="text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-text-primary">{item.author}</div>
                              <div className="text-sm text-text-secondary">Content Author</div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {!item.imageUrl && !item.videoUrl && (
                              <span className="bg-green-gradient text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                <FileText size={14} className="mr-1" />
                                Text
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                          <p className="text-text-primary leading-relaxed">
                            {expandedItems[item._id] || item.description.length <= 200
                              ? item.description
                              : `${item.description.substring(0, 200)}...`}
                          </p>
                          
                          {item.description.length > 200 && (
                            <button
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center mt-4 transition-colors"
                              onClick={() => toggleItemExpansion(item._id)}
                            >
                              {expandedItems[item._id] ? (
                                <>
                                  <ChevronUp size={16} className="mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={16} className="mr-1" />
                                  Read more
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {item.videoUrl && (
                          <div className="mt-6">
                            <button 
                              className="btn-secondary px-6 py-3 rounded-xl font-semibold text-white flex items-center shadow-yellow-lg hover:shadow-yellow group"
                              onClick={() => toggleVideo(item._id)}
                            >
                              {playingVideos[item._id] ? (
                                <>
                                  <Pause size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                                  Pause Video
                                </>
                              ) : (
                                <>
                                  <Play size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                                  Play Video
                                </>
                              )}
                            </button>
                          </div>
                        )}
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