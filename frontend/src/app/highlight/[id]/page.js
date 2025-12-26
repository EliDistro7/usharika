'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, Clock, ChevronDown, ChevronUp, Share2, Play, Pause, Menu, X, Maximize, Minimize } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ShareButton from '@/components/ShareButton';
import { formatRoleName2 } from '@/actions/utils';

const HighlightDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [highlight, setHighlight] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreenItem, setFullscreenItem] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch highlight data
  useEffect(() => {
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

  // Fullscreen functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setFullscreenItem(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const enterFullscreen = (item) => {
    const fullscreenElement = document.getElementById(`fullscreen-container-${item._id}`);
    if (fullscreenElement && fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen().then(() => {
        setFullscreenItem(item);
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setFullscreenItem(null);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  const toggleFullscreen = (item) => {
    if (isFullscreen && fullscreenItem?._id === item._id) {
      exitFullscreen();
    } else {
      enterFullscreen(item);
    }
  };

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
    return new Intl.DateTimeFormat('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-text-secondary text-lg">Inapakia...</p>
        </div>
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-2">Haikupatikana</h3>
          <p className="text-text-secondary">Albamu hii haipatikani</p>
        </div>
      </div>
    );
  }

  const currentTab = highlight.content[activeTab];

  return (
    <div className="min-h-screen">
      {/* Simple Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-border-light relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-3">
                {highlight.name}
              </h1>
              <div className="flex items-center text-text-secondary text-sm">
                <Clock size={16} className="mr-2" />
                <span>Ilisasishwa: {formatDate(highlight.lastUpdated)}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="relative z-50">
                <ShareButton url={typeof window !== 'undefined' ? window.location.href : ''} title={highlight.name}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Selector */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button 
            className="w-full bg-primary-600 text-white px-6 py-4 rounded-xl flex items-center justify-between font-semibold hover:bg-primary-700 transition-colors"
            onClick={toggleSidebar}
          >
            <div className="flex items-center gap-3">
              <Menu size={20} />
              <span>Maudhui</span>
            </div>
            <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
              {highlight.content.length}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar}></div>
          <div className="absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">Maudhui</h2>
                <button 
                  className="p-2 hover:bg-background-200 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-2">
                {highlight.content.map((tab, index) => (
                  <button
                    key={tab._id}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all font-medium ${
                      activeTab === index 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-background-200 text-text-primary hover:bg-background-300'
                    }`}
                    onClick={() => {
                      setActiveTab(index);
                      setSidebarOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span>{tab.groupName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        activeTab === index 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-700'
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
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block relative z-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-border-light p-6 sticky top-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">
                Maudhui
              </h2>
              <nav className="space-y-2">
                {highlight.content.map((tab, index) => (
                  <button
                    key={tab._id}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all font-medium ${
                      activeTab === index 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-background-200 text-text-primary hover:bg-background-300'
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{tab.groupName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        activeTab === index 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-700'
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
          <div className="lg:col-span-3 relative z-20">
            {highlight.content.map((tab, tabIndex) => (
              <div
                key={tab._id}
                className={`${tabIndex === activeTab ? 'block' : 'hidden'}`}
              >
                {/* Tab Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
                    {tab.groupName}
                  </h2>
                  <p className="text-text-secondary flex items-center text-sm">
                    <Clock size={16} className="mr-2" />
                    Ilisasishwa: {formatDate(tab.lastUpdated)}
                  </p>
                </div>

                {/* Content Grid */}
                <div className="space-y-6">
                  {tab.content.map((item) => (
                    <ContentCard
                      key={item._id}
                      item={item}
                      expandedItems={expandedItems}
                      playingVideos={playingVideos}
                      toggleItemExpansion={toggleItemExpansion}
                      toggleVideo={toggleVideo}
                      toggleFullscreen={toggleFullscreen}
                      isFullscreen={isFullscreen}
                      fullscreenItem={fullscreenItem}
                      exitFullscreen={exitFullscreen}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Helper Text */}
      {isFullscreen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 pointer-events-none">
          <div className="bg-black/90 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl">
            Bonyeza ESC kumaliza
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Content Card Component
const ContentCard = ({ 
  item, 
  expandedItems, 
  playingVideos, 
  toggleItemExpansion, 
  toggleVideo, 
  toggleFullscreen, 
  isFullscreen, 
  fullscreenItem, 
  exitFullscreen 
}) => {
  const hasMedia = item.imageUrl || item.videoUrl;
  const isExpanded = expandedItems[item._id];
  const isPlaying = playingVideos[item._id];
  const needsExpansion = item.description.length > 300;

  return (
    <div 
      id={`fullscreen-container-${item._id}`}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-border-light overflow-hidden transition-all hover:border-primary-300 ${
        isFullscreen && fullscreenItem?._id === item._id 
          ? 'fixed inset-0 z-50 bg-black flex flex-col rounded-none border-none' 
          : ''
      }`}
    >
      {/* Fullscreen Header */}
      {isFullscreen && fullscreenItem?._id === item._id && (
        <div className="bg-black/90 p-4 flex justify-between items-center">
          <div className="flex items-center text-white">
            <User size={20} className="mr-3" />
            <div>
              <div className="font-bold">{formatRoleName2(item.author)}</div>
              <div className="text-sm text-white/70">Mwandishi</div>
            </div>
          </div>
          <button 
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            onClick={() => exitFullscreen()}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Media Section */}
      {hasMedia && (
        <div className={`relative ${isFullscreen && fullscreenItem?._id === item._id ? 'flex-1 flex items-center justify-center bg-black' : ''}`}>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt="Picha"
              className={`${
                isFullscreen && fullscreenItem?._id === item._id 
                  ? 'max-w-full max-h-full object-contain' 
                  : 'w-full h-auto'
              }`}
            />
          )}
          {item.videoUrl && (
            <video
              src={item.videoUrl}
              className={`${
                isFullscreen && fullscreenItem?._id === item._id 
                  ? 'max-w-full max-h-full object-contain' 
                  : 'w-full h-auto'
              }`}
              controls={isPlaying}
              poster={item.imageUrl}
            />
          )}
          
          {/* Video Play Button Overlay */}
          {item.videoUrl && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                className="bg-primary-600 rounded-full p-5 shadow-xl hover:bg-primary-700 hover:scale-110 transition-all"
                onClick={() => toggleVideo(item._id)}
              >
                <Play size={32} className="text-white ml-1" />
              </button>
            </div>
          )}
          
          {/* Fullscreen Button */}
          <div className={`absolute ${isFullscreen && fullscreenItem?._id === item._id ? 'top-6 right-6' : 'top-4 right-4'}`}>
            <button
              className="bg-black/70 text-white p-3 rounded-lg hover:bg-black/90 transition-colors"
              onClick={() => toggleFullscreen(item)}
            >
              {isFullscreen && fullscreenItem?._id === item._id ? (
                <Minimize size={20} />
              ) : (
                <Maximize size={20} />
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className={`p-6 ${
        isFullscreen && fullscreenItem?._id === item._id && hasMedia 
          ? 'hidden' 
          : ''
      }`}>
        {/* Author Badge */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-light">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-primary-700" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{formatRoleName2(item.author)}</div>
            <div className="text-sm text-text-tertiary">Mwandishi</div>
          </div>
        </div>

        {/* Description */}
        <div className="prose max-w-none">
          <p className="text-text-secondary leading-relaxed text-base">
            {isExpanded || !needsExpansion
              ? item.description
              : `${item.description.substring(0, 300)}...`}
          </p>
          
          {needsExpansion && (
            <button
              className="mt-4 text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 transition-colors"
              onClick={() => toggleItemExpansion(item._id)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={18} />
                  Funga
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  Soma zaidi
                </>
              )}
            </button>
          )}
        </div>

        {/* Video Controls */}
        {item.videoUrl && (
          <div className="mt-6 pt-4 border-t border-border-light">
            <button 
              className="w-full sm:w-auto bg-primary-600 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors"
              onClick={() => toggleVideo(item._id)}
            >
              {isPlaying ? (
                <>
                  <Pause size={18} />
                  Simamisha
                </>
              ) : (
                <>
                  <Play size={18} />
                  Cheza Video
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Text-only Content */}
      {isFullscreen && fullscreenItem?._id === item._id && !hasMedia && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-primary leading-relaxed text-lg">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightDetailPage;