"use client";

import React, { useEffect, useState } from "react";
import Highlights from "./Highlights";
import { getRecentHighlights } from "@/actions/highlight";
import { formatRoleName } from "@/actions/utils";

const HighlightsWrapper = () => {
  const [dataSets, setDataSets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

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

  if (loading) {
    return <div>Albamu zinapakia...</div>; // Add a spinner or loader here if needed
  }

  if (error) {
    return <div>Tatizo kupakia albamu: {error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-0 mt-3">
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="form-select w-25"
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select w-25"
        >
          <option value="recent">Hivi Karibuni</option>
        </select>
      </div>

      <div className="row">
        {filteredData.length > 0 ? (
          filteredData.map((data, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
              <Highlights
                data={{
                  ...data,
                  lastUpdated: formatElapsedTime(data.lastUpdated),
                }}
              />
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
