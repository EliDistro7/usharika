'use client';
import React from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle } from "lucide-react";
import RoleCard from "./RoleCard";

export default function CategorySection({ 
  title, 
  icon, 
  roles, 
  bgColor, 
  category,
  isVisible,
  showAllRoles,
  selectedRoles,
  userRoles,
  selectedLeadershipPositions,
  onToggleCategoryVisibility,
  onToggleShowAllRoles,
  onRoleChange,
  onLeadershipPositionChange
}) {
  
  const isLeadershipRole = (role) => {
    return role.startsWith("kiongozi_");
  };

  const isRoleSelected = (role) => {
    return selectedRoles.includes(role);
  };

  const getLeadershipPositions = (role) => {
    const roleObj = userRoles.find(r => r.role === role);
    return roleObj?.defaultPositions || [];
  };

  // Filter roles based on selection and show/hide preferences
  const getFilteredRoles = (roles, category) => {
    const selectedRolesList = roles.filter(role => isRoleSelected(role));
    const unselectedRoles = roles.filter(role => !isRoleSelected(role));
    
    if (showAllRoles) {
      return [...selectedRolesList, ...unselectedRoles];
    } else {
      // Show selected roles + limit unselected roles (show first 3, hide rest)
      const limitedUnselected = unselectedRoles.slice(0, 3);
      return [...selectedRolesList, ...limitedUnselected];
    }
  };

  const plainRoles = roles.filter(role => !isLeadershipRole(role));
  const leadershipRoles = roles.filter(role => isLeadershipRole(role));
  const allRoles = [...plainRoles, ...leadershipRoles];
  
  const filteredRoles = getFilteredRoles(allRoles, category);
  const hiddenRolesCount = allRoles.length - filteredRoles.length;
  const selectedCount = allRoles.filter(role => isRoleSelected(role)).length;
  
  return (
    <div className="mb-6 rounded-2xl overflow-hidden shadow-medium bg-white border border-border-light">
      <div 
        className="px-6 py-4 text-white cursor-pointer hover:opacity-90 transition-opacity duration-200"
        style={{ backgroundColor: bgColor }}
        onClick={() => onToggleCategoryVisibility && onToggleCategoryVisibility(category)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {icon}
            <h3 className="text-lg font-bold">{title}</h3>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
              {selectedCount > 0 ? `${selectedCount}/${allRoles.length}` : allRoles.length}
            </span>
            {selectedCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Imechagua
              </span>
            )}
          </div>
          <button className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200">
            {isVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {isVisible && (
        <div className="p-6 animate-slide-down">
          {allRoles.length === 0 ? (
            <p className="text-text-tertiary text-center py-8">Hakuna nafasi zinazopatikana</p>
          ) : (
            <>
              {/* Show filtered roles */}
              <div className="space-y-3">
                {filteredRoles.map(role => (
                  <RoleCard 
                    key={role} 
                    role={role} 
                    isLeadership={isLeadershipRole(role)}
                    isSelected={isRoleSelected(role)}
                    leadershipPositions={getLeadershipPositions(role)}
                    selectedLeadershipPositions={selectedLeadershipPositions}
                    onRoleChange={onRoleChange}
                    onLeadershipPositionChange={onLeadershipPositionChange}
                  />
                ))}
              </div>
              
              {/* Show/Hide toggle for remaining roles */}
              {hiddenRolesCount > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => onToggleShowAllRoles && onToggleShowAllRoles(category)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-background-300 text-text-secondary hover:bg-background-400 hover:text-text-primary transition-all duration-200 text-sm font-medium"
                  >
                    {showAllRoles ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Ficha nafasi {hiddenRolesCount} zaidi</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Onyesha nafasi {hiddenRolesCount} zaidi</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Quick actions for category */}
              {selectedCount === 0 && allRoles.length > 0 && (
                <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <p className="text-sm text-primary-700">
                    💡 <span className="font-medium">Kidokezo:</span> Chagua nafasi unazotaka ili kuona maelezo zaidi
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}