"use client";

import React, { useEffect, useState } from "react";
import Highlights from "./Highlights2";
import { getRecentHighlights, searchHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";
import { Spinner, Placeholder, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Search, XCircle, Filter } from 'react-bootstrap-icons';


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
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Inapakia...</span>
        </Spinner>
        <p className="mt-3 text-primary">Albamu zinapakia...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mx-3 my-5">
        <Alert.Heading>Tatizo limetokea</Alert.Heading>
        <p>Tatizo kupakia albamu: {error}</p>
      </Alert>
    );
  }

  return (
    <div className="container-fluid mt-3">
      {/* Search and Filters Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        {/* Author Filter Dropdown with icon */}
        <div className="d-flex align-items-center" style={{ width: '150px' }}>
          <Filter className="me-2 text-purple" size={20} />
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="form-select border-purple shadow-sm"
            style={{ 
              backgroundColor: "#fff", 
              color: "#6f42c1",
              flex: 1
            }}
          >
            <option value="All">Vikundi Vyote</option>
            {[...new Set(dataSets.flatMap((item) =>
              item.content.flatMap((group) =>
                group.content.map((inner) => inner.author)
              )
            ))].map((author) => (
              <option key={author} value={author}>
                {formatRoleName(author)}
              </option>
            ))}
          </select>
        </div>
  
        {/* Search Input with loading state */}
        <div className="position-relative d-flex align-items-center" style={{ width: '150px' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control border-purple shadow-sm"
              placeholder="Tafuta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                color: "#6f42c1",
                paddingRight: '2.5rem'
              }}
            />
            {searchQuery && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Futa utafutaji</Tooltip>}
              >
                <button
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-4"
                  onClick={clearSearch}
                  style={{ zIndex: 5 }}
                >
                  <XCircle className="text-secondary" />
                </button>
              </OverlayTrigger>
            )}
            <button
              className="btn btn-purple text-white"
              onClick={handleSearch}
              disabled={searchLoading || !searchQuery.trim()}
            >
              {searchLoading ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : (
                <Search />
              )}
            </button>
          </div>
        </div>
      </div>
  
      {/* Content Area */}
      {searchLoading ? (
        <div className="row">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-light shadow-sm">
                <Placeholder as="div" animation="wave">
                  <Placeholder xs={12} style={{ height: '200px' }} bg="light" />
                  <div className="card-body">
                    <Placeholder as="h5" animation="wave">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as="p" animation="wave">
                      <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} /> <Placeholder xs={6} /> <Placeholder xs={8} />
                    </Placeholder>
                  </div>
                </Placeholder>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Highlights or Search Results */}
          <div className="row">
            {(searchActive && searchResults.length > 0 ? searchResults : filteredData).map(
              (data, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                  <Highlights
                    data={data}
                    datatype={searchResults.length > 0 ? "searchResults" : "default"}
                  />
                </div>
              )
            )}
          </div>
          
          {/* Empty State Messages */}
          {searchActive && searchResults.length === 0 && (
            <div className="text-center my-5 py-5">
              <Search size={48} className="text-muted mb-3" />
              <h5 className="text-purple">Hamna matokeo ya utafutaji</h5>
              <p className="text-muted">Hakuna albamu zilizo na "{searchQuery}"</p>
            </div>
          )}
          {!searchActive && filteredData.length === 0 && (
            <div className="text-center my-5 py-5">
              <Search size={48} className="text-muted mb-3" />
              <h5 className="text-purple">Hamna albamu</h5>
              <p className="text-muted">Hakuna albamu zilizopatikana kwa sasa</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HighlightsWrapper;