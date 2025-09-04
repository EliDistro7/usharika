import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";
import { getLoggedInUserId } from "@/hooks/useUser";
import { formatRoleName } from "@/actions/utils";

const CustomNavbar = () => {
  const [activeTab2, setActiveTab2] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const role = Cookies.get('role');
  
  console.log('role is', role);

  const navigationItems = [
    { key: "home", label: "Home", icon: "fa-home" },
    { key: "matangazo", label: "Matangazo", icon: "fa-bullhorn" },
    { key: "michango", label: "Michango", icon: "fa-donate" },
    { key: "attendance", label: "Mahudhurio", icon: "fa-users" },
    { key: "top-members", label: "Top Members", icon: "fa-trophy" },
    { key: "update-status", label: "Update Status", icon: "fa-edit" },
  ];

  const handleNavClick = (tabKey) => {
    setActiveTab2(tabKey);
    setIsMobileMenuOpen(false); // Close mobile menu when item is selected
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative z-50">
      {/* Main Navigation Container */}
      <div className="bg-white border-b border-border-light shadow-medium">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Brand/Logo Section */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="p-2 lg:p-3 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl shadow-primary">
                <i className="fa fa-tv text-white text-lg lg:text-xl"></i>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg lg:text-xl font-display font-bold text-text-primary">
                  Dashboard
                </h1>
                <span className="text-xs lg:text-sm text-text-secondary font-medium">
                  {formatRoleName(Cookies.get("role"))}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`
                      relative px-4 py-2.5 rounded-xl font-semibold text-sm
                      transition-all duration-300 flex items-center space-x-2
                      ${
                        activeTab2 === item.key
                          ? 'bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-primary transform scale-105'
                          : 'text-text-secondary hover:text-white hover:bg-primary-700 hover:scale-102'
                      }
                    `}
                  >
                    <i className={`fa ${item.icon} text-sm`}></i>
                    <span>{item.label}</span>
                    
                    {/* Active indicator */}
                    {activeTab2 === item.key && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-3 rounded-xl bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-primary hover:shadow-primary-lg transition-all duration-300 hover:scale-105"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-lg" />
                ) : (
                  <FaBars className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`
        lg:hidden absolute top-full left-0 right-0 z-40
        transition-all duration-300 ease-out
        ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-4 invisible'
        }
      `}>
        <div className="bg-white border-b border-l border-r border-border-light shadow-strong mx-4 rounded-b-2xl overflow-hidden">
          <div className="py-2">
            {navigationItems.map((item, index) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`
                  w-full px-6 py-4 text-left transition-all duration-200
                  flex items-center space-x-3 border-b border-border-light last:border-b-0
                  ${
                    activeTab2 === item.key
                      ? 'bg-gradient-to-r from-primary-700 to-primary-800 text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-200'
                  }
                `}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen ? 'slideDown 0.3s ease-out forwards' : 'none'
                }}
              >
                <div className={`
                  p-2 rounded-lg
                  ${
                    activeTab2 === item.key
                      ? 'bg-white bg-opacity-20'
                      : 'bg-primary-100'
                  }
                `}>
                  <i className={`fa ${item.icon} text-sm ${
                    activeTab2 === item.key ? 'text-white' : 'text-primary-700'
                  }`}></i>
                </div>
                <span className="font-medium">{item.label}</span>
                
                {/* Active indicator for mobile */}
                {activeTab2 === item.key && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Active Status Indicator (Optional Enhancement) */}
      <div className="hidden lg:block fixed top-24 right-6 z-30">
        <div className="bg-white border border-border-light shadow-soft p-3 rounded-xl">
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span>Active: {navigationItems.find(item => item.key === activeTab2)?.label}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;