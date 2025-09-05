'use client';

import React from 'react';
import { 
  Calendar, 
  Users, 
  Edit3, 
  Plus, 
  BookOpen,
  User,
  Crown
} from 'lucide-react';
import ShareButton from "@/components/ShareButton";

const SeriesHero = ({ 
  series, 
  user, 
  isCreator, 
  completedSessions, 
  totalSessions, 
  progressPercentage,
  onAddSession,
  onEditSeries,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const defaultShareUrl = `https://kkktyombo.org/series/${series._id}`;
  const defaultShareTitle = `${series.name} - ${series.author}`;

  const colors = {
    primary: '#6f42c1',
    surface: 'white',
    text: '#333',
    accent: '#b8860b',
    background: '#f8f9fa'
  };

  return (
    <div className="bg-hero-gradient text-white py-12 mb-8 relative overflow-hidden">
      {/* Background overlay */}
    
      
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={28} />
              <div>
                <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {series.group}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{series.name}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-4 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>by {series.author}</span>
                {isCreator && <Crown size={14} className="text-yellow-300" />}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
              </div>
             
            </div>
            
            <p className="text-lg opacity-95 mb-6 max-w-2xl">{series.description}</p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="font-medium">Progress</span>
                <span>{completedSessions}/{totalSessions} completed</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-secondary-gradient transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3 lg:items-end">
            {isCreator && (
              <>
                <button
                  onClick={onAddSession}
                  className="flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Plus size={18} />
                  Add Session
                </button>
                <button
                  onClick={onEditSeries}
                  className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              </>
            )}
            <ShareButton 
              url={defaultShareUrl}
              title={defaultShareTitle}
              colors={colors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesHero;