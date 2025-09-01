'use client';
import React, { useState } from "react";
import { 
  Users, 
  Music, 
  Building, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Filter,
  X,
  CheckCircle,
  Crown
} from "lucide-react";
import { formatRoleName } from "@/actions/utils";

export default function RoleSelector({
  userRoles,
  formData,
  handleRoleChange,
  handleLeadershipPositionsChange,
}) {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedLeadershipPositions, setSelectedLeadershipPositions] = useState({});
  
  // Toggle states for showing/hiding categories and roles
  const [showCategories, setShowCategories] = useState({
    jumuiya: true,
    kwaya: false,
    ofisi: false,
    others: false
  });
  
  const [showAllRoles, setShowAllRoles] = useState({
    jumuiya: false,
    kwaya: false,
    ofisi: false,
    others: false
  });

  // Group roles by category
  const groupRoles = () => {
    const roleNames = userRoles.map((roleObj) => roleObj.role);
    
    return {
      jumuiya: roleNames.filter(role => 
        role.startsWith("jumuiya") || role.startsWith("kiongozi_jumuiya")
      ),
      kwaya: roleNames.filter(role => 
        role.startsWith("kwaya") || role.startsWith("kiongozi_kwaya")
      ),
      ofisi: roleNames.filter(role => 
        role.startsWith("ofisi") || role.startsWith("kiongozi_ofisi")
      ),
      others: roleNames.filter(role => 
        !role.startsWith("jumuiya") && 
        !role.startsWith("kiongozi_jumuiya") &&
        !role.startsWith("kwaya") && 
        !role.startsWith("kiongozi_kwaya") &&
        !role.startsWith("ofisi") && 
        !role.startsWith("kiongozi_ofisi")
      )
    };
  };

  const roleGroups = groupRoles();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategoryVisibility = (category) => {
    setShowCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleShowAllRoles = (category) => {
    setShowAllRoles(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleLeadershipPositionChange = (role, position, isChecked) => {
    const updatedPositions = selectedLeadershipPositions[role] || [];
    let newPositions;
    
    if (isChecked) {
      newPositions = [...updatedPositions, position];
    } else {
      newPositions = updatedPositions.filter(p => p !== position);
    }
    
    const newSelectedLeadershipPositions = {
      ...selectedLeadershipPositions,
      [role]: newPositions,
    };
    
    setSelectedLeadershipPositions(newSelectedLeadershipPositions);
    
    if (typeof handleLeadershipPositionsChange === "function") {
      handleLeadershipPositionsChange(newSelectedLeadershipPositions);
    }
  };

  const getLeadershipPositions = (role) => {
    const roleObj = userRoles.find(r => r.role === role);
    return roleObj?.defaultPositions || [];
  };

  const isLeadershipRole = (role) => {
    return role.startsWith("kiongozi_");
  };

  const isRoleSelected = (role) => {
    return formData.selectedRoles.includes(role);
  };

  // Filter roles based on selection and show/hide preferences
  const getFilteredRoles = (roles, category) => {
    const selectedRoles = roles.filter(role => isRoleSelected(role));
    const unselectedRoles = roles.filter(role => !isRoleSelected(role));
    
    if (showAllRoles[category]) {
      return [...selectedRoles, ...unselectedRoles];
    } else {
      // Show selected roles + limit unselected roles (show first 3, hide rest)
      const limitedUnselected = unselectedRoles.slice(0, 3);
      return [...selectedRoles, ...limitedUnselected];
    }
  };

  const RoleCard = ({ role, isLeadership = false }) => {
    const leadershipPositions = isLeadership ? getLeadershipPositions(role) : [];
    const hasPositions = leadershipPositions.length > 0;
    const isExpanded = expandedSections[role];
    const selected = isRoleSelected(role);
    
    return (
      <div className={`
        group relative mb-3 rounded-xl bg-white border transition-all duration-300 ease-out hover:shadow-medium
        ${selected ? 'border-l-4 border-l-primary-600 border-primary-200 shadow-primary' : 'border-border-default hover:border-border-medium'}
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id={role}
                  checked={selected}
                  onChange={() => handleRoleChange(role)}
                  className={`
                    w-5 h-5 rounded border-2 transition-all duration-200
                    ${selected 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : 'border-border-medium hover:border-primary-400 focus:border-primary-500'
                    }
                    focus:ring-2 focus:ring-primary-200 focus:outline-none cursor-pointer
                  `}
                />
                {selected && (
                  <CheckCircle className="absolute -top-0.5 -left-0.5 w-6 h-6 text-primary-600 pointer-events-none" />
                )}
              </div>
              <div className="flex-1">
                <span className={`
                  font-medium transition-colors duration-200
                  ${selected ? 'text-primary-700' : 'text-text-primary'}
                `}>
                  {formatRoleName(role)}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  {isLeadership && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                      <Crown className="w-3 h-3 mr-1" />
                      Uongozi
                    </span>
                  )}
                  {selected && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Imechaguliwa
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {isLeadership && hasPositions && selected && (
              <button
                onClick={() => toggleSection(role)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200 text-sm font-medium"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>Nafasi ({leadershipPositions.length})</span>
              </button>
            )}
          </div>
          
          {/* Leadership Positions */}
          {isLeadership && hasPositions && selected && isExpanded && (
            <div className="mt-4 p-4 rounded-lg bg-background-300 border border-border-light animate-slide-down">
              <p className="text-sm font-medium text-text-secondary mb-3">Chagua nafasi za uongozi:</p>
              <div className="space-y-2">
                {leadershipPositions.map((position, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer group/position">
                    <input
                      type="checkbox"
                      id={`${role}-${position}`}
                      checked={selectedLeadershipPositions[role]?.includes(position) || false}
                      onChange={(e) => handleLeadershipPositionChange(role, position, e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-border-medium text-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors duration-200"
                    />
                    <span className="text-sm text-text-primary group-hover/position:text-primary-700 transition-colors duration-200">
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
  };

  const CategorySection = ({ title, icon: IconComponent, roles, bgColor, category }) => {
    const plainRoles = roles.filter(role => !isLeadershipRole(role));
    const leadershipRoles = roles.filter(role => isLeadershipRole(role));
    const allRoles = [...plainRoles, ...leadershipRoles];
    
    const filteredRoles = getFilteredRoles(allRoles, category);
    const hiddenRolesCount = allRoles.length - filteredRoles.length;
    const selectedCount = allRoles.filter(role => isRoleSelected(role)).length;
    const isVisible = showCategories[category];
    
    return (
      <div className="mb-6 rounded-2xl overflow-hidden shadow-medium bg-white border border-border-light">
        <div 
          className={`px-6 py-4 text-white cursor-pointer hover:opacity-90 transition-opacity duration-200`}
          style={{ backgroundColor: bgColor }}
          onClick={() => toggleCategoryVisibility(category)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <IconComponent className="w-6 h-6" />
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
                    />
                  ))}
                </div>
                
                {/* Show/Hide toggle for remaining roles */}
                {hiddenRolesCount > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => toggleShowAllRoles(category)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-background-300 text-text-secondary hover:bg-background-400 hover:text-text-primary transition-all duration-200 text-sm font-medium"
                    >
                      {showAllRoles[category] ? (
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
  };

  const getTotalSelected = () => {
    return formData.selectedRoles.length;
  };

  const getSelectedByCategory = () => {
    const selected = {
      jumuiya: formData.selectedRoles.filter(role => 
        role.startsWith("jumuiya") || role.startsWith("kiongozi_jumuiya")
      ).length,
      kwaya: formData.selectedRoles.filter(role => 
        role.startsWith("kwaya") || role.startsWith("kiongozi_kwaya")
      ).length,
      ofisi: formData.selectedRoles.filter(role => 
        role.startsWith("ofisi") || role.startsWith("kiongozi_ofisi")
      ).length,
      others: formData.selectedRoles.filter(role => 
        !role.startsWith("jumuiya") && !role.startsWith("kiongozi_jumuiya") &&
        !role.startsWith("kwaya") && !role.startsWith("kiongozi_kwaya") &&
        !role.startsWith("ofisi") && !role.startsWith("kiongozi_ofisi")
      ).length
    };
    return selected;
  };

  const selectedByCategory = getSelectedByCategory();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-600 rounded-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-700">Chagua Vikundi na Nafasi</h2>
            <p className="text-primary-600 font-medium">
              {getTotalSelected()} nafasi zimechaguliwa
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategories({
              jumuiya: true, kwaya: true, ofisi: true, others: true
            })}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-primary-700 hover:bg-primary-50 border border-primary-200 transition-all duration-200 text-sm font-medium shadow-soft"
          >
            <Eye className="w-4 h-4" />
            <span>Onyesha Vyote</span>
          </button>
          <button
            onClick={() => setShowCategories({
              jumuiya: false, kwaya: false, ofisi: false, others: false
            })}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-text-secondary hover:bg-background-200 border border-border-default transition-all duration-200 text-sm font-medium shadow-soft"
          >
            <EyeOff className="w-4 h-4" />
            <span>Ficha Vyote</span>
          </button>
        </div>
      </div>
      
      {/* Summary section */}
      <div className="p-6 bg-background-200 rounded-2xl border border-border-light">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-text-primary">Muhtasari wa chaguzi zako:</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Jumuiya', count: selectedByCategory.jumuiya },
            { label: 'Kwaya', count: selectedByCategory.kwaya },
            { label: 'Ofisi', count: selectedByCategory.ofisi },
            { label: 'Nyingine', count: selectedByCategory.others }
          ].map(({ label, count }) => (
            <div key={label} className="text-center">
              <p className="text-sm text-text-secondary mb-1">{label}:</p>
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${count > 0 ? 'bg-success-100 text-success-700' : 'bg-background-400 text-text-tertiary'}
              `}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category sections */}
      <CategorySection
        title="Jumuiya"
        icon={Users}
        roles={roleGroups.jumuiya}
        bgColor="#6b46c1"
        category="jumuiya"
      />
      
      <CategorySection
        title="Kwaya"
        icon={Music}
        roles={roleGroups.kwaya}
        bgColor="#8e44ad"
        category="kwaya"
      />
      
      <CategorySection
        title="Ofisi"
        icon={Building}
        roles={roleGroups.ofisi}
        bgColor="#9b59b6"
        category="ofisi"
      />
      
      <CategorySection
        title="Huduma Nyingine"
        icon={Settings}
        roles={roleGroups.others}
        bgColor="#a569bd"
        category="others"
      />
      
      {/* Selected Roles Summary */}
      {getTotalSelected() > 0 && (
        <div className="p-6 bg-success-50 rounded-2xl border-l-4 border-l-success-500 border border-success-200 shadow-green animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-success-600" />
            <h3 className="text-lg font-semibold text-success-800">
              Nafasi Zilizochaguliwa ({getTotalSelected()}):
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.selectedRoles.map(role => (
              <span 
                key={role} 
                className="group inline-flex items-center px-3 py-1.5 rounded-lg bg-success-500 text-white text-sm font-medium shadow-soft hover:shadow-medium transition-all duration-200"
              >
                {formatRoleName(role)}
                <button
                  onClick={() => handleRoleChange(role)}
                  className="ml-2 p-0.5 hover:bg-success-600 rounded-full transition-colors duration-200"
                  aria-label={`Remove ${formatRoleName(role)}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}