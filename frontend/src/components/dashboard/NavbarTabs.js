import React, { useState } from "react";
import { FaUsers, FaBook, FaBars, FaCrown, FaChurch, FaBell } from "react-icons/fa";
import { MdVolumeUp, MdDashboard } from "react-icons/md";
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

  const storeGroup = (group) => {
    const formattedRole = group.replace('kiongozi_', '');
    Cookies.set("role", formattedRole, { secure: true, sameSite: "Strict" });
  }

  const startsWithKiongozi = (value) => value.startsWith("kiongozi");

  return (
    <li className="nav-item dropdown position-relative">
      {/* Role Badge with Purple Theme */}
      <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2 shadow-sm border border-light-purple">
        <FaChurch className="text-purple me-2" size={16} />
        <span className="fw-semibold text-dark me-2 small">
          {formatRoleName(role)}
        </span>
        
        {/* Notification Bell */}
        {notificationCount > 0 && (
          <div className="position-relative">
            <FaBell 
              className="text-purple cursor-pointer"
              size={16}
              onClick={() => toggleNotifications(role)}
              style={{ cursor: "pointer" }}
            />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ 
                fontSize: "0.6rem",
                minWidth: "18px",
                height: "18px",
                animation: notificationCount > 0 ? "pulse 2s infinite" : "none"
              }}
            >
              {notificationCount}
            </span>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="position-absolute top-100 end-0 mt-2" style={{ zIndex: 1050 }}>
          <Notification notifications={notifications} group={role} />
        </div>
      )}

      {/* Dashboard Dropdown for Kiongozi Roles */}
      {startsWithKiongozi(role) && (
        <div className="mt-2">
          <div className="dropdown">
            <button
              className="btn btn-outline-purple dropdown-toggle w-100 d-flex align-items-center justify-content-center py-2 px-3 rounded-pill shadow-sm"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                borderColor: "#9d4edd",
                color: "#9d4edd",
                transition: "all 0.3s ease",
              }}
            >
              <MdDashboard className="me-2" size={18} />
              <span className="fw-semibold">Dashibodi</span>
            </button>
            
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2"
                style={{
                  minWidth: "280px",
                  maxWidth: "320px",
                  background: "linear-gradient(135deg, #f8f9ff 0%, #e9ecff 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(157, 78, 221, 0.1) !important"
                }}>
              
              <li className="mb-2">
                <div className="text-center py-2">
                  <h6 className="mb-0 text-purple fw-bold">
                    <FaChurch className="me-2" />
                    Dashboard Menu
                  </h6>
                  <small className="text-muted">Church Management Tools</small>
                </div>
                <hr className="my-2 opacity-25" />
              </li>

              {[
                {
                  label: "Wanakikundi",
                  icon: <FaUsers className="me-3 text-primary" size={16} />,
                  action: "users",
                  description: "Manage members"
                },
                {
                  label: "Unda Tangazo",
                  icon: <MdVolumeUp className="me-3 text-success" size={16} />,
                  action: "matangazo",
                  description: "Create announcements"
                },
                {
                  label: "Ingiza Michango",
                  icon: <FaBook className="me-3 text-warning" size={16} />,
                  action: "donations",
                  description: "Record donations"
                },
                {
                  label: "Ingiza Mahudhurio",
                  icon: <FaBook className="me-3 text-info" size={16} />,
                  action: "attendance",
                  description: "Track attendance"
                },
                {
                  label: "Wanakikundi Bora",
                  icon: <FaCrown className="me-3 text-warning" size={16} />,
                  action: "top-members",
                  description: "Top members"
                },
                {
                  label: "Update status",
                  icon: <FaCrown className="me-3 text-purple" size={16} />,
                  link: `/create-highlight/${getLoggedInUserId()}`,
                  description: "Update your status"
                },
                {
                  label: "Anzisha series",
                  icon: <FaBook className="me-3 text-secondary" size={16} />,
                  link: `/admins/series/${getLoggedInUserId()}`,
                  description: "Start new series"
                },
              ].map((item, index) => (
                <li key={index} className="mb-1">
                  {item.link ? (
                    <Link
                      onClick={() => storeGroup(role)}
                      href={item.link}
                      className="dropdown-item d-flex align-items-start text-decoration-none p-3 rounded-3 border-0"
                      style={{
                        transition: "all 0.3s ease",
                        background: "transparent"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(157, 78, 221, 0.1)";
                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.9rem" }}>
                          {item.label}
                        </div>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {item.description}
                        </small>
                      </div>
                    </Link>
                  ) : (
                    <button
                      className="dropdown-item d-flex align-items-start w-100 text-start p-3 rounded-3 border-0"
                      style={{
                        transition: "all 0.3s ease",
                        background: "transparent"
                      }}
                      onClick={() => handleNavigation(role, item.action)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(157, 78, 221, 0.1)";
                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.9rem" }}>
                          {item.label}
                        </div>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {item.description}
                        </small>
                      </div>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
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
    <>
      {/* Custom CSS for Purple Theme */}
      <style jsx>{`
        .text-purple { color: #9d4edd !important; }
        .bg-purple { background-color: #9d4edd !important; }
        .border-light-purple { border-color: rgba(157, 78, 221, 0.2) !important; }
        .btn-outline-purple {
          border-color: #9d4edd;
          color: #9d4edd;
        }
        .btn-outline-purple:hover {
          background-color: #9d4edd;
          border-color: #9d4edd;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(157, 78, 221, 0.3);
        }
        .navbar-brand-custom {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar-custom {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(157, 78, 221, 0.1);
        }
        .mobile-toggle-custom {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          border: none;
          box-shadow: 0 4px 15px rgba(157, 78, 221, 0.2);
        }
        .mobile-toggle-custom:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(157, 78, 221, 0.3);
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .navbar-nav {
            gap: 0.5rem !important;
          }
          .nav-item {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-custom py-3 px-4 shadow-sm sticky-top">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100">
            
            {/* Church Brand/Logo */}
            <div className="d-flex align-items-center">
            
              <Profile user={user} />
            </div>

            {/* Mobile Toggle Button */}
            <div className="d-lg-none position-relative">
              <button
                className="mobile-toggle-custom rounded-circle p-3 text-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTabs"
                aria-controls="navbarTabs"
                aria-expanded="false"
                aria-label="Toggle navigation"
                style={{
                  transition: "all 0.3s ease",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FaBars size={18} />
              </button>
              
              {/* Mobile Notification Badge */}
              {notificationCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "0.7rem",
                    minWidth: "20px",
                    height: "20px",
                    animation: "pulse 2s infinite",
                    zIndex: 10
                  }}
                >
                  {notificationCount}
                </span>
              )}
            </div>
          </div>

          {/* Navbar Content */}
          <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarTabs">
            <ul className="navbar-nav ms-auto d-flex gap-3 fade-in-up">
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #e9ecff 100%)",
          border: "1px solid rgba(157, 78, 221, 0.2)",
          borderRadius: "12px"
        }}
      />
    </>
  );
};

export default NavbarTabs;