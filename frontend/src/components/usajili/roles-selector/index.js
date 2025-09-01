'use client';
import React, { useState } from "react";
import { 
  Users, 
  Music, 
  Building, 
  Settings, 
  Eye, 
  EyeOff, 
  Filter,
  X,
  CheckCircle
} from "lucide-react";
import { formatRoleName } from "@/actions/utils";
import CategorySection from "./CategorySection";

export default function RoleSelector({
  userRoles,
  formData,
  handleRoleChange,
  handleLeadershipPositionsChange,
}) {
  const [selectedLeadershipPositions, setSelectedLeadershipPositions] = useState({});
  
  // Toggle states for showing/hiding categories and roles
  const [showCategories, setShowCategories] = useState({
    jumuiya: false,
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
    <div className="px-0">
      {/* Header with controls */}
      <div className="mb-6">
        {/* Row 1: Title and badge */}
        <div className="flex items-center flex-wrap gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-primary-600 text-white shadow-primary">
            {getTotalSelected()} Imechaguliwa
          </span>
        </div>
        
        {/* Row 2: Control buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCategories({
              jumuiya: true, kwaya: true, ofisi: true, others: true
            })}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white text-text-secondary hover:text-primary-700 hover:bg-primary-50 border border-border-default hover:border-primary-200 transition-all duration-200 text-sm font-medium shadow-soft"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Onyesha Vyote</span>
            <span className="sm:hidden">Vyote</span>
          </button>
          <button
            onClick={() => setShowCategories({
              jumuiya: false, kwaya: false, ofisi: false, others: false
            })}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white text-text-secondary hover:text-text-primary hover:bg-background-200 border border-border-default transition-all duration-200 text-sm font-medium shadow-soft"
          >
            <EyeOff className="w-4 h-4" />
            <span className="hidden sm:inline">Ficha Vyote</span>
            <span className="sm:hidden">Ficha</span>
          </button>
        </div>
      </div>
      
      {/* Summary section */}
      <div className="mb-6 p-4 bg-background-200 rounded-xl border border-border-light">
        <div className="flex items-center space-x-3 mb-3">
          <Filter className="w-5 h-5 text-primary-600" />
          <span className="font-medium text-text-primary">Muhtasari wa chaguzi zako:</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Jumuiya', count: selectedByCategory.jumuiya },
            { label: 'Kwaya', count: selectedByCategory.kwaya },
            { label: 'Ofisi', count: selectedByCategory.ofisi },
            { label: 'Nyingine', count: selectedByCategory.others }
          ].map(({ label, count }) => (
            <div key={label} className="text-center">
              <span className="text-sm text-text-secondary block mb-1">{label}:</span>
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium
                ${count > 0 ? 'bg-success-100 text-success-700' : 'bg-background-400 text-text-tertiary'}
              `}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      <CategorySection
        title="Jumuiya"
        icon={<Users className="w-6 h-6" />}
        roles={roleGroups.jumuiya}
        bgColor="#6f42c1"
        category="jumuiya"
        isVisible={showCategories.jumuiya}
        showAllRoles={showAllRoles.jumuiya}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      <CategorySection
        title="Kwaya"
        icon={<Music className="w-6 h-6" />}
        roles={roleGroups.kwaya}
        bgColor="#8e44ad"
        category="kwaya"
        isVisible={showCategories.kwaya}
        showAllRoles={showAllRoles.kwaya}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      <CategorySection
        title="Ofisi"
        icon={<Building className="w-6 h-6" />}
        roles={roleGroups.ofisi}
        bgColor="#9b59b6"
        category="ofisi"
        isVisible={showCategories.ofisi}
        showAllRoles={showAllRoles.ofisi}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      <CategorySection
        title="Huduma Nyingine"
        icon={<Settings className="w-6 h-6" />}
        roles={roleGroups.others}
        bgColor="#a569bd"
        category="others"
        isVisible={showCategories.others}
        showAllRoles={showAllRoles.others}
        selectedRoles={formData.selectedRoles}
        userRoles={userRoles}
        selectedLeadershipPositions={selectedLeadershipPositions}
        onToggleCategoryVisibility={toggleCategoryVisibility}
        onToggleShowAllRoles={toggleShowAllRoles}
        onRoleChange={handleRoleChange}
        onLeadershipPositionChange={handleLeadershipPositionChange}
      />
      
      {/* Selected Roles Summary */}
      {getTotalSelected() > 0 && (
        <div className="p-4 bg-success-50 rounded-xl border-l-4 border-l-success-500 border border-success-200 shadow-green animate-fade-in">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success-600" />
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