import React, { useState } from "react";
import {  FaUsers, FaBook, FaBars,FaCrown } from "react-icons/fa";
import { MdVolumeUp } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./Profile";
import Notification from "./Notification";
import { getLoggedInUserId, removeCookie } from "@/hooks/useUser";
import Link from "next/link";
// Helper function to format role names
const formatRoleName = (role) =>
  role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Role Dropdown Component
const RoleDropdown = ({
  role,
  notifications = [],
  handleNavigation,
  toggleNotifications,
  showNotifications,
}) => {
  const notificationCount = Array.isArray(notifications)
    ? notifications.filter((n) => n.group === role).length
    : 0;

  // Function to check if the role starts with "kiongozi"
  function startsWithKiongozi(value) {
    return value.startsWith("kiongozi");
  }

  return (
    <li className="nav-item dropdown">
      <button className="nav-link d-flex align-items-center">
        <span className="fw-bold">{formatRoleName(role)}</span>
        {notificationCount > 0 && (
          <span
            className="badge bg-danger ms-2"
            onClick={() => toggleNotifications(role)}
          >
            {notificationCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <Notification notifications={notifications} group={role} />
      )}

      <div className="dropdown shadow">
        {startsWithKiongozi(role) && (
          <>
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Options
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleNavigation(role, "users")}
                >
                  <FaUsers className="me-2 text-primary" /> Wanakikundi
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleNavigation(role, "matangazo")}
                >
                  <MdVolumeUp className="me-2 text-success" /> Unda Tangazo
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleNavigation(role, "donations")}
                >
                  <FaBook className="me-2 text-warning" /> Ingiza Michango
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleNavigation(role, "attendance")}
                >
                  <FaBook className="me-2 text-warning" /> Ingiza Mahudhurio
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleNavigation(role, "top-members")}
                >
                  <FaCrown className="me-2 text-warning" /> Wanakikundi Bora
                </button>
              </li>
              <li>
                <Link
                  href={`/create-highlight/${getLoggedInUserId()}`}
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleNavigation(role, "top-members")}
                >
                  <FaCrown className="me-2 text-warning" /> Update status
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </li>
  );
};

const NavbarTabs = ({ roles, notifications = [], user }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(null);

  const notificationCount = Array.isArray(notifications)
    ? notifications.filter((n) => n.status === "unread").length
    : 0;

  // Handle navigation based on the role and action
  const handleNavigation = (role, path) => {
    const adminId = user?._id;
    if (!adminId) {
      console.error("Admin ID is not available!");
      return;
    }

    const formattedRole = role.replace("kiongozi_", "");
    Cookies.set("role", formattedRole, { secure: true, sameSite: "Strict" });
    router.push(`/admins/${path}/${adminId}`);
  };

  // Toggle notifications
  const toggleNotifications = (role) => {
    setShowNotifications((prev) => (prev === role ? null : role));
  };






  return (
    <nav className="navbar navbar-expand-lg shadow-sm p-3 rounded w-100 overflow-x-hidden">
      <div className="w-100 overflow-scroll">
        <div className=" d-flex justify-content-start w-100">
          <Profile user={user} />
      
         
          {/* Mobile Toggle Button */}
          <div className="position-relative ">
            <button
              className="navbar-toggler text-black  border "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTabs"
              aria-controls="navbarTabs"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <FaBars />
            </button>
            {notificationCount > 0 && (
  <span
    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-lg-none"
    style={{ fontSize: "0.75rem" }}
  >
    {notificationCount}
  </span>
)}

          </div>
     
        </div>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarTabs">
          <ul className="navbar-nav ms-auto">
            {roles.map((role, index) => (
              <RoleDropdown
                key={index}
                role={role}
                notifications={notifications}
                handleNavigation={handleNavigation}
                toggleNotifications={toggleNotifications}
                showNotifications={showNotifications === role}
              />
            ))}
          </ul>
        
        </div>
         

      </div>
      <ToastContainer />
    </nav>
  );
};

export default NavbarTabs;
