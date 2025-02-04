"use client";

import React, { useEffect, useState } from "react";
import Highlights from "./Highlights2";
import { getRecentHighlights, searchHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";

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
      //console.log('results in the state:', searchResults);
      //console.log('search result fetched', results.data)

    } catch (err) {
      console.error("Error searching highlights:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return <div>Albamu zinapakia...</div>; // Add a spinner or loader here if needed
  }

  if (error) {
    return <div>Tatizo kupakia albamu: {error}</div>;
  }

  return (
    <div className="container-fluid mt-3">
      {/* Search and Filters Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Author Filter Dropdown */}
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="form-select w-25 border-purple shadow-sm"
          style={{ backgroundColor: "#fff", color: "#6f42c1" }}
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
  
        {/* Search Icon and Overlay */}
        <div className="position-relative">
          {/* Search Icon */}
          <i
            className="fa fa-search text-purple cursor-pointer"
            onClick={() => setSearchActive(!searchActive)}
            style={{ fontSize: "1.5rem", cursor: "pointer", marginRight: "13px" }}
          ></i>
  
          {/* Search Overlay */}
          {searchActive && (
            <div
              className="position-absolute bg-white shadow-lg p-3"
              style={{
                top: "2.5rem",
                right: "0",
                zIndex: 1050, // High zIndex to ensure it overlays
                borderRadius: "0.5rem",
                width: "300px",
              }}
            >
              {/* Input Field */}
              <input
                type="text"
                className="form-control border-purple shadow-sm"
                placeholder="Tafuta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  zIndex: 1060, // Higher zIndex for interaction priority
                  color: "#6f42c1",
                }}
              />
  
              {/* Search Button */}
              <button
                className="btn btn-purple mt-2 w-100 shadow-sm text-white"
                onClick={handleSearch}
                style={{
                  zIndex: 1060,
                }}
              >
                Tafuta
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* Highlights or Search Results */}
      <div className="row">
        {(searchActive && searchResults.length > 0 ? searchResults : filteredData).map(
          (data, index) => {
            return (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                <Highlights
                  data={data}
                  datatype={searchResults.length > 0 ? "searchResults" : "default"}
                />
              </div>
            );
          }
        )}
        {searchActive && searchResults.length === 0 && (
          <div className="text-center text-purple">Hamna matokeo ya utafutaji</div>
        )}
        {!searchActive && filteredData.length === 0 && (
          <div className="text-center text-purple">Hamna albamu</div>
        )}
      </div>
    </div>
  );
};

export default HighlightsWrapper;
