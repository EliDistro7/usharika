"use client";

import React, { useEffect, useState } from "react";
import Highlights from "./hl/index";
import { getRecentHighlights, searchHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";
import { Spinner, Placeholder, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Search, XCircle, Filter, Funnel, SortDown } from 'react-bootstrap-icons';

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
          _id:item._id,
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
      ))
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
      <div 
        className="d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden"
        style={{ 
          minHeight: '400px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '24px',
          margin: '20px',
          boxShadow: '0 20px 60px rgba(106, 13, 173, 0.1)',
        }}
      >
        {/* Animated Background */}
        <div 
          className="position-absolute w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 30% 70%, rgba(106, 13, 173, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(156, 39, 176, 0.05) 0%, transparent 50%)',
            animation: 'gentle-float 6s ease-in-out infinite',
          }}
        />
        
        <div className="position-relative">
          <div 
            className="p-4 rounded-circle mb-4"
            style={{
              background: 'linear-gradient(135deg, #6a0dad, #9c27b0)',
              boxShadow: '0 15px 35px rgba(106, 13, 173, 0.3)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            <Spinner 
              animation="border" 
              variant="light" 
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Inapakia...</span>
            </Spinner>
          </div>
          <h4 
            className="text-center mb-2"
            style={{ 
              color: '#6a0dad',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Albamu zinapakia...
          </h4>
          <p className="text-center text-muted">Subiri kidogo, tunapakia maudhui</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="mx-3 my-5 p-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.1)',
        }}
      >
        <div className="d-flex align-items-center">
          <div 
            className="me-3 p-3 rounded-circle"
            style={{
              background: 'linear-gradient(135deg, #dc2626, #ef4444)',
              boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
            }}
          >
            <i className="fas fa-exclamation-triangle text-white"></i>
          </div>
          <div>
            <h5 className="mb-1" style={{ color: '#dc2626', fontWeight: '600' }}>
              Tatizo limetokea
            </h5>
            <p className="mb-0 text-muted">Tatizo kupakia albamu: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Enhanced Header Section */}
      <div 
        className="p-4 mb-5 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #6a0dad 0%, #9c27b0 35%, #e91e63 70%, #ff6b35 100%)',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(106, 13, 173, 0.2)',
        }}
      >
        {/* Floating Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="position-absolute rounded-circle"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                background: 'rgba(255,255,255,0.1)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-gentle ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="position-relative">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 
                className="text-white mb-2"
                style={{ 
                  fontWeight: '700',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <i className="fas fa-photo-video me-3"></i>
                YALIYOJIRI 
              </h2>
              <p 
                className="text-white mb-0 opacity-90"
                style={{ fontSize: '1.1rem', textShadow: '1px 1px 4px rgba(0,0,0,0.2)' }}
              >
                Tazama muhtasari wa yaliyojiri kwenye kanisa letu
              </p>
            </div>
            
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end align-items-center gap-3">
                <div 
                  className="px-3 py-2 rounded-pill d-flex align-items-center"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <i className="fas fa-images text-white me-2"></i>
                  <span className="text-white fw-medium">
                    {filteredData.length} Albamu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters Section */}
      <div 
        className="p-4 mb-4 position-relative"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(106, 13, 173, 0.1)',
          boxShadow: '0 15px 40px rgba(106, 13, 173, 0.08)',
        }}
      >
        <div className="row align-items-center g-3">
          {/* Filter Toggle Button */}
          <div className="col-auto">
            <button
              className="btn d-flex align-items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                background: isFilterOpen 
                  ? 'linear-gradient(135deg, #6a0dad, #9c27b0)' 
                  : 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))',
                border: '1px solid rgba(106, 13, 173, 0.2)',
                borderRadius: '15px',
                padding: '12px 20px',
                color: isFilterOpen ? 'white' : '#6a0dad',
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isFilterOpen ? '0 8px 25px rgba(106, 13, 173, 0.3)' : 'none',
              }}
            >
              <Funnel size={18} />
              Chuja
              <SortDown 
                size={16} 
                style={{ 
                  transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </button>
          </div>

          {/* Author Filter - Collapsible */}
          <div className={`col-md-3 ${isFilterOpen ? 'd-block' : 'd-md-block d-none'}`}>
            <div className="position-relative">
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="form-select"
                style={{ 
                  background: 'rgba(255,255,255,0.8)',
                  border: '2px solid rgba(106, 13, 173, 0.2)',
                  borderRadius: '15px',
                  padding: '12px 16px',
                  color: '#6a0dad',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6a0dad';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(106, 13, 173, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(106, 13, 173, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="All">📂 Vikundi Vyote</option>
                {[...new Set(dataSets.flatMap((item) =>
                  item.content.flatMap((group) =>
                    group.content.map((inner) => inner.author)
                  )
                ))].map((author) => (
                  <option key={author} value={author}>
                    👥 {formatRoleName(author)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="col-md-6 col-lg-7">
            <div className="position-relative">
              <div 
                className="input-group"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '20px',
                  padding: '4px',
                  border: '2px solid rgba(106, 13, 173, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onFocus={() => {
                  document.querySelector('.search-group').style.borderColor = '#6a0dad';
                  document.querySelector('.search-group').style.boxShadow = '0 0 0 0.2rem rgba(106, 13, 173, 0.25)';
                }}
              >
                <div className="input-group-text bg-transparent border-0">
                  <Search className="text-muted" size={20} />
                </div>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none"
                  placeholder="🔍 Tafuta albamu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    color: "#6a0dad",
                    fontWeight: '500',
                    fontSize: '16px',
                    padding: '12px 8px',
                  }}
                />
                {searchQuery && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Futa utafutaji</Tooltip>}
                  >
                    <button
                      className="btn btn-link p-2 border-0"
                      onClick={clearSearch}
                      style={{ color: '#6c757d' }}
                    >
                      <XCircle size={18} />
                    </button>
                  </OverlayTrigger>
                )}
                <button
                  className="btn text-white"
                  onClick={handleSearch}
                  disabled={searchLoading || !searchQuery.trim()}
                  style={{
                    background: searchLoading || !searchQuery.trim() 
                      ? 'linear-gradient(135deg, #6c757d, #adb5bd)' 
                      : 'linear-gradient(135deg, #6a0dad, #9c27b0)',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '8px 20px',
                    marginRight: '4px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {searchLoading ? (
                    <Spinner animation="border" size="sm" role="status" />
                  ) : (
                    '🚀 Tafuta'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="col-auto ms-auto">
            <div 
              className="px-3 py-2 rounded-pill d-flex align-items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))',
                border: '1px solid rgba(106, 13, 173, 0.2)',
              }}
            >
              <div 
                className="rounded-circle me-2"
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'linear-gradient(135deg, #6a0dad, #9c27b0)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span className="fw-medium" style={{ color: '#6a0dad', fontSize: '14px' }}>
                {filteredData.length} matokeo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {searchLoading ? (
        <div className="row g-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div 
                className="card h-100 border-0 position-relative overflow-hidden"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 15px 40px rgba(106, 13, 173, 0.08)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                }}
              >
                <Placeholder as="div" animation="wave" className="w-100">
                  <Placeholder 
                    xs={12} 
                    style={{ 
                      height: '250px',
                      borderRadius: '20px 20px 0 0',
                    }} 
                    bg="light" 
                  />
                  <div className="card-body p-4">
                    <Placeholder as="h5" animation="wave">
                      <Placeholder xs={8} />
                    </Placeholder>
                    <Placeholder as="p" animation="wave">
                      <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={6} />
                    </Placeholder>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Placeholder xs={4} />
                      <Placeholder xs={3} />
                    </div>
                  </div>
                </Placeholder>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Highlights Grid */}
          <div className="row g-4">
            {(searchActive && searchResults.length > 0 ? searchResults : filteredData).map(
              (data, index) => (
                <div 
                  key={index} 
                  className="col-12 col-md-6 col-lg-4"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
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
            <div 
              className="text-center py-5 my-5 position-relative"
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px',
                border: '2px dashed rgba(106, 13, 173, 0.2)',
              }}
            >
              <div 
                className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))',
                  borderRadius: '50%',
                }}
              >
                <Search size={32} className="text-muted" />
              </div>
              <h4 className="mb-3" style={{ color: '#6a0dad', fontWeight: '600' }}>
                Hamna matokeo ya utafutaji
              </h4>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Hakuna albamu zilizo na "<strong>{searchQuery}</strong>"
              </p>
              <button
                className="btn text-white"
                onClick={clearSearch}
                style={{
                  background: 'linear-gradient(135deg, #6a0dad, #9c27b0)',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '12px 24px',
                  fontWeight: '600',
                }}
              >
                <i className="fas fa-redo me-2"></i>
                Rudi kwenye albamu zote
              </button>
            </div>
          )}
          
          {!searchActive && filteredData.length === 0 && (
            <div 
              className="text-center py-5 my-5 position-relative"
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px',
                border: '2px dashed rgba(106, 13, 173, 0.2)',
              }}
            >
              <div 
                className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(156, 39, 176, 0.1))',
                  borderRadius: '50%',
                }}
              >
                <i className="fas fa-photo-video" style={{ fontSize: '32px', color: '#6a0dad' }}></i>
              </div>
              <h4 className="mb-3" style={{ color: '#6a0dad', fontWeight: '600' }}>
                Hamna albamu
              </h4>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                Hakuna albamu zilizopatikana kwa sasa. Subiri albamu mpya ziongezwe.
              </p>
            </div>
          )}
        </>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 15px 35px rgba(106, 13, 173, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 20px 45px rgba(106, 13, 173, 0.4); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .search-group {
          border: 2px solid rgba(106, 13, 173, 0.2);
          transition: all 0.3s ease;
        }
        
        .form-select:focus,
        .form-control:focus {
          outline: none;
        }
        
        @media (max-width: 768px) {
          .row.align-items-center {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default HighlightsWrapper;