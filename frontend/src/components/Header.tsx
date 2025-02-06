'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { getDesanitezedCookie } from "@/hooks/useUser";
import Notifications from "./Notifications";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "./TopBar";

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
      <header className="border-bottom bg-white shadow-sm">
        {/* Top bar */}
        <TopBar />
  
        {/* Main Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light py-3 container">
          <a href="/" className="navbar-brand">
            <h1 className="m-0">
              <span style={{ color: "#6a0dad" }}>KKKT</span>{" "}
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
                <a
                  href="/"
                  className="nav-link"
                  style={{ color: "#6a0dad", fontWeight: "500" }}
                >
                  Nyumbani
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/about"
                  className="nav-link"
                  style={{ color: "#6a0dad", fontWeight: "500" }}
                >
                  Fahamu Zaidi
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/kalenda"
                  className="nav-link"
                  style={{ color: "#6a0dad", fontWeight: "500" }}
                >
                  Kalenda ya Matukio
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/uongozi"
                  className="nav-link"
                  style={{ color: "#6a0dad", fontWeight: "500" }}
                >
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
                  style={{ color: "#6a0dad", fontWeight: "500" }}
                >
                  System
                </a>
                <ul className="dropdown-menu shadow-sm">
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
                <a
                  href="/contact"
                  className="nav-link"
                  style={{ color: "#6a0dad", fontWeight: "500" }}
                >
                  Mawasiliano
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <div className="me-2">
                <i
                  className="fas fa-phone-alt fa-lg"
                  style={{ color: "#6a0dad" }}
                ></i>
              </div>
              <div>
                <small className="text-secondary">Wasiliana nasi</small>
                <p className="mb-0">
                  <a
                    href="tel: +255765647567"
                    className="text-decoration-none"
                    style={{ color: "#9c27b0", fontWeight: "500" }}
                  >
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
