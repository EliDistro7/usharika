"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { 
  User,
  Calendar
} from "lucide-react";
import ShareButton from "../ShareButton";

// Font configurations
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Tab Navigation Component
const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex flex-wrap gap-3 mb-8 justify-center">
      {tabs.map((tab, index) => (
        <button
          key={tab._id || index}
          onClick={() => onTabChange(index)}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all duration-300
            ${cormorant.className} text-base
            ${activeTab === index 
              ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg scale-105' 
              : 'bg-white text-text-primary hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 shadow-sm hover:shadow-md border border-border-light'
            }
            hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          `}
        >
          {tab.groupName}
        </button>
      ))}
    </nav>
  );
};

// BBC-Style Story Card Component
const BBCStoryCard = ({ item, collectionTitle, author, createdAt, collectionId, formatDate }) => {
  const hasImage = item?.imageUrl;
  
  return (
    <div className="relative">
      <Link href={`/highlight/${collectionId}`} className="block group">
        <article className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02]">
          {hasImage ? (   
              <div className="space-y-6">
              {/* Image Section - Original Size and Quality */}
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={item.imageUrl}
                  alt={item.description}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto',
                    imageRendering: 'high-quality'
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Content Section Below Image */}
              <div className="p-6 md:p-8">
                {/* Collection Title */}
                <h1 className={`
                  ${cinzel.className}
                  text-4xl md:text-6xl lg:text-7xl font-black
                  bg-gradient-to-r from-primary-800 via-purple-700 to-primary-600
                  bg-clip-text text-transparent
                  tracking-wide mb-6 leading-tight
                `}>
                  {collectionTitle}
                </h1>
                
                {/* Story Description */}
                <p className={`
                  ${cormorant.className}
                  text-text-primary text-xl md:text-2xl leading-relaxed
                  max-w-4xl font-medium
                `}>
                  {item.description}
                </p>
              </div>
            </div> ):
          
          (<div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 p-8 md:p-12 rounded-2xl">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Collection Title */}
                <h1 className={`
                  ${cinzel.className}
                  text-5xl md:text-7xl font-black
                  bg-gradient-to-r from-primary-800 via-purple-700 to-primary-600
                  bg-clip-text text-transparent
                  tracking-wide text-center leading-tight
                `}>
                  {collectionTitle}
                </h1>
                
                {/* Story Description */}
                <p className={`
                  ${cormorant.className}
                  text-2xl md:text-3xl text-text-primary leading-relaxed
                  font-medium text-center
                `}>
                  {item.description}
                </p>
              </div>
            </div>)
                }
            
          
          {/* Hover Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse" 
                 style={{ filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.5))' }} />
          </div>
        </article>
      </Link>
      
      {/* Share Button - Positioned outside the Link */}
      <div className="absolute top-4 left-4 z-10">
        <ShareButton 
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/highlight/${collectionId}`}
          title={collectionTitle}
        />
      </div>
    </div>
  );
};

// Date formatting functions
const getStaticDateString = (dateString) => {
  return new Date(dateString).toLocaleDateString('sw-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getRelativeDateString = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Leo';
  if (diffDays === 2) return 'Jana';
  if (diffDays <= 7) return `Siku ${diffDays} zilizopita`;
  if (diffDays <= 30) return `Wiki ${Math.ceil(diffDays / 7)} zilizopita`;
  return getStaticDateString(dateString);
};

// Main Highlights Component
const Highlights = ({ data, datatype = "default" }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current tab content
  const contentTabs = useMemo(() => {
    return Object.keys(data.content).map(key => ({
      groupName: key,
      content: data.content[key].content || []
    }));
  }, [data.content]);

  const currentContent = useMemo(() => {
    return contentTabs[activeTabIndex]?.content || [];
  }, [contentTabs, activeTabIndex]);

  const featuredStory = useMemo(() => {
    return currentContent[0]; // Always show the first story
  }, [currentContent]);

  // Navigation handlers
  const handleTabChange = useCallback((tabIndex) => {
    setActiveTabIndex(tabIndex);
  }, []);

  const formatDate = useCallback((dateString) => {
    return isClient ? getRelativeDateString(dateString) : getStaticDateString(dateString);
  }, [isClient]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Tab Navigation */}
      {contentTabs.length > 1 && (
        <TabNavigation 
          tabs={contentTabs}
          activeTab={activeTabIndex}
          onTabChange={handleTabChange}
        />
      )}

      {/* Single Featured Story */}
      {featuredStory ? (
        <BBCStoryCard 
          item={featuredStory}
          collectionTitle={data.name}
          author={data.author}
          createdAt={data.createdAt}
          collectionId={data._id}
          formatDate={formatDate}
        />
      ) : (
        // No stories available
        <div className="text-center py-20 bg-gradient-to-br from-background-100 to-background-200 rounded-3xl shadow-lg">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className={`${playfair.className} text-2xl font-bold text-text-primary`}>
              Hakuna Stori
            </h3>
            <p className={`${cormorant.className} text-text-secondary text-lg max-w-md mx-auto`}>
              Hakuna maudhui yaliyopatikana kwenye sehemu hii kwa sasa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highlights;