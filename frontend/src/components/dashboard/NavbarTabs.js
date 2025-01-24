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

    const storeGroup = (group) =>{
      const formattedRole =group.replace('kiongozi_','');
      
      Cookies.set("role", formattedRole, { secure: true, sameSite: "Strict" });
     
    }

  const startsWithKiongozi = (value) => value.startsWith("kiongozi");

  return (
    <li className="nav-item dropdown">
      <button className="nav-link d-flex align-items-center">
        <span className=" me-2 ">{formatRoleName(role)}</span>
        {notificationCount > 0 && (
          <span
            className="badge bg-danger rounded-pill"
            style={{ cursor: "pointer" }}
            onClick={() => toggleNotifications(role)}
          >
            {notificationCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <Notification notifications={notifications} group={role} />
      )}

      {startsWithKiongozi(role) && (
        <div className="dropdown-menu-wrapper position-relative">
          <button
            className="btn btn-primary dropdown-toggle w-100 mt-2"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dashibodi
          </button>
          <ul
            className="dropdown-menu shadow rounded-3 p-2"
            aria-labelledby="dropdownMenuButton"
            style={{ minWidth: "250px" }}
          >
            {[
              {
                label: "Wanakikundi",
                icon: <FaUsers className="me-3 text-primary" />,
                action: "users",
              },
              {
                label: "Unda Tangazo",
                icon: <MdVolumeUp className="me-3 text-success" />,
                action: "matangazo",
              },
              {
                label: "Ingiza Michango",
                icon: <FaBook className="me-3 text-warning" />,
                action: "donations",
              },
              {
                label: "Ingiza Mahudhurio",
                icon: <FaBook className="me-3 text-warning" />,
                action: "attendance",
              },
              {
                label: "Wanakikundi Bora",
                icon: <FaCrown className="me-3 text-warning" />,
                action: "top-members",
              },
              {
                label: "Update status",
                icon: <FaCrown className="me-3 text-warning" />,
                link: `/create-highlight/${getLoggedInUserId()}`,
              },
            ].map((item, index) => (
              <li key={index} className="mb-2">
                {item.link ? (
                  <Link
                    onClick={()=>{
                       storeGroup(role)
                    }}
                    href={item.link}
                    className="dropdown-item d-flex align-items-center py-2 rounded text-dark"
                    style={{ transition: "background-color 0.2s ease-in-out" }}
                  >
                    {item.icon} {item.label}
                  </Link>
                ) : (
                  <button
                    className="dropdown-item d-flex align-items-center py-2 rounded text-dark"
                    style={{ transition: "background-color 0.2s ease-in-out" }}
                    onClick={() => handleNavigation(role, item.action)}
                  >
                    {item.icon} {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
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
    <nav className="navbar navbar-expand-lg p-1 w-100 ">
      <div className="w-100 ">
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
