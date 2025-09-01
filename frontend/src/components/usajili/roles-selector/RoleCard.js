'use client';
import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Crown } from "lucide-react";
import { formatRoleName } from "@/actions/utils";

export default function RoleCard({ 
  role, 
  isLeadership = false, 
  isHidden = false, 
  isSelected = false,
  leadershipPositions = [],
  selectedLeadershipPositions = {},
  onRoleChange,
  onLeadershipPositionChange
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasPositions = leadershipPositions.length > 0;
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLeadershipChange = (position, isChecked) => {
    if (onLeadershipPositionChange) {
      onLeadershipPositionChange(role, position, isChecked);
    }
  };
  
  return (
    <div 
      className={`
        group relative mb-3 rounded-xl bg-white border transition-all duration-300 ease-out hover:shadow-medium
        ${isSelected ? 'border-l-4 border-l-success-500 border-success-200 shadow-green' : 'border-border-default hover:border-border-medium'}
        ${isHidden ? 'opacity-75' : 'opacity-100'}
      `}
    >
      <div className="p-4">
        {/* Row 1: Main role info */}
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id={role}
              checked={isSelected}
              onChange={() => onRoleChange && onRoleChange(role)}
              className={`
                w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'bg-success-500 border-success-500 text-white' 
                  : 'border-border-medium hover:border-success-400 focus:border-success-500'
                }
                focus:ring-2 focus:ring-success-200 focus:outline-none
              `}
            />
            {isSelected && (
              <CheckCircle className="absolute -top-0.5 -left-0.5 w-6 h-6 text-success-500 pointer-events-none" />
            )}
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`
                font-medium transition-colors duration-200 text-sm md:text-base
                ${isSelected ? 'text-success-700' : 'text-text-primary'}
              `}>
                {formatRoleName(role)}
              </span>
              
              {isLeadership && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-700 flex-shrink-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Uongozi
                </span>
              )}
              
              {isSelected && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Imechaguliwa
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Row 2: Leadership positions button (if applicable) */}
        {isLeadership && hasPositions && isSelected && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={toggleExpanded}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-success-50 text-success-700 hover:bg-success-100 transition-colors duration-200 text-sm font-medium border-0"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span className="hidden sm:inline">Nafasi ({leadershipPositions.length})</span>
              <span className="sm:hidden">({leadershipPositions.length})</span>
            </button>
          </div>
        )}
        
        {/* Leadership Positions */}
        {isLeadership && hasPositions && isSelected && isExpanded && (
          <div className="mt-4 p-4 rounded-lg bg-background-300 border border-border-light animate-slide-down">
            <p className="text-sm font-medium text-text-secondary mb-3">
              Chagua nafasi za uongozi:
            </p>
            <div className="space-y-2">
              {leadershipPositions.map((position, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer group/position">
                  <input
                    type="checkbox"
                    id={`${role}-${position}`}
                    checked={selectedLeadershipPositions[role]?.includes(position) || false}
                    onChange={(e) => handleLeadershipChange(position, e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-border-medium text-success-600 focus:ring-2 focus:ring-success-200 focus:outline-none transition-colors duration-200 cursor-pointer"
                  />
                  <span className="text-sm text-text-primary group-hover/position:text-success-700 transition-colors duration-200">
                    {position}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}