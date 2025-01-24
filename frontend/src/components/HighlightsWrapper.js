import React, { useEffect, useState } from "react";
import Highlights from "./Highlights"; // Assuming Highlights is a sibling component
import { getRecentHighlights } from "@/actions/highlight";

const HighlightsWrapper = () => {
  const [dataSets, setDataSets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [sortBy, setSortBy] = useState("recent"); // Default sorting by most recent

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await getRecentHighlights();
        setDataSets(response.data); // Assuming `response.data` contains the list of highlights
      } catch (err) {
        console.error("Error fetching highlights:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  // Apply filtering and sorting whenever `dataSets`, `selectedAuthor`, or `sortBy` changes
  useEffect(() => {
    let filtered = [...dataSets];

    // Filter by selected author
    if (selectedAuthor !== "All") {
      filtered = filtered.filter((item) =>
        item.author.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
    }

    // Sort by most recent lastUpdated
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    setFilteredData(filtered);
  }, [dataSets, selectedAuthor, sortBy]);

  if (loading) {
    return <div>Albamu zinapakia...</div>; // Add a spinner or loader here if needed
  }

  if (error) {
    return <div>Tatizo kupakia albamu: {error}</div>;
  }

  return (
    <div className="container-fluid">
      {/* Filter and Sort Controls */}
      <div className="d-flex justify-content-between align-items-center mb-0 mt-3">
        {/* Author Filter */}
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="form-select w-25"
        >
          <option value="All">Vikundi Vyote</option>
          {[...new Set(dataSets.map((item) => item.author))].map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select w-25"
        >
          <option value="recent">Hivi Karibuni</option>
          {/* Add other sort criteria if needed */}
        </select>
      </div>

      {/* Highlights Grid */}
      <div className="row">
        {filteredData.length > 0 ? (
          filteredData.map((data, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
              <Highlights data={data} />
            </div>
          ))
        ) : (
          <div className="text-center">Hamna albamu</div>
        )}
      </div>
    </div>
  );
};

export default HighlightsWrapper;
