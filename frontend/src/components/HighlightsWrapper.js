"use client";

import React, { useEffect, useState } from "react";
import { getRecentHighlights, searchHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";
import { Search, XCircle, Funnel, X, Calendar, Person, Image, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const LoadingSpinner = () => (
  <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
);

const PlaceholderCard = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border-light shadow-soft overflow-hidden animate-pulse">
    <div className="w-full" style={{ paddingBottom: '75%', backgroundColor: '#F7F3FA' }}></div>
    <div className="p-6 space-y-4">
      <div className="h-7 bg-background-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-background-300 rounded w-full"></div>
        <div className="h-4 bg-background-300 rounded w-2/3"></div>
      </div>
      <div className="flex justify-between items-center pt-3">
        <div className="h-4 bg-background-300 rounded w-1/3"></div>
        <div className="h-4 bg-background-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sw-TZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Quick View Modal Component
const QuickViewModal = ({ highlight, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [contentOpen, setContentOpen] = useState(false);
  
  if (!highlight) return null;
  
  // Flatten all images from all groups - handle object structure
  const allImages = Object.values(highlight.content).flatMap(group => 
    group.content
      .filter(item => item.imageUrl || item.videoUrl)
      .map(item => ({
        imageUrl: item.imageUrl,
        videoUrl: item.videoUrl,
        description: item.description,
        author: item.author,
        groupName: group.groupName,
        isVideo: !item.imageUrl && item.videoUrl
      }))
  );
  
  const currentImage = allImages[currentImageIndex];
  const totalImages = allImages.length;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Reset loading state when image changes
  React.useEffect(() => {
    setImageLoading(true);
  }, [currentImageIndex]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentImageIndex < totalImages - 1) {
      nextImage();
    }
    if (isRightSwipe && currentImageIndex > 0) {
      prevImage();
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, totalImages, onClose]);

  const nextImage = () => {
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in">
      {/* Full-Screen Media Container */}
      <div 
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {currentImage ? (
          <>
            {/* Loading Spinner */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                  <p className="text-white text-sm">Inapakia {currentImage.isVideo ? 'video' : 'picha'}...</p>
                </div>
              </div>
            )}
            
            {/* Show image or video - Full screen */}
            {currentImage.imageUrl ? (
              <img
                src={currentImage.imageUrl}
                alt={highlight.name}
                className="w-full h-full object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: imageLoading ? 0 : 1, transition: 'opacity 0.3s' }}
              />
            ) : currentImage.videoUrl ? (
              <video
                src={currentImage.videoUrl}
                className="w-full h-full object-contain"
                controls
                onLoadedData={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: imageLoading ? 0 : 1, transition: 'opacity 0.3s' }}
              />
            ) : null}
            
            {/* Gradient overlay at bottom for UI elements */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <Image size={64} />
            <p className="mt-4 text-lg">Hakuna picha au video</p>
          </div>
        )}

        {/* Top Controls - Close & Title */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <h2 
              className="text-xl md:text-2xl font-display font-bold text-white leading-tight flex-1"
              style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
            >
              {highlight.name}
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {totalImages > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronLeft size={28} className="text-white" />
              </button>
            )}
            
            {currentImageIndex < totalImages - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronRight size={28} className="text-white" />
              </button>
            )}
          </>
        )}

        {/* Bottom UI - Counter & Info Button */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex items-end justify-between">
          {/* Image Counter */}
          {totalImages > 1 && (
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
              {currentImageIndex + 1} / {totalImages}
            </div>
          )}

          {/* Info Toggle Button */}
          <button
            onClick={() => setContentOpen(!contentOpen)}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 backdrop-blur-sm rounded-full text-white text-sm font-semibold transition-all flex items-center gap-2 ml-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Taarifa
          </button>
        </div>
      </div>

      {/* Sliding Content Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          contentOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(80vh - 40px)' }}>
          {/* Metadata */}
          <div className="space-y-3 mb-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar size={16} className="text-primary-600" />
              <span>{formatDate(highlight.lastUpdated)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Person size={16} className="text-primary-600" />
              <span>{formatRoleName(highlight.author || Object.values(highlight.content)[0]?.content[0]?.author)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Image size={16} className="text-primary-600" />
              <span>{totalImages} {totalImages === 1 ? 'faili' : 'faili'}</span>
            </div>
          </div>

          {/* Current Image Description */}
          {currentImage && (
            <div className="bg-primary-50 rounded-xl p-4 mb-6">
              <div className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-2">
                {currentImage.groupName}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {currentImage.description}
              </p>
            </div>
          )}

          {/* Thumbnail Gallery */}
          {totalImages > 1 && (
            <div>
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                Picha na Video Zote
              </p>
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setContentOpen(false);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                      idx === currentImageIndex
                        ? 'border-primary-600 ring-2 ring-primary-300'
                        : 'border-gray-200 hover:border-primary-400'
                    }`}
                  >
                    {img.imageUrl ? (
                      <img
                        src={img.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : img.videoUrl ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    ) : null}
                    
                    {/* Video indicator */}
                    {img.isVideo && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={() => setContentOpen(false)}
            className="w-full mt-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
          >
            Funga Taarifa
          </button>
        </div>
      </div>

      {/* Overlay for content panel */}
      {contentOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setContentOpen(false)}
        />
      )}
    </div>
  );
};

// Enhanced Highlight Card
const EnhancedHighlightCard = ({ highlight, onClick }) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  
  // Smart algorithm to find first available image or video from anywhere in content
  const findFirstMedia = () => {
    const allGroups = Object.values(highlight.content);
    
    for (const group of allGroups) {
      for (const item of group.content) {
        // Prioritize images first, then videos
        if (item.imageUrl) {
          return {
            url: item.imageUrl,
            type: 'image',
            description: item.description
          };
        }
      }
    }
    
    // If no images found, look for videos
    for (const group of allGroups) {
      for (const item of group.content) {
        if (item.videoUrl) {
          return {
            url: item.videoUrl,
            type: 'video',
            description: item.description
          };
        }
      }
    }
    
    return null;
  };
  
  const firstMedia = findFirstMedia();
  const coverImage = firstMedia?.type === 'image' ? firstMedia.url : null;
  const coverVideo = firstMedia?.type === 'video' ? firstMedia.url : null;
  const hasMedia = !!firstMedia;
  const description = firstMedia?.description || '';
  const truncatedDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;
  
  // Count total media items
  const totalImages = Object.values(highlight.content).reduce((sum, group) => 
    sum + group.content.filter(item => item.imageUrl || item.videoUrl).length, 0
  );

  // Get author - prioritize highlight author, fallback to first content author
  const firstGroup = Object.values(highlight.content)[0];
  const firstContent = firstGroup?.content[0];
  const author = highlight.author || firstContent?.author || '';

  return (
    <div
      onClick={onClick}
      className="group backdrop-blur-sm shadow-soft overflow-hidden hover:shadow-primary-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Cover Media with Overlay Title */}
      <div className="relative overflow-hidden min-h-[280px]">
        {hasMedia && !mediaError ? (
          <>
            {/* Loading Spinner - only show while loading */}
            {!mediaLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-600 animate-spin"></div>
              </div>
            )}
            
            {/* Show image if available */}
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt={highlight.name}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 min-h-[280px]"
                  onLoad={() => setMediaLoaded(true)}
                  onError={() => {
                    setMediaLoaded(true);
                    setMediaError(true);
                  }}
                  style={{ 
                    display: mediaLoaded ? 'block' : 'none'
                  }}
                />
              </>
            ) : coverVideo ? (
              /* Show video if no image but video exists */
              <>
                <video
                  src={coverVideo}
                  className="w-full h-auto object-cover min-h-[280px]"
                  onLoadedData={() => setMediaLoaded(true)}
                  onError={() => {
                    setMediaLoaded(true);
                    setMediaError(true);
                  }}
                  style={{ 
                    display: mediaLoaded ? 'block' : 'none'
                  }}
                  muted
                  playsInline
                />
                {/* Video play icon overlay */}
                {mediaLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : null}
            
            {/* Gradient overlay for better text visibility */}
            {mediaLoaded && !mediaError && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-text-tertiary min-h-[280px]">
            <Image size={48} />
            <p className="text-xs">Hakuna media</p>
          </div>
        )}
        
        {/* Media Count Badge */}
        {totalImages > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-text-primary/80 backdrop-blur-sm rounded-full flex items-center gap-2 text-white text-sm font-semibold shadow-lg">
            <Image size={14} />
            <span>{totalImages}</span>
          </div>
        )}

        {/* Title Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 
            className="text-2xl font-display font-bold text-white group-hover:text-primary-200 transition-colors leading-tight"
            style={{
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0px 0px 12px rgba(0, 0, 0, 0.6)'
            }}
          >
            {highlight.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

// Main Component
const HighlightsWrapper = () => {
  const [dataSets, setDataSets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  // Fetch highlights
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await getRecentHighlights();
        setDataSets(response.data || []);
      } catch (err) {
        console.error("Error fetching highlights:", err);
        setError(err.message || "Tatizo la mtandao.");
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  // Update filtered data
  useEffect(() => {
    if (!dataSets.length) return;

    const flattenData = () => {
      const flattened = [];
      dataSets.forEach((item) => {
        const groupedContent = {};
        item.content.forEach((group) => {
          groupedContent[group.groupName] = {
            groupName: group.groupName,
            content: group.content.map((innerContent) => ({
              ...innerContent,
              parentLastUpdated: item.lastUpdated,
            })),
          };
        });
        flattened.push({
          name: item.name,
          lastUpdated: item.lastUpdated,
          content: groupedContent,
          _id: item._id,
          author: item.author,
        });
      });
      return flattened;
    };

    let filtered = flattenData();

    // Filter by author
    if (selectedAuthor !== "All") {
      filtered = filtered.filter((item) =>
        Object.values(item.content).some((group) =>
          group.content.some((innerItem) =>
            innerItem.author
              .toLowerCase()
              .includes(selectedAuthor.toLowerCase())
          )
        )
      );
    }

    // Sort by most recent
    filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    setFilteredData(filtered);
  }, [dataSets, selectedAuthor]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearchLoading(true);
      const results = await searchHighlights({ query: searchQuery });
      setDataSets(results.data);
      setSearchActive(true);
    } catch (err) {
      console.error("Error searching highlights:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery("");
    setSearchActive(false);
    setIsSearchOpen(false);
    // Refresh data
    try {
      const response = await getRecentHighlights();
      setDataSets(response.data || []);
    } catch (err) {
      console.error("Error fetching highlights:", err);
    }
  };

  const uniqueAuthors = [...new Set(dataSets.flatMap((item) =>
    item.content.flatMap((group) =>
      group.content.map((inner) => inner.author)
    )
  ))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <LoadingSpinner />
        <h3 className="mt-8 text-2xl font-display font-bold text-text-primary">
          Zinapakia...
        </h3>
        <p className="mt-2 text-text-secondary">Tunapakia albamu</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-error-50 rounded-2xl border border-error-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-error-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-error-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-error-700 mb-1">Tatizo Limetokea</h3>
            <p className="text-error-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4">
      {/* Compact Controls */}
      <div className="flex items-center justify-end gap-2 mb-4 px-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          {isSearchOpen && (
            <div className="animate-slide-down flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-border-light shadow-soft px-3 py-2">
              <input
                type="text"
                className="w-48 sm:w-64 px-2 py-1 text-sm bg-transparent border-0 outline-none placeholder-text-muted text-text-primary"
                placeholder="Tafuta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                autoFocus
              />
              {searchQuery && (
                <button
                  className="p-1 text-text-tertiary hover:text-text-primary hover:bg-background-200 rounded transition-all"
                  onClick={clearSearch}
                >
                  <XCircle size={16} />
                </button>
              )}
              <button
                className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
                onClick={handleSearch}
                disabled={searchLoading || !searchQuery.trim()}
              >
                {searchLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Tafuta'
                )}
              </button>
            </div>
          )}
          
          <button
            className={`p-3 rounded-xl transition-all ${
              isSearchOpen
                ? 'bg-primary-600 text-white'
                : 'bg-white/80 backdrop-blur-sm border-2 border-border-light text-text-primary hover:border-primary-300'
            }`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            title="Tafuta"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            className={`p-3 rounded-xl transition-all ${
              selectedAuthor !== "All"
                ? 'bg-primary-600 text-white'
                : 'bg-white/80 backdrop-blur-sm border-2 border-border-light text-text-primary hover:border-primary-300'
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            title="Chuja"
          >
            <Funnel size={18} />
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl border-2 border-border-light shadow-primary-lg z-50 overflow-hidden animate-slide-down">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Chagua Kikundi
                  </div>
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
                    Vikundi Vyote
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

      {/* Active Filter Badge */}
      {selectedAuthor !== "All" && (
        <div className="flex items-center justify-end gap-2 mb-4 px-4">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold flex items-center gap-2">
            {formatRoleName(selectedAuthor)}
            <button
              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
              onClick={() => setSelectedAuthor("All")}
            >
              <XCircle size={14} />
            </button>
          </span>
        </div>
      )}

      {/* Content */}
      {searchLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PlaceholderCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((data, index) => (
                <div 
                  key={data._id || index} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <EnhancedHighlightCard
                    highlight={data}
                    onClick={() => setSelectedHighlight(data)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-background-200 flex items-center justify-center">
                {searchActive ? (
                  <Search size={40} className="text-text-tertiary" />
                ) : (
                  <svg className="w-12 h-12 text-text-tertiary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <h3 className="text-2xl font-display font-bold text-text-primary mb-3">
                {searchActive ? "Hakuna Matokeo" : "Hakuna Albamu"}
              </h3>
              
              <p className="text-text-secondary mb-6 leading-relaxed">
                {searchActive 
                  ? `Hakuna albamu zilizo na "${searchQuery}"`
                  : "Hakuna albamu zilizopatikana kwa sasa"
                }
              </p>
              
              {searchActive && (
                <button
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 inline-flex items-center gap-2"
                  onClick={clearSearch}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Rudi Nyuma
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Quick View Modal */}
      {selectedHighlight && (
        <QuickViewModal
          highlight={selectedHighlight}
          onClose={() => setSelectedHighlight(null)}
        />
      )}
    </div>
  );
};

export default HighlightsWrapper;