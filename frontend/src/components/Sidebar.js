"use client";

import React, { useState } from "react";
import { FaPlay, FaHome, FaSearch, FaChartBar, FaBook, FaBoxOpen, FaCog, FaEnvelope, FaUser, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`d-flex flex-column bg-dark text-light p-3 ${
          isCollapsed ? "d-none d-md-flex" : "d-flex"
        }`}
        style={{ width: "200px", height: "100vh" }}
      >
        {/* App Logo */}
        <a href="#" className="d-flex align-items-center w-100 mb-3 text-decoration-none text-light">
          <FaPlay size={24} className="me-2" />
          <span className="fw-bold">The App</span>
        </a>

        {/* Navigation Links */}
        <div className="w-100 border-top pt-3">
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded text-decoration-none text-light hover-bg-secondary">
            <FaHome size={20} className="me-2" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded text-decoration-none text-light hover-bg-secondary">
            <FaSearch size={20} className="me-2" />
            <span>Search</span>
          </a>
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded bg-secondary text-light">
            <FaChartBar size={20} className="me-2" />
            <span>Insights</span>
          </a>
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded text-decoration-none text-light hover-bg-secondary">
            <FaBook size={20} className="me-2" />
            <span>Docs</span>
          </a>
        </div>

        {/* Products and Settings Links */}
        <div className="w-100 border-top pt-3">
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded text-decoration-none text-light hover-bg-secondary">
            <FaBoxOpen size={20} className="me-2" />
            <span>Products</span>
          </a>
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded text-decoration-none text-light hover-bg-secondary">
            <FaCog size={20} className="me-2" />
            <span>Settings</span>
          </a>
          <a href="#" className="d-flex align-items-center w-100 py-2 px-3 rounded text-decoration-none text-light hover-bg-secondary position-relative">
            <FaEnvelope size={20} className="me-2" />
            <span>Messages</span>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle"></span>
          </a>
        </div>

        {/* Account Link */}
        <a href="#" className="d-flex align-items-center justify-content-center w-100 py-3 mt-auto bg-secondary text-light text-decoration-none hover-bg-dark">
          <FaUser size={20} className="me-2" />
          <span>Account</span>
        </a>
      </div>

      {/* Toggle Button for Small Screens */}
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 m-2"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FaBars size={24} />
      </button>
    </div>
  );
};

export default Sidebar;
