"use client";

import React, { useEffect, useState } from "react";
import FadeCarousel from "./FadeCarousel"; // Using the FadeCarousel component for the main slider
import { Zoom } from "react-awesome-reveal"; // Importing the Zoom animation from react-awesome-reveal
import { getAllFutureEvents } from "@/actions/future-event"; // Importing the API action

const MainSlider = () => {
  const [mainSlides, setMainSlides] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllFutureEvents(); // Fetch future events
        setMainSlides(data.data || []); // Set the fetched slides
      } catch (err) {
        setError("Failed to fetch slides. Please try again.");
        console.error(err);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-fluid bg-gradient-custom">
      <div className="row">
        {/* Main Carousel */}
        <div className="">
          <FadeCarousel>
            {mainSlides.map((slide, index) => (
              <div
                key={index}
                className="position-relative overflow-hidden"
                style={{ height: "500px" }}
              >
                {/* Background Image */}
                <img
                  className="img-fluid h-100"
                  src={slide.image}
                  alt={slide.title}
                  style={{ objectFit: "cover" }}
                />

                {/* Text Content */}
                <div
                  className="overlay text-white"
                  style={{ backgroundColor: "rgba(0,0,0,.23" }}
                >
                  <Zoom duration={1000} delay={200}>
                    {/* Category */}
                    <div className="badge-container">
                      <a
                        className="badge text-uppercase text-white font-weight-bold px-3 py-2"
                        href={slide.categoryLink}
                        style={{
                          backgroundColor: "#6f42c1",
                        }}
                      >
                        {slide.category}
                      </a>
                    </div>

                    {/* Title */}
                    <div className="title-container mt-auto">
                      <a
                        className="h1 text-white text-uppercase font-weight-bold fw-bold"
                        href={slide.link}
                      >
                        {slide.title}
                      </a>
                      {slide.subtitle && (
                        <p className="text-white mt-2">{slide.subtitle}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="date-container mt-2">
                      <small>
                        <a className="text-white" href={slide.dateLink}>
                          {slide.date}
                        </a>
                      </small>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons mt-3">
                      {slide.buttons?.map((button, btnIndex) => (
                        <a
                          key={btnIndex}
                          href={button.link}
                          className={`btn ${button.className} btn-sm text-uppercase font-weight-bold`}
                          style={{ animationDelay: `${1000 + btnIndex * 200}ms` }}
                        >
                          {button.label}
                        </a>
                      ))}
                    </div>
                  </Zoom>
                </div>
              </div>
            ))}
          </FadeCarousel>
          <style jsx>{`
            .bg-gradient-custom {
              background: rgba(0, 0, 0, 0.6);
            }
            button:hover {
              opacity: 0.9;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default MainSlider;
