'use client';
import React, { useState } from "react";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const Footer = () => {
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showOperatingHours, setShowOperatingHours] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  return (
    <footer className="w-full py-12 bg-background-50 border-t-4 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div>
              <h2 className={`${cinzel.className} font-bold text-3xl mb-3`}>
                <span className="text-primary-500">KKKT</span>{" "}
                <span className="text-primary-700">YOMBO</span>
              </h2>
              <p className={`${cormorant.className} text-lg text-text-secondary leading-relaxed`}>
                Kanisa la Kilutheri Tanzania - Usharika wa Yombo.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <FooterSection
              title="Viunganishi"
              isOpen={showQuickLinks}
              onToggle={() => setShowQuickLinks(!showQuickLinks)}
              font={playfair.className}
            >
              <nav className="space-y-3 mt-4">
                {[
                  { name: "Nyumbani", path: "/" },
                  { name: "Fahamu Zaidi", path: "/about" },
                  { name: "Kalenda ya Matukio", path: "/kalenda" },
                  { name: "Uongozi", path: "/uongozi" },
                  { name: "Kujisajili", path: "/usajili" },
                  { name: "Mawasiliano", path: "/contact" }
                ].map((link, index) => (
                  <FooterLink 
                    key={index} 
                    href={link.path} 
                    font={cormorant.className}
                  >
                    {link.name}
                  </FooterLink>
                ))}
              </nav>
            </FooterSection>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <FooterSection
              title="Ofisi ya Mchungaji"
              isOpen={showOperatingHours}
              onToggle={() => setShowOperatingHours(!showOperatingHours)}
              font={playfair.className}
            >
              <div className={`${cormorant.className} text-lg space-y-2 mt-4`}>
                {["Jumatatu", "Jumanne", "Jumatano", "Alhamis", "Ijumaa"].map((day) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-text-primary">{day}:</span>
                    <span className="text-primary-500 font-semibold">8am - 5pm</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-text-primary">Jumamosi:</span>
                  <span className="text-primary-500 font-semibold">8am - 5pm</span>
                </div>
              </div>
            </FooterSection>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <FooterSection
              title="Mahali"
              isOpen={showLocation}
              onToggle={() => setShowLocation(!showLocation)}
              font={playfair.className}
            >
              <div className={`${cormorant.className} text-lg space-y-3 mt-4`}>
                <ContactItem 
                  icon="fas fa-map-marker-alt"
                  text="1110 Yombo Kiwalani, Dar Es Salaam"
                />
                <ContactItem 
                  icon="fas fa-phone-alt"
                  text="+255 765 647 567"
                  href="tel:+255765647567"
                />
                <ContactItem 
                  icon="fas fa-envelope"
                  text="info@kkktyombo.org"
                  href="mailto:yombolutheran@gmail.com"
                />
                
                {/* Social Media Links */}
                <div className="flex gap-2 mt-4">
                  {[
                    { platform: 'facebook-f', label: 'Facebook' },
                    { platform: 'instagram', label: 'Instagram' },
                    { platform: 'youtube', label: 'YouTube' }
                  ].map(({ platform, label }) => (
                    <SocialButton 
                      key={platform} 
                      platform={platform} 
                      label={label}
                    />
                  ))}
                </div>
              </div>
            </FooterSection>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-border-default">
          <div className="text-center">
            <p className={`${cormorant.className} text-base text-text-primary mb-1`}>
              KKKT Usharika wa Yombo Online 2025
            </p>
            <p className={`${cormorant.className} text-sm text-primary-500 mb-0`}>
              Haki zote zimehifadhiwa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Section Component with Accordion Behavior
const FooterSection = ({ title, isOpen, onToggle, font, children }) => (
  <div>
    <button
      className={`${font} w-full text-left font-bold text-xl text-primary-700 transition-all duration-300 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-lg p-2 -m-2 group`}
      onClick={onToggle}
    >
      <span className="flex items-center justify-between">
        {title}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-sm text-primary-500 transition-transform duration-300 group-hover:scale-110`}></i>
      </span>
    </button>
    
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}>
      {children}
    </div>
  </div>
);

// Footer Link Component
const FooterLink = ({ href, font, children }) => (
  <a 
    href={href} 
    className={`${font} flex items-center text-lg text-primary-700 hover:text-primary-600 transition-all duration-200 hover:translate-x-1 group`}
  >
    <i className="fas fa-chevron-right mr-2 text-xs text-primary-500 transition-all duration-200 group-hover:text-primary-600 group-hover:translate-x-0.5"></i>
    {children}
  </a>
);

// Contact Item Component
const ContactItem = ({ icon, text, href }) => {
  const content = (
    <div className="flex items-start gap-3 group">
      <i className={`${icon} text-primary-500 mt-1 transition-all duration-200 group-hover:text-primary-600 group-hover:scale-110`}></i>
      <span className="text-text-primary group-hover:text-primary-700 transition-colors duration-200">
        {text}
      </span>
    </div>
  );

  return href ? (
    <a href={href} className="block hover:no-underline">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
};

// Social Media Button Component
const SocialButton = ({ platform, label }) => (
  <a
    href="#"
    aria-label={label}
    className="flex items-center justify-center w-9 h-9 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2"
  >
    <i className={`fab fa-${platform} text-sm`}></i>
  </a>
);

export default Footer;