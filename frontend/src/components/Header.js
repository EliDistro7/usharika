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
  Settings, 
  UserCircle, 
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import SeriesNotifications from '@/components/SeriesNotifications';
import Notifications from './Notifications';
import { getDesanitezedCookie, getLoggedInUserId } from '@/hooks/useUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(false);

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

  const handleAkauntiNavigation = () => {
    const cookieValue = getDesanitezedCookie();
    if (cookieValue) {
      router.push(`/akaunti/${cookieValue}`);
      toast.success('Umefanikiwa kuingia kwenye akaunti yako!');
    } else {
      router.push('/auth');
      toast.warning('Tafadhali, ingia kwenye akaunti yako!');
    }
    setIsSystemDropdownOpen(false);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
            : 'bg-white shadow-sm border-b border-gray-100'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <img
                    src="/img/lutherRose.jpg"
                    alt="Church Logo"
                    className="w-8 h-8 object-cover rounded-md"
                  />
                </div>
              </div>
              <div >
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  KKKT YOMBO
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    >
                      <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      <span>{link.text}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Contact Info - Desktop */}
              <div className="hidden xl:flex items-center space-x-2 text-sm text-gray-600">
                <Phone size={16} className="text-purple-600" />
                <a 
                  href="tel:+255765647567"
                  className="font-medium hover:text-purple-600 transition-colors duration-200"
                >
                  +255 765 647 567
                </a>
              </div>

              {/* Divider */}
              <div className="hidden xl:block w-px h-6 bg-gray-300" />

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  {/* Notifications */}
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                    <SeriesNotifications />
                  </div>
                  
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                    <Notifications />
                  </div>

                  {/* System Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSystemDropdownOpen(!isSystemDropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <Settings size={16} />
                      <span className="hidden md:inline">System</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isSystemDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isSystemDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                        <a 
                          href="/usajili" 
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        >
                          <UserPlus size={16} />
                          <span>Kujisajili</span>
                        </a>
                        <button
                          onClick={handleAkauntiNavigation}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        >
                          <UserCircle size={16} />
                          <span>Akaunti</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Ingia</span>
                  </button>

                  <button
                    onClick={handleSignup}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Jisajili</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-4 border-t border-gray-200 bg-white">
              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-4">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent size={16} />
                      <span>{link.text}</span>
                    </a>
                  );
                })}
              </div>

              {/* Mobile Auth Section */}
              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  >
                    <LogIn size={16} />
                    <span>Ingia</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSignup();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <UserPlus size={16} />
                    <span>Jisajili</span>
                  </button>
                </div>
              )}

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <Phone size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Wasiliana nasi</p>
                    <a 
                      href="tel:+255765647567" 
                      className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200"
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
      <div className="h-16" />

      {/* Click outside to close dropdowns */}
      {(isSystemDropdownOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsSystemDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
}