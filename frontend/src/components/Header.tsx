'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { getDesanitezedCookie } from "@/hooks/useUser";
import Notifications from "./Notifications";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header() {
  const router = useRouter();

  const handleAkauntiNavigation = () => {
    const cookieValue = getDesanitezedCookie();
    if (cookieValue) {
      router.push(`/akaunti/${cookieValue}`);
      toast.success("Umefanikiwa kuingia kwenye akaunti yako!");
    } else {
      router.push("/auth");
      toast.warning("Tafadhali, ingia kwenye akaunti yako!");
    }
  };

  return (
    <>
      {/* Navbar Start */}
      <header className="border-bottom bg-white">
        {/* Top bar */}
        <div
          className="container-fluid text-white py-2"
          style={{
            backgroundColor: "#6f42c1", // Deep purple background
            borderRadius: "0 0 46px 46px",
          }}
        >
          <div className="container d-flex justify-content-between align-items-center">
            {/* Contact Info */}
            <div className="d-flex align-items-center">
             
           
              <small>
                <i className="fas fa-phone-alt me-2"></i>
                <a href="tel:+255617833806" className="text-white text-decoration-none">
                  +255 617 833 806
                </a>
              </small>
            </div>

            {/* Social Icons */}
            <div className="d-flex">
              <Notifications />
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light py-3 container">
          <a href="/" className="navbar-brand">
            <h1 className="m-0">
              <span style={{ color: "#6a1b9a" }}>KKKT</span>{" "}
              <span className="text-secondary">Yombo</span>
            </h1>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a href="/" className="nav-link" style={{ color: "#6a1b9a" }}>
                  Nyumbani
                </a>
              </li>
              <li className="nav-item">
                <a href="/about" className="nav-link" style={{ color: "#6a1b9a" }}>
                  Fahamu Zaidi
                </a>
              </li>
              <li className="nav-item">
                <a href="/kalenda" className="nav-link" style={{ color: "#6a1b9a" }}>
                  Kalenda ya Matukio
                </a>
              </li>
              <li className="nav-item">
                <a href="/uongozi" className="nav-link" style={{ color: "#6a1b9a" }}>
                  Uongozi
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="systemDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: "#6a1b9a" }}
                >
                  System
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/usajili" className="dropdown-item">
                      Kujisajili
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={handleAkauntiNavigation}
                    >
                      Akaunti
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={handleAkauntiNavigation}
                    >
                      Login
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="/contact" className="nav-link" style={{ color: "#6a1b9a" }}>
                  Mawasiliano
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <div className="me-2">
                <i className="fas fa-phone-alt fa-lg" style={{ color: "#6a1b9a" }}></i>
              </div>
              <div>
                <small className="text-secondary">Wasiliana nasi</small>
                <p className="mb-0">
                  <a href="tel: +255765647567" className="text-decoration-none" style={{ color: "#9c27b0" }}>
                    +255 765 647 567
                  </a>
                </p>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* Navbar End */}
    </>
  );
}
