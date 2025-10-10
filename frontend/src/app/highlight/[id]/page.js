'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, Clock, Image, Video, FileText, ChevronDown, ChevronUp, Share2, Bookmark, Play, Pause, Menu, X, Maximize, Minimize, Grid, List } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ShareButton from '@/components/ShareButton';

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
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry' or 'list'
  const [masonryColumns, setMasonryColumns] = useState(3);
  const containerRef = useRef(null);

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

  // Handle responsive masonry columns
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 640) setMasonryColumns(1);
        else if (width < 1024) setMasonryColumns(2);
        else if (width < 1536) setMasonryColumns(3);
        else setMasonryColumns(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Masonry layout helper
  const distributeMasonryItems = (items, columns) => {
    const columnArrays = Array.from({ length: columns }, () => []);
    const columnHeights = Array(columns).fill(0);

    items.forEach((item, index) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Add item to the shortest column
      columnArrays[shortestColumnIndex].push(item);
      
      // Estimate height for balancing (you might want to make this more sophisticated)
      let estimatedHeight = 300; // base height
      if (item.imageUrl || item.videoUrl) estimatedHeight += 200;
      if (item.description.length > 200) estimatedHeight += 100;
      
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });

    return columnArrays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600">
        <div className="text-center px-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading highlight details...</p>
        </div>
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600">
        <div className="text-center px-4">
          <h3 className="text-white text-2xl font-bold">Highlight not found</h3>
        </div>
      </div>
    );
  }

  const currentTab = highlight.content[activeTab];
  const masonryColumns1 = viewMode === 'masonry' ? distributeMasonryItems(currentTab.content, masonryColumns) : null;

  return (
    <div cl
    assName="min-h-screen bg-gradient-to-br from-background-200 via-background-300 to-primary-50">
      {/* Enhanced Header Section - Teal Theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-400 to-blue-400">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              {/* Badge and meta info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                {/* Uncomment if needed
                <div className="flex flex-col sm:flex-row items-start sm:items-center text-white/90 gap-4">
                  <div className="flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3 border border-white/20">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{highlight.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">{formatDate(highlight.createdAt)}</span>
                  </div>
                </div>
                */}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {highlight.name}
              </h1>
              
              <div className="flex items-center text-white/75">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Kusasishwa mara ya mwisho: {formatDate(highlight.lastUpdated)}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:items-end">
                <ShareButton url={window.location.href} title={highlight.name}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            className="w-full bg-gradient-to-r from-primary-500 to-primary-400 text-white p-4 rounded-xl flex items-center justify-between shadow-lg hover:shadow-primary transition-all"
            onClick={toggleSidebar}
          >
            <div className="flex items-center">
              <Menu size={20} className="mr-3" />
              <span className="font-semibold">Maudhui</span>
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
        <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h6 className="text-xl font-bold text-text-primary">Maudhui</h6>
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
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    activeTab === index 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-primary' 
                      : 'bg-background-300 text-text-primary hover:bg-background-400'
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
                        : 'bg-primary-500 text-white'
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 sticky top-6 border border-border-light">
              <h6 className="text-lg font-bold text-text-primary mb-6 flex items-center">
                <div className="bg-gradient-to-r from-primary-500 to-primary-400 p-2 rounded-xl mr-3 shadow-primary">
                  <FileText size={16} className="text-white" />
                </div>
               Maudhui
              </h6>
              <nav className="space-y-2">
                {highlight.content.map((tab, index) => (
                  <button
                    key={tab._id}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      activeTab === index 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-primary transform scale-105' 
                        : 'bg-primary-50 text-text-primary hover:bg-primary-100'
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{tab.groupName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === index 
                          ? 'bg-white/25 text-white' 
                          : 'bg-primary-500 text-white'
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
          <div className="lg:col-span-3" ref={containerRef}>
            {highlight.content.map((tab, tabIndex) => (
              <div
                key={tab._id}
                className={`${tabIndex === activeTab ? 'block' : 'hidden'}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-text-primary mb-2">
                      {tab.groupName}
                    </h2>
                    <p className="text-text-secondary flex items-center text-sm">
                      <Clock size={16} className="mr-2" />
                      Last updated: {formatDate(tab.lastUpdated)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-orange">
                      {tab.content.length} items
                    </span>
                    <div className="flex bg-white/80 backdrop-blur-sm rounded-xl border border-border-light shadow-soft">
                      <button
                        className={`p-2 rounded-l-xl transition-all ${
                          viewMode === 'masonry' 
                            ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white' 
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                        onClick={() => setViewMode('masonry')}
                        title="Masonry view"
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        className={`p-2 rounded-r-xl transition-all ${
                          viewMode === 'list' 
                            ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white' 
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                        onClick={() => setViewMode('list')}
                        title="List view"
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Masonry Grid Layout */}
                {viewMode === 'masonry' ? (
                  <div className={`grid gap-6 ${
                    masonryColumns === 1 ? 'grid-cols-1' : 
                    masonryColumns === 2 ? 'grid-cols-2' : 
                    masonryColumns === 3 ? 'grid-cols-3' : 'grid-cols-4'
                  }`}>
                    {Array.from({ length: masonryColumns }, (_, columnIndex) => (
                      <div key={columnIndex} className="space-y-6">
                        {masonryColumns1[columnIndex]?.map((item) => (
                          <MasonryCard
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
                    ))}
                  </div>
                ) : (
                  /* List Layout */
                  <div className="space-y-6">
                    {tab.content.map((item) => (
                      <MasonryCard
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Instructions */}
      {isFullscreen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-xl">
            <Minimize size={14} className="mr-2" />
            Press ESC or click the minimize button to exit fullscreen
          </div>
        </div>
      )}
    </div>
  );
};

// Masonry Card Component
const MasonryCard = ({ 
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
  return (
    <div 
      id={`fullscreen-container-${item._id}`}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-border-light overflow-hidden hover:shadow-medium hover:scale-105 transition-all duration-300 ${
        isFullscreen && fullscreenItem?._id === item._id 
          ? 'fixed inset-0 z-50 bg-black flex flex-col rounded-none border-none scale-100' 
          : ''
      }`}
    >
      
      {/* Fullscreen Header */}
      {isFullscreen && fullscreenItem?._id === item._id && (
        <div className="bg-black/90 backdrop-blur-sm p-4 flex justify-between items-center">
          <div className="flex items-center text-white">
            <div className="bg-gradient-to-r from-primary-500 to-primary-400 rounded-xl p-2 mr-3">
              <User size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold">{item.author}</div>
              <div className="text-sm text-white/70">Content Author</div>
            </div>
          </div>
          <button 
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={() => exitFullscreen()}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Media Display */}
      {(item.imageUrl || item.videoUrl) && (
        <div className={`relative ${isFullscreen && fullscreenItem?._id === item._id ? 'flex-1 flex items-center justify-center bg-black' : ''}`}>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt="Content"
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
              controls={playingVideos[item._id]}
              poster={item.imageUrl}
            />
          )}
          {item.videoUrl && !playingVideos[item._id] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-full p-4 shadow-orange-lg hover:scale-110 transition-transform"
                onClick={() => toggleVideo(item._id)}
              >
                <Play size={24} className="text-white ml-1" />
              </button>
            </div>
          )}
          <div className={`absolute ${isFullscreen && fullscreenItem?._id === item._id ? 'top-6 right-6' : 'top-4 right-4'} flex gap-2`}>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg ${
              item.imageUrl ? 'bg-gradient-to-r from-green-500 to-green-400 text-white' : 
              'bg-gradient-to-r from-orange-500 to-orange-400 text-white'
            }`}>
              {item.imageUrl ? <Image size={14} className="mr-1" /> : <Video size={14} className="mr-1" />}
              {item.imageUrl ? 'Image' : 'Video'}
            </span>
            <button
              className="bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/90 transition-colors shadow-lg"
              onClick={() => toggleFullscreen(item)}
            >
              {isFullscreen && fullscreenItem?._id === item._id ? (
                <Minimize size={16} />
              ) : (
                <Maximize size={16} />
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Content Details */}
      <div className={`p-6 ${
        isFullscreen && fullscreenItem?._id === item._id && (item.imageUrl || item.videoUrl) 
          ? 'hidden' 
          : ''
      }`}>
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-400 rounded-xl p-2 mr-3 shadow-primary">
            <User size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-text-primary">{item.author}</div>
            <div className="text-sm text-text-secondary">Content Author</div>
          </div>
          {!item.imageUrl && !item.videoUrl && (
            <div className="ml-auto flex gap-2">
              <span className="bg-gradient-to-r from-blue-400 to-primary-400 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <FileText size={14} className="mr-1" />
                Text
              </span>
              <button
                className="bg-gradient-to-r from-primary-500 to-primary-400 text-white p-2 rounded-full hover:shadow-primary transition-all"
                onClick={() => toggleFullscreen(item)}
              >
                {isFullscreen && fullscreenItem?._id === item._id ? (
                  <Minimize size={16} />
                ) : (
                  <Maximize size={16} />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
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
          <div className="mt-4">
            <button 
              className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 rounded-xl font-semibold text-white flex items-center shadow-orange hover:shadow-orange-lg transition-all"
              onClick={() => toggleVideo(item._id)}
            >
              {playingVideos[item._id] ? (
                <>
                  <Pause size={16} className="mr-2" />
                  Pause Video
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Play Video
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Text Content */}
      {isFullscreen && fullscreenItem?._id === item._id && !item.imageUrl && !item.videoUrl && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-xl max-w-none text-white">
              <h2 className="text-white mb-6">{item.author}'s Content</h2>
              <p className="text-white/90 leading-relaxed text-lg">
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