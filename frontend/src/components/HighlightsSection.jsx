

"use client";

import React from "react";
import Highlights from "./Highlights"; // Adjust the import path as needed

const HighlightsSection = ({ sections }) => {
  return (
    <section className="py-4 px-3">
      <h2 className="text-center mb-4 text-dark">Marejeo ya Matukio</h2>
      <div className="row g-4">
        {sections.map((section, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <Highlights data={section} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
