"use client";

import React, { useEffect, useState } from "react";
import Highlights from "./hl/index";
import { getRecentHighlights, searchHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";
import { Search, XCircle, Funnel } from 'react-bootstrap-icons';

const LoadingSpinner = () => (
  <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
);

const PlaceholderCard = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border-light shadow-soft overflow-hidden animate-pulse">
    <div className="h-56 bg-background-300"></div>
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

const HighlightsWrapper = () => {
  const [dataSets, setDataSets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const clearSearch = () => {
    setSearchQuery("");
    setSearchActive(false);
    setSearchResults([]);
    setIsSearchOpen(false);
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Minimal Controls - Top Right Corner */}
      <div className="flex items-center justify-end gap-2 mb-6">
        {/* Search Toggle & Expandable Bar */}
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
          
          {/* Search Icon Button */}
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

        {/* Filter Button */}
        <div className="relative">
          <button
            className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
              selectedAuthor !== "All"
                ? 'bg-primary-600 text-white'
                : 'bg-white/80 backdrop-blur-sm border-2 border-border-light text-text-primary hover:border-primary-300'
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            title="Chuja"
          >
            <Funnel size={18} />
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsFilterOpen(false)}
              ></div>
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
        <div className="flex items-center justify-end gap-2 mb-4">
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

      {/* Content Area */}
      {searchLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PlaceholderCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {/* Highlights Grid */}
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((data, index) => (
                <div 
                  key={data._id || index} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Highlights
                    data={data}
                    datatype="default"
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State - Simple & Elegant */
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
    </div>
  );
};

export default HighlightsWrapper;