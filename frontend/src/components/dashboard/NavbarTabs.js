import React, { useState } from "react";
import { 
  Users, 
  Book, 
  Menu, 
  Crown, 
  Church, 
  Bell, 
  X, 
  VolumeX, 
  LayoutDashboard,
  ChevronDown,
  UserCheck,
  TrendingUp,
  Calendar,
  Sparkles
} from "lucide-react";
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
  isMobile = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const notificationCount = Array.isArray(notifications)
    ? notifications.filter((n) => n.group === role).length
    : 0;

  const storeGroup = (group) => {
    const formattedRole = group.replace('kiongozi_', '');
    Cookies.set("role", formattedRole, { secure: true, sameSite: "Strict" });
  }

  const startsWithKiongozi = (value) => value.startsWith("kiongozi");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <li className={`relative ${isMobile ? 'w-full mb-4' : ''}`}>
      {/* Role Badge with Purple Theme */}
      <div className={`flex items-center bg-background-100 rounded-full px-4 py-2 shadow-soft border border-primary-200/30 ${isMobile ? 'justify-between' : ''}`}>
        <div className="flex items-center">
          <Church className="text-primary-600 mr-2" size={isMobile ? 18 : 16} />
          <span className={`font-semibold text-text-primary mr-2 ${isMobile ? '' : 'text-sm'}`}>
            {formatRoleName(role)}
          </span>
        </div>
        
        {/* Notification Bell */}
        {notificationCount > 0 && (
          <div className="relative">
            <Bell 
              className="text-primary-600 cursor-pointer hover:text-primary-700 transition-colors"
              size={isMobile ? 18 : 16}
              onClick={() => toggleNotifications(role)}
            />
            <span
              className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold animate-pulse-soft"
              style={{ fontSize: isMobile ? "0.65rem" : "0.6rem" }}
            >
              {notificationCount}
            </span>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div 
          className={`absolute mt-2 z-[1050] ${isMobile ? 'left-0 right-0' : 'top-full right-0'}`}
        >
          <Notification notifications={notifications} group={role} />
        </div>
      )}

      {/* Dashboard Dropdown for Kiongozi Roles */}
      {startsWithKiongozi(role) && (
        <div className="mt-3">
          <div className="relative">
            <button
              className={`btn-primary rounded-full py-2 px-4 shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center ${isMobile ? 'w-full' : 'w-full'}`}
              type="button"
              onClick={toggleDropdown}
            >
              <LayoutDashboard className="mr-2" size={isMobile ? 20 : 18} />
              <span className="font-semibold">Dashibodi</span>
              <ChevronDown className={`ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            
            {isDropdownOpen && (
              <div className={`absolute mt-2 shadow-strong border-0 rounded-3xl p-3 bg-gradient-to-br from-background-200 to-background-300 backdrop-blur-lg border border-primary-200/20 z-[9999] ${isMobile ? 'left-0 right-0' : 'right-0'}`}
                  style={{
                    minWidth: isMobile ? "100%" : "280px",
                    maxWidth: isMobile ? "100%" : "320px",
                  }}>
                
                <div className="mb-3">
                  <div className="text-center py-3">
                    <h6 className="mb-1 text-primary-700 font-bold flex items-center justify-center">
                      <Church className="mr-2" size={18} />
                      Dashboard Menu
                    </h6>
                    <p className="text-text-tertiary text-xs">Church Management Tools</p>
                  </div>
                  <hr className="border-primary-200/25" />
                </div>

                <div className="space-y-1">
                  {[
                    {
                      label: "Wanakikundi",
                      icon: <Users className="mr-3 text-blue-500" size={16} />,
                      action: "users",
                      description: "Manage members"
                    },
                    {
                      label: "Unda Tangazo",
                      icon: <VolumeX className="mr-3 text-success-500" size={16} />,
                      action: "matangazo",
                      description: "Create announcements"
                    },
                    {
                      label: "Ingiza Michango",
                      icon: <Book className="mr-3 text-warning-500" size={16} />,
                      action: "donations",
                      description: "Record donations"
                    },
                    {
                      label: "Ingiza Mahudhurio",
                      icon: <UserCheck className="mr-3 text-blue-400" size={16} />,
                      action: "attendance",
                      description: "Track attendance"
                    },
                    {
                      label: "Wanakikundi Bora",
                      icon: <Crown className="mr-3 text-warning-500" size={16} />,
                      action: "top-members",
                      description: "Top members"
                    },
                    {
                      label: "Update status",
                      icon: <TrendingUp className="mr-3 text-primary-600" size={16} />,
                      link: `/create-highlight/${getLoggedInUserId()}`,
                      description: "Update your status"
                    },
                    {
                      label: "Anzisha series",
                      icon: <Sparkles className="mr-3 text-purple-500" size={16} />,
                      link: `/admins/series/${getLoggedInUserId()}`,
                      description: "Start new series"
                    },
                  ].map((item, index) => (
                    <div key={index} className="mb-1">
                      {item.link ? (
                        <Link
                          onClick={() => {
                            storeGroup(role);
                            setIsDropdownOpen(false);
                          }}
                          href={item.link}
                          className="flex items-start p-3 rounded-2xl border-0 hover:bg-primary-100/50 hover:translate-x-1 transition-all duration-300 text-decoration-none text-text-primary"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {item.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="font-semibold text-text-primary mb-1 text-sm">
                              {item.label}
                            </div>
                            <p className="text-text-tertiary text-xs mb-0">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <button
                          className="flex items-start w-full text-left p-3 rounded-2xl border-0 hover:bg-primary-100/50 hover:translate-x-1 transition-all duration-300 bg-transparent"
                          onClick={() => {
                            handleNavigation(role, item.action);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {item.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="font-semibold text-text-primary mb-1 text-sm">
                              {item.label}
                            </div>
                            <p className="text-text-tertiary text-xs mb-0">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

const NavbarTabs = ({ roles, notifications = [], user }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    
    // Close mobile menu after navigation
    setIsMenuOpen(false);
  };

  // Toggle notifications
  const toggleNotifications = (role) => {
    setShowNotifications((prev) => (prev === role ? null : role));
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when clicking outside
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-light-gradient backdrop-blur-lg border-b border-primary-200/10 transition-all duration-300 sticky top-0 z-[1060]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center w-full py-4">
            
            {/* Church Brand/Logo */}
            <div className="flex items-center">
              <Profile user={user} />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <ul className="flex gap-4 items-center animate-fade-in mb-0 list-none">
                {roles.map((role, index) => (
                  <RoleDropdown
                    key={index}
                    role={role}
                    notifications={notifications}
                    handleNavigation={handleNavigation}
                    toggleNotifications={toggleNotifications}
                    showNotifications={showNotifications === role}
                    isMobile={false}
                  />
                ))}
              </ul>
            </div>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden relative">
              <button
                className="bg-primary-gradient text-white rounded-full p-3 shadow-primary hover:shadow-primary-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                type="button"
                onClick={toggleMobileMenu}
                aria-label="Toggle navigation"
                style={{
                  width: "50px",
                  height: "50px",
                }}
              >
                <Menu size={18} />
              </button>
              
              
              {/* Mobile Notification Badge */}
              {notificationCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-semibold animate-pulse-soft z-10"
                  style={{ fontSize: "0.7rem" }}
                >
                  {notificationCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[1060] transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={handleOverlayClick}
      ></div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 right-0 w-[85%] max-w-[400px] h-full bg-light-gradient shadow-strong z-[1070] p-6 overflow-y-auto transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-primary-200/10">
          <h5 className="text-primary-700 font-bold mb-0 flex items-center">
            <Church className="mr-2" size={20} />
            Church Dashboard
          </h5>
          <button
            className="bg-primary-gradient text-white border-none rounded-full w-10 h-10 flex items-center justify-center shadow-primary hover:scale-110 transition-transform duration-300"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
        
        <div>
          <ul className="list-none space-y-0">
            {roles.map((role, index) => (
              <RoleDropdown
                key={index}
                role={role}
                notifications={notifications}
                handleNavigation={handleNavigation}
                toggleNotifications={toggleNotifications}
                showNotifications={showNotifications === role}
                isMobile={true}
              />
            ))}
          </ul>
        </div>
      </div>

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
        toastClassName="rounded-2xl shadow-strong border border-primary-200/20 backdrop-blur-lg bg-light-gradient"
        bodyClassName="p-4"
      />
    </>
  );
};

export default NavbarTabs;