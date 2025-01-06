


import React, { useEffect, useState } from "react";
import Highlights from "./Highlights"; // Assuming Highlights is a sibling component
import { getRecentHighlights } from "@/actions/highlight";


const HighlightsWrapper = () => {
  const [dataSets, setDataSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading highlights...</div>; // Add a spinner or loader here if needed
  }

  if (error) {
    return <div>Error loading highlights: {error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {dataSets.map((data, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
            <Highlights data={data} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightsWrapper;
