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

  // Reset loading state when image changes
  React.useEffect(() => {
    setImageLoading(true);
  }, [currentImageIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalImages, onClose]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full h-full bg-white overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-soft"
        >
          <X size={24} className="text-text-primary" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section - Full Height */}
          <div className="relative flex-1 bg-background-300 flex items-center justify-center overflow-auto min-h-[50vh] md:min-h-full">
            {currentImage ? (
              <>
                {/* Loading Spinner */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background-300 z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                      <p className="text-text-secondary text-sm">Inapakia {currentImage.isVideo ? 'video' : 'picha'}...</p>
                    </div>
                  </div>
                )}
                
                {/* Show image or video based on content type */}
                {currentImage.imageUrl ? (
                  <img
                    src={currentImage.imageUrl}
                    alt={highlight.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ opacity: imageLoading ? 0 : 1, transition: 'opacity 0.3s' }}
                  />
                ) : currentImage.videoUrl ? (
                  <video
                    src={currentImage.videoUrl}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    controls
                    onLoadedData={handleImageLoad}
                    onError={handleImageError}
                    style={{ opacity: imageLoading ? 0 : 1, transition: 'opacity 0.3s' }}
                  />
                ) : null}
                
                {/* Image Navigation */}
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-4 p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-soft"
                    >
                      <ChevronLeft size={20} className="text-text-primary md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-4 p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-soft"
                    >
                      <ChevronRight size={20} className="text-text-primary md:w-6 md:h-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-text-primary/80 backdrop-blur-sm rounded-full text-white text-xs md:text-sm font-semibold">
                      {currentImageIndex + 1} / {totalImages}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-text-tertiary">
                <Image size={48} />
                <p className="mt-2">Hakuna picha au video</p>
              </div>
            )}
          </div>

          {/* Content Section - Fixed Width Sidebar */}
          <div className="w-full md:w-96 p-4 md:p-6 overflow-y-auto bg-white md:border-l border-t md:border-t-0 border-border-light max-h-[50vh] md:max-h-full">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              {highlight.name}
            </h2>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
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
              <div className="bg-lavender-50 rounded-xl p-4 mb-4">
                <div className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-2">
                  {currentImage.groupName}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {currentImage.description}
                </p>
              </div>
            )}

            {/* Thumbnail Strip */}
            {totalImages > 1 && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Picha na Video
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allImages.slice(0, 9).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                        idx === currentImageIndex
                          ? 'border-primary-600 shadow-primary'
                          : 'border-border-light hover:border-primary-300'
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
                        <div className="w-full h-full bg-background-400 flex items-center justify-center">
                          <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      ) : null}
                      
                      {/* Video indicator */}
                      {img.isVideo && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-text-primary/80 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {totalImages > 9 && (
                  <p className="text-xs text-text-tertiary mt-2 text-center">
                    +{totalImages - 9} zaidi
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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
      className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-border-light shadow-soft overflow-hidden hover:shadow-primary-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Cover Media - Original Aspect Ratio */}
      <div className="relative bg-background-300 overflow-hidden min-h-[200px]">
        {hasMedia && !mediaError ? (
          <>
            {/* Loading Spinner - only show while loading */}
            {!mediaLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background-300 z-10">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Show image if available */}
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt={highlight.name}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
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
                  className="w-full h-auto object-contain"
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
            
            {mediaLoaded && !mediaError && (
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-text-tertiary min-h-[200px]">
            <Image size={48} />
            <p className="text-xs">Hakuna media</p>
          </div>
        )}
        
        {/* Media Count Badge */}
        {totalImages > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-text-primary/80 backdrop-blur-sm rounded-full flex items-center gap-2 text-white text-sm font-semibold">
            <Image size={14} />
            <span>{totalImages}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-text-primary mb-3 group-hover:text-primary-600 transition-colors">
          {highlight.name}
        </h3>

        {/* Description Preview */}
        {truncatedDesc && (
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {truncatedDesc}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <Person size={14} className="text-primary-600" />
            <span>{formatRoleName(author)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <Calendar size={14} className="text-primary-600" />
            <span>{formatDate(highlight.lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Hover Action Indicator */}
      <div className="px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center text-sm font-semibold text-primary-600">
          Bonyeza kuona zaidi →
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