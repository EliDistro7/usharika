'use client';
import React, { useState } from "react";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const Footer = () => {
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showOperatingHours, setShowOperatingHours] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  return (
    <footer className="container-fluid py-5" style={{ backgroundColor: "#F5F3FF", borderTop: "3px solid #9370DB" }}>
      <div className="container py-4">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="mb-4">
              <h2 className={`${cinzel.className} fw-bold mb-3`} style={{ fontSize: "2rem", color: "#6A0DAD" }}>
                <span style={{ color: "#9370DB" }}>KKKT</span>{" "}
                <span style={{ color: "#6A0DAD" }}>YOMBO</span>
              </h2>
              <p className={`${cormorant.className}`} style={{ fontSize: "1.1rem" }}>
                Kanisa la Kilutheri Tanzania - Usharika wa Yombo.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="mb-4">
              <button
                className={`${playfair.className} btn btn-link text-decoration-none fw-bold p-0`}
                style={{ color: "#6A0DAD", fontSize: "1.2rem" }}
                onClick={() => setShowQuickLinks(!showQuickLinks)}
              >
                Viunganishi {showQuickLinks ? "▲" : "▼"}
              </button>
              <div className={`collapse ${showQuickLinks ? "show" : ""}`}>
                <ul className="list-unstyled mt-3">
                  {[
                    { name: "Nyumbani", path: "/" },
                    { name: "Fahamu Zaidi", path: "/about" },
                    { name: "Kalenda ya Matukio", path: "/kalenda" },
                    { name: "Uongozi", path: "/uongozi" },
                    { name: "Kujisajili", path: "/usajili" },
                    { name: "Mawasiliano", path: "/contact" }
                  ].map((link, index) => (
                    <li key={index} className="mb-2">
                      <a 
                        href={link.path} 
                        className={`${cormorant.className} d-flex align-items-center text-decoration-none`}
                        style={{ color: "#6A0DAD", fontSize: "1.1rem" }}
                      >
                        <i className="fas fa-chevron-right me-2" style={{ color: "#9370DB", fontSize: "0.8rem" }}></i>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="mb-4">
              <button
                className={`${playfair.className} btn btn-link text-decoration-none fw-bold p-0`}
                style={{ color: "#6A0DAD", fontSize: "1.2rem" }}
                onClick={() => setShowOperatingHours(!showOperatingHours)}
              >
                Ofisi ya Mchungaji {showOperatingHours ? "▲" : "▼"}
              </button>
              <div className={`collapse ${showOperatingHours ? "show" : ""}`}>
                <div className={`${cormorant.className} mt-3`} style={{ fontSize: "1.1rem" }}>
                  {["Jumatatu", "Jumanne", "Jumatano", "Alhamis", "Ijumaa"].map((day) => (
                    <p key={day} className="mb-2">
                      {day}: <span style={{ color: "#9370DB" }}>8am - 5pm</span>
                    </p>
                  ))}
                   <p className="mb-2">
                      Jumamosi: <span style={{ color: "#9370DB" }}>8am - 5pm</span>
                    </p>
                    
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="mb-4">
              <button
                className={`${playfair.className} btn btn-link text-decoration-none fw-bold p-0`}
                style={{ color: "#6A0DAD", fontSize: "1.2rem" }}
                onClick={() => setShowLocation(!showLocation)}
              >
                Mahali {showLocation ? "▲" : "▼"}
              </button>
              <div className={`collapse ${showLocation ? "show" : ""}`}>
                <div className={`${cormorant.className} mt-3`} style={{ fontSize: "1.1rem" }}>
                  <p className="mb-2">
                    <i className="fas fa-map-marker-alt me-2" style={{ color: "#9370DB" }}></i>
                    1110 Yombo Kiwalani, Dar Es Salaam
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-phone-alt me-2" style={{ color: "#9370DB" }}></i>
                    <a href="tel:+255765647567" className="text-decoration-none" style={{ color: "#6A0DAD" }}>
                      +255 765 647 567
                    </a>
                  </p>
                  <p className="mb-3">
                    <i className="fas fa-envelope me-2" style={{ color: "#9370DB" }}></i>
                    <a href="mailto:yombolutheran@gmail.com" className="text-decoration-none" style={{ color: "#6A0DAD" }}>
                      info@kkktyombo.org
                    </a>
                  </p>
                  <div className="d-flex">
                    {['facebook-f', 'instagram', 'youtube'].map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="btn btn-sm rounded-circle me-2"
                        style={{ 
                          backgroundColor: "#9370DB",
                          color: "white",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <i className={`fab fa-${platform}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4 pt-3 border-top border-purple">
          <div className="col-12 text-center">
            <p className={`${cormorant.className} mb-0`} style={{ fontSize: "1rem", color: "#6A0DAD" }}>
              KKKT Usharika wa Yombo Online 2025<br />
              <span style={{ color: "#9370DB" }}>Haki zote zimehifadhiwa</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;