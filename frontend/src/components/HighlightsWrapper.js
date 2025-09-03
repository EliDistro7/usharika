"use client";

import React, { useEffect, useState } from "react";
import Highlights from "./hl/index";
import { getRecentHighlights, searchHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";
import { Search, XCircle, Filter, Funnel, SortDown } from 'react-bootstrap-icons';

const LoadingSpinner = () => (
  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const PlaceholderCard = () => (
  <div className="bg-light-gradient rounded-5xl border border-border-light shadow-medium overflow-hidden animate-pulse">
    <div className="h-64 bg-background-300"></div>
    <div className="p-6 space-y-3">
      <div className="h-6 bg-background-300 rounded-xl w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-background-300 rounded-lg w-full"></div>
        <div className="h-4 bg-background-300 rounded-lg w-2/3"></div>
        <div className="h-4 bg-background-300 rounded-lg w-1/2"></div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-background-300 rounded-lg w-1/3"></div>
        <div className="h-4 bg-background-300 rounded-lg w-1/4"></div>
      </div>
    </div>
  </div>
);

const HighlightsWrapper = () => {
  const [dataSets, setDataSets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch highlights only on the client
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await getRecentHighlights();
        setDataSets(response.data || []); // Ensure default empty array
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
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    setFilteredData(filtered);
  }, [dataSets, selectedAuthor, sortBy]);

  const formatElapsedTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsElapsed = Math.floor((now - date) / 1000);

    if (secondsElapsed < 60) return `${secondsElapsed}s ago`;
    const minutesElapsed = Math.floor(secondsElapsed / 60);
    if (minutesElapsed < 60) return `${minutesElapsed}m ago`;
    const hoursElapsed = Math.floor(minutesElapsed / 60);
    if (hoursElapsed < 24) return `${hoursElapsed}h ago`;
    const daysElapsed = Math.floor(hoursElapsed / 24);
    return `${daysElapsed}d ago`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearchLoading(true);
      const results = await searchHighlights({ query: searchQuery });
      setDataSets(results.data);
    } catch (err) {
      console.error("Error searching highlights:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchActive(false);
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center relative overflow-hidden min-h-96 bg-light-gradient rounded-5xl mx-5 my-5 shadow-primary-lg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full animate-gentle-float"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-yellow-200 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-green-200 rounded-full animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="bg-primary-gradient p-6 rounded-full mb-6 shadow-primary-lg animate-pulse">
            <LoadingSpinner />
          </div>
          <h4 className="text-center mb-3 text-primary-700 font-semibold text-xl tracking-wide">
            Albamu zinapakia...
          </h4>
          <p className="text-center text-text-secondary text-lg">Subiri kidogo, tunapakia maudhui</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-5 my-8 p-6 relative overflow-hidden bg-gradient-to-br from-error-50 to-error-100 rounded-5xl border border-error-200 shadow-medium">
        <div className="flex items-center">
          <div className="mr-4 p-4 rounded-full bg-gradient-to-br from-error-500 to-error-600 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h5 className="mb-1 text-error-600 font-semibold text-lg">
              Tatizo limetokea
            </h5>
            <p className="mb-0 text-text-secondary">Tatizo kupakia albamu: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-0 mt-6">
      {/* Compact Search and Filters Bar */}
      <div className="flex items-center gap-3 p-3 mb-6 glass-strong rounded-2xl border border-border-accent shadow-primary">
        {/* Filters Dropdown */}
        <div className="relative z-50">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
              selectedAuthor !== "All"
                ? 'bg-primary-gradient text-white shadow-primary'
                : 'bg-white/60 text-primary-700 border border-primary-200 hover:bg-primary-50'
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">
              {selectedAuthor === "All" ? "Chuja" : formatRoleName(selectedAuthor)}
            </span>
            <SortDown 
              size={14} 
              className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-primary-200 shadow-primary-lg z-50 overflow-hidden animate-slide-down" style={{zIndex:'200'}}>
              <div className="p-2">
                <div className="text-xs font-semibold text-primary-600 px-3 py-2 uppercase tracking-wide">
                  Chagua Kikundi
                </div>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center gap-2 ${
                    selectedAuthor === "All" 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'text-text-secondary hover:bg-background-200'
                  }`}
                  onClick={() => {
                    setSelectedAuthor("All");
                    setIsFilterOpen(false);
                  }}
                >
                  📂 Vikundi Vyote
                </button>
                {[...new Set(dataSets.flatMap((item) =>
                  item.content.flatMap((group) =>
                    group.content.map((inner) => inner.author)
                  )
                ))].map((author) => (
                  <button
                    key={author}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center gap-2 ${
                      selectedAuthor === author 
                        ? 'bg-primary-100 text-primary-700 font-medium' 
                        : 'text-text-secondary hover:bg-background-200'
                    }`}
                    onClick={() => {
                      setSelectedAuthor(author);
                      setIsFilterOpen(false);
                    }}
                  >
                    👥 {formatRoleName(author)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Input - Flexible Width */}
        <div className="relative w-32 sm:w-40 md:w-64 lg:w-96">
          <div className="flex items-center bg-white/60 rounded-xl border border-primary-200 transition-all duration-200 focus-within:border-primary-500 focus-within:shadow-primary focus-within:w-48 sm:focus-within:w-56 md:focus-within:w-64 lg:focus-within:w-72">
            <div className="pl-3 pr-2">
              <Search className="text-text-tertiary w-4 h-4" />
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent border-0 py-2 px-2 text-primary-700 font-medium placeholder-text-tertiary focus:outline-none min-w-0"
              placeholder="🔍 Tafuta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button
                className="p-1.5 text-text-tertiary hover:text-text-secondary transition-colors duration-150 flex-shrink-0"
                onClick={clearSearch}
                title="Futa utafutaji"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search Button - Compact */}
        <button
          className={`btn-primary rounded-xl px-4 py-2 transition-all duration-200 flex items-center gap-2 ${
            searchLoading || !searchQuery.trim() 
              ? 'opacity-60 cursor-not-allowed' 
              : 'hover:-translate-y-0.5'
          }`}
          onClick={handleSearch}
          disabled={searchLoading || !searchQuery.trim()}
        >
          {searchLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="hidden sm:inline">Tafuta</span>
              <Search size={16} className="sm:hidden" />
            </>
          )}
        </button>
      </div>

      {/* Click outside to close filter dropdown */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}

      {/* Content Area */}
      {searchLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PlaceholderCard />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchActive && searchResults.length > 0 ? searchResults : filteredData).map(
              (data, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Highlights
                    data={data}
                    datatype={searchResults.length > 0 ? "searchResults" : "default"}
                  />
                </div>
              )
            )}
          </div>
          
          {/* Enhanced Empty States */}
          {searchActive && searchResults.length === 0 && (
            <div className="text-center py-12 my-8 relative bg-light-gradient rounded-5xl border-2 border-dashed border-primary-200">
              <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 rounded-full">
                <Search size={32} className="text-text-tertiary" />
              </div>
              <h4 className="mb-4 text-primary-700 font-semibold text-xl tracking-wide">
                Hamna matokeo ya utafutaji
              </h4>
              <p className="text-text-secondary mb-6 text-lg">
                Hakuna albamu zilizo na "<strong className="text-primary-600">{searchQuery}</strong>"
              </p>
              <button
                className="btn-primary rounded-2xl px-6 py-3 font-semibold inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-300"
                onClick={clearSearch}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Rudi kwenye albamu zote
              </button>
            </div>
          )}
          
          {!searchActive && filteredData.length === 0 && (
            <div className="text-center py-12 my-8 relative bg-light-gradient rounded-5xl border-2 border-dashed border-primary-200">
              <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-content bg-gradient-to-br from-primary-50 to-purple-50 rounded-full">
                <svg className="w-8 h-8 text-primary-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="mb-4 text-primary-700 font-semibold text-xl tracking-wide">
                Hamna albamu
              </h4>
              <p className="text-text-secondary text-lg">
                Hakuna albamu zilizopatikana kwa sasa. Subiri albamu mpya ziongezwe.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HighlightsWrapper;