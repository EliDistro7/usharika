
'use client';
import React, { useState } from "react";
import "./Footer.css"; // Import custom CSS for styling

const Footer = () => {
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showOperatingHours, setShowOperatingHours] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  return (
    <footer className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-5">
        <div className="row g-5">
          {/* About Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <h2 className="fw-bold mb-3">
                <span style={{ color: "#6f42c1" }}>KKKT</span>{" "}
                <span className="text-mute">YOMBO</span>
              </h2>
            
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <button
                className="btn btn-link text-decoration-none fw-bold"
                style={{ color: "#6f42c1" }}
                onClick={() => setShowQuickLinks(!showQuickLinks)}
              >
                Viunganishi {showQuickLinks ? "▲" : "▼"}
              </button>
              <div
                className={`collapsed-content ${showQuickLinks ? "expanded" : ""}`}
              >
                <ul className="list-unstyled mt-3">
                  <li>
                    <a href="/" className="text-body mb-2 d-block">
                      <i className="fa fa-chevron-right me-2 text-primary"></i>
                      Nyumbani
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-body mb-2 d-block">
                      <i className="fa fa-chevron-right me-2 text-primary"></i>
                      Fahamu Zaidi
                    </a>
                  </li>
                  <li>
                    <a href="/kalenda" className="text-body mb-2 d-block">
                      <i className="fa fa-chevron-right me-2 text-primary"></i>
                      Kalenda ya Matukio
                    </a>
                  </li>
                  <li>
                    <a href="/uongozi" className="text-body mb-2 d-block">
                      <i className="fa fa-chevron-right me-2 text-primary"></i>
                      Uongozi
                    </a>
                  </li>
                  <li>
                    <a href="/usajili" className="text-body mb-2 d-block">
                      <i className="fa fa-chevron-right me-2 text-primary"></i>
                      Kujisajili
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-body mb-2 d-block">
                      <i className="fa fa-chevron-right me-2 text-primary"></i>
                      Mawasiliano
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <button
                className="btn btn-link text-decoration-none fw-bold"
                style={{ color: "#6f42c1" }}
                onClick={() => setShowOperatingHours(!showOperatingHours)}
              >
                Ofisi ya Mchungaji {showOperatingHours ? "▲" : "▼"}
              </button>
              <div
                className={`collapsed-content ${showOperatingHours ? "expanded" : ""}`}
              >
                <p>Jumatatu: 8am - 5pm</p>
                <p>Jumanne: 8am - 5pm</p>
                <p>Jumatano: 8am - 5pm</p>
                <p>Alhamis: 8am - 5pm</p>
                <p>Ijumaa: 8am - 5pm</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <button
                className="btn btn-link text-decoration-none fw-bold"
                style={{ color: "#6f42c1" }}
                onClick={() => setShowLocation(!showLocation)}
              >
                Mahali {showLocation ? "▲" : "▼"}
              </button>
              <div
                className={`collapsed-content ${showLocation ? "expanded" : ""}`}
              >
                <p>
                  <i className="fa fa-map-marker-alt text-primary me-2"></i>
                  104 Yombo Kiwalani, Dar Es Salaam, URT
                </p>
                <p>
                  <i className="fa fa-phone-alt text-primary me-2"></i>
                  (+012) 3456 7890 123
                </p>
                <p>
                  <i className="fas fa-envelope text-primary me-2"></i>
                  yombolutheran@gmail.com
                </p>
                <div className="footer-icon d-flex">
                  <a
                    className="btn btn-primary btn-sm-square me-3 rounded-circle text-white"
                    href="#"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    className="btn btn-primary btn-sm-square me-3 rounded-circle text-white"
                    href="#"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    className="btn btn-primary btn-sm-square rounded-circle text-white"
                    href="#"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Closing Information */}
          <div className="col-12 text-center mt-5">
            <p className="mt-3">
              KKKT Usharika wa Yombo Online System 2024 <br />
              Haki zote zimehifadhiwa
            </p>
            <p className="mt-2">
              Designed with{" "}
              <span role="img" aria-label="love">
                ❤️
              </span>{" "}
              by{" "}
              <a
                href="https://wa.me/255765762688"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                Bari Kaneno
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
