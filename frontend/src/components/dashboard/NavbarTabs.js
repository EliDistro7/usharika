import React, { useState } from "react";
import { FaBell, FaUsers, FaBook } from "react-icons/fa";
import { MdVolumeUp } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Profile from "./Profile";
import Notification from "./Notification";

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
      <button
        className="nav-link dropdown-toggle d-flex align-items-center"
        onClick={() => toggleNotifications(role)}
      >
        <span className="fw-bold">{formatRoleName(role)}</span>
        {notificationCount > 0 && (
          <span className="badge bg-danger ms-2">{notificationCount}</span>
        )}
      </button>

      {showNotifications && <Notification notifications={notifications} group={role} />}

      <ul className="dropdown-menu shadow">
        <li>
          <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => handleNavigation(role, "users")}
          >
            <FaUsers className="me-2 text-primary" /> Wanakikundi
          </button>
        </li>

        {startsWithKiongozi(role) && (
          <>
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
                onClick={() => handleNavigation(role, "attendance")}
              >
                <FaBook className="me-2 text-warning" /> Ingiza Mahudhurio
              </button>
            </li>
          </>
        )}
      </ul>
    </li>
  );
};


const NavbarTabs = ({ roles, notifications = [], user }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(null);

  

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
    <nav className="navbar navbar-expand-lg shadow-sm p-3 rounded">
      <div className="container-fluid">
        <Profile user={user} />

        {/* Mobile Toggle Button */}
        {roles.some((role) => role.startsWith("kiongozi")) && (
          <button
            className="navbar-toggler ms-auto text-black"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTabs"
            aria-controls="navbarTabs"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

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
    </nav>
  );
};

export default NavbarTabs;
