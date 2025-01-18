import React, { useState } from "react";
import Cookies from "js-cookie";
import { getLoggedInUserId } from "@/hooks/useUser";
import { formatRoleName } from "@/actions/utils";
import { FaHome, FaBullhorn, FaDonate, FaClipboardCheck, FaUsers, FaPen } from "react-icons/fa";

const Sidebar = ({ children }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false); // Toggle for collapsed view
  const loggedInUserId = getLoggedInUserId();

  // Define navigation links with icons
  const navLinks = [
    { href: `/akaunti/${loggedInUserId}`, label: "Home", key: "home", icon: <FaHome /> },
    { href: `/admins/matangazo/${loggedInUserId}`, label: "Matangazo", key: "matangazo", icon: <FaBullhorn /> },
    { href: `/admins/donations/${loggedInUserId}`, label: "Michango", key: "michango", icon: <FaDonate /> },
    { href: `/admins/attendance/${loggedInUserId}`, label: "Mahudhurio", key: "attendance", icon: <FaClipboardCheck /> },
    { href: `/admins/top-members/${loggedInUserId}`, label: "Top Members", key: "top-members", icon: <FaUsers /> },
    { href: `/create-highlight/${loggedInUserId}`, label: "Update Status", key: "update-status", icon: <FaPen /> },
  ];

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: isCollapsed ? "80px" : "250px",
          backgroundColor: "#6f42c1",
          color: "white",
          padding: "20px",
          transition: "width 0.3s ease",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: isCollapsed ? "center" : "left",
          }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "☰" : formatRoleName(Cookies.get("role") || "User")}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          {isCollapsed ? "→" : "←"}
        </button>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navLinks.map((link) => (
            <li key={link.key} style={{ marginBottom: "15px" }}>
              <a
                href={link.href}
                onClick={() => setActiveTab(link.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: activeTab === link.key ? "#fff" : "#d1d1d1",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: activeTab === link.key ? "bold" : "normal",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                }}
              >
                <span style={{ fontSize: "20px", marginRight: isCollapsed ? "0" : "10px" }}>
                  {link.icon}
                </span>
                {!isCollapsed && link.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
};

export default Sidebar;
