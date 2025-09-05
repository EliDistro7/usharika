'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Info, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  LogIn, 
  UserPlus, 
  UserCircle, 
  Menu,
  X,
  DollarSign,
  ChevronDown,
  Bell
} from 'lucide-react';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';
import { getDesanitezedCookie, getLoggedInUserId, getLoggedInUsername } from '@/hooks/useUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPray } from 'react-icons/fa';
import { Cash } from 'react-bootstrap-icons';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(userId !== null);

    // Handle scroll effects for both visibility and background
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for background blur
      setIsScrolled(currentScrollY > 50);
      
      // Handle visibility (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleProfileNavigation = () => {
    const cookieValue = getDesanitezedCookie();
    if (cookieValue) {
      router.push(`/profile/${cookieValue}`);
      toast.success('Umefanikiwa kuingia kwenye profaili yako!');
    } else {
      router.push('/auth');
      toast.warning('Tafadhali, ingia kwenye akaunti yako!');
    }
    setIsProfileDropdownOpen(false);
  };

  const handleSadakaNavigation = () => {
    const username = getLoggedInUsername();
    if (username) {
      router.push(`/akaunti/${username}`);
    } else {
      router.push('/auth');
      toast.warning('Tafadhali, ingia kwenye akaunti yako!');
    }
    setIsProfileDropdownOpen(false);
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleSignup = () => {
    router.push('/usajili');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const navLinks = [
    { href: '/', icon: Home, text: 'Nyumbani' },
    { href: '/about', icon: Info, text: 'Fahamu Zaidi' },
    { href: '/kalenda', icon: Calendar, text: 'Kalenda' },
    { href: '/uongozi', icon: Users, text: 'Uongozi' },
    { href: '/contact', icon: Mail, text: 'Mawasiliano' },
  ];

  return (
    <>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-purple-600/95 backdrop-blur-md shadow-xl' 
            : 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg'
        }`}
        style={{ zIndex: 40 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md border border-white/30">
                  <img
                    src="/img/lutherRose.jpg"
                    alt="Church Logo"
                    className="w-8 h-8 object-cover rounded-md"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  KKKT YOMBO
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    <span>{link.text}</span>
                  </a>
                );
              })}
              
              {/* Sadaka na Michango - Only visible when logged in */}
              {isLoggedIn && (
                <button
                  onClick={handleSadakaNavigation}
                  className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <Cash size={16} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>Sadaka na Michango</span>
                </button>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Contact Info - Desktop */}
              <div className="hidden xl:flex items-center space-x-2 text-sm text-white/80">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <Phone size={14} className="text-white" />
                </div>
                <a 
                  href="tel:+255765647567"
                  className="font-medium hover:text-white transition-colors duration-200"
                >
                  +255 765 647 567
                </a>
              </div>

              {/* Divider */}
              <div className="hidden xl:block w-px h-6 bg-white/30" />

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  {/* Notifications */}
                  <div className="text-white">
                    <SeriesNotifications />
                  </div>
                  <div className="text-white">
                    <Notifications />
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 shadow-sm backdrop-blur-sm border border-white/30"
                    >
                      <UserCircle size={20} />
                      <span className="text-sm font-medium">Profaili</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <button
                          onClick={handleProfileNavigation}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <UserCircle size={16} />
                          <span>Profaili Yangu</span>
                        </button>
                        <button
                          onClick={handleSadakaNavigation}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <FaPray size={16} />
                          <span>Sadaka na Michango</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <LogIn size={16} />
                    <span>Ingia</span>
                  </button>

                  <button
                    onClick={handleSignup}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm backdrop-blur-sm border border-white/30"
                  >
                    <UserPlus size={16} />
                    <span>Jisajili</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout - Two Lines with Purple Background */}
          <div className="lg:hidden">
            
            {/* First Line: Logo, Brand Name, Menu Button */}
            <div className="flex items-center justify-between h-14 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md border border-white/30">
                    <img
                      src="/img/lutherRose.jpg"
                      alt="Church Logo"
                      className="w-7 h-7 object-cover rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    KKKT YOMBO
                  </h1>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-10 h-10 text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-white/30"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Second Line: Navigation and Actions */}
            <div className="h-12 flex items-center justify-between">
              
              {/* Mobile Navigation Icons */}
              <div className="flex items-center space-x-1">
                {navLinks.slice(0, 4).map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title={link.text}
                    >
                      <IconComponent size={18} />
                    </a>
                  );
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-1">
                {isLoggedIn ? (
                  <>
                    {/* Mobile Notifications */}
                    <div className="text-white opacity-80">
                      <SeriesNotifications />
                    </div>
                    <div className="text-white opacity-80">
                      <Notifications />
                    </div>
                    
                    {/* Mobile Sadaka Button */}
                    <button
                      onClick={handleSadakaNavigation}
                      className="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="Sadaka na Michango"
                    >
                      <Cash size={18} />
                    </button>

                    {/* Mobile Profile Button */}
                    <button
                      onClick={handleProfileNavigation}
                      className="flex items-center justify-center w-10 h-10 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
                      title="Profaili"
                    >
                      <UserCircle size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="flex items-center space-x-1 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <LogIn size={16} />
                      <span>Ingia</span>
                    </button>

                    <button
                      onClick={handleSignup}
                      className="flex items-center space-x-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/30"
                    >
                      <UserPlus size={16} />
                      <span>Jisajili</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-3 pb-4 border-t border-white/20">
              
              {/* All Navigation Links */}
              <div className="space-y-1 mb-4">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent size={20} />
                      <span className="font-medium">{link.text}</span>
                    </a>
                  );
                })}
                
                {/* Mobile Sadaka Link for Logged In Users */}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      handleSadakaNavigation();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    <Cash size={20} />
                    <span className="font-medium">Sadaka na Michango</span>
                  </button>
                )}
              </div>

              {/* Contact Info */}
              <div className="pt-3 border-t border-white/20">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-1">Wasiliana nasi</p>
                    <a 
                      href="tel:+255765647567" 
                      className="text-base font-medium text-white hover:text-white/80 transition-colors duration-200"
                    >
                      +255 765 647 567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-16" />

      {/* Click outside to close mobile menu and dropdown */}
      {(isMobileMenuOpen || isProfileDropdownOpen) && (
        <div 
          className="fixed inset-0"
          style={{ zIndex: 35 }}
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
      <div className="h-8" />
    </>
  );
}