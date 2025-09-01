'use client';

import React, { useState, useEffect } from "react";
import Team from "@/components/Team";
import { getDefaultRoles, getLeadersByRole } from "@/actions/users";
import { formatRoleName2 } from "@/actions/utils";
import Image from "next/image";
import { Crown, Users, Star, Loader2, Image as ImageIcon } from "lucide-react";

const Leadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const groupedRoles = userRoles.reduce((acc, role) => {
    const prefix = role.split("_")[1];
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(role);
    return acc;
  }, {} as Record<string, string[]>);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const defaultRoles = await getDefaultRoles();
        const leaderRoleNames = defaultRoles
          .filter((roleObj: any) => roleObj.role.startsWith("kiongozi"))
          .map((roleObj: any) => roleObj.role);
        setUserRoles(leaderRoleNames);
        if (leaderRoleNames.length > 0) {
          const firstGroup = Object.keys(groupedRoles)[0];
          if (firstGroup) {
            setActiveTab(firstGroup);
            setActiveRole(leaderRoleNames[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (activeRole) {
      const fetchLeaders = async () => {
        setLoading(true);
        try {
          const leadersData = await getLeadersByRole(activeRole);
          setLeaders(leadersData.leaders);
        } catch (error) {
          console.error(`Failed to fetch leaders for role ${activeRole}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchLeaders();
    }
  }, [activeRole]);

  const handleTabChange = (prefix: string) => {
    setActiveTab(prefix);
    const firstRoleInGroup = groupedRoles[prefix]?.[0];
    if (firstRoleInGroup) {
      setActiveRole(firstRoleInGroup);
    }
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
  };

  return (
    <div className="min-h-screen bg-primary-gradient relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10">
          <Crown size={60} className="text-white animate-gentle-float" />
        </div>
        <div className="absolute top-60 right-20 opacity-10" style={{ animationDelay: '2s' }}>
          <Users size={50} className="text-white animate-gentle-float" />
        </div>
        <div className="absolute top-40 left-1/4 opacity-10" style={{ animationDelay: '4s' }}>
          <Star size={40} className="text-white animate-gentle-float" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="glass-strong rounded-5xl p-8 md:p-12 mx-auto max-w-4xl shadow-primary-lg">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-hero-gradient rounded-t-5xl"></div>
            
            <div className="animate-slide-up">
              <div 
                className="relative mx-auto mb-8 rounded-4xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-primary-lg group"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '400px',
                  backgroundColor: imageLoaded ? 'transparent' : '#f3f4f6',
                }}
              >
                {/* Image overlay effect */}
                <div className="absolute inset-0 bg-primary-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10 rounded-4xl"></div>
                
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-content-center">
                    <Loader2 size={40} className="text-primary-600 animate-spin" />
                  </div>
                )}

                {imageError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-error-500">
                    <ImageIcon size={48} className="mb-2" />
                    <p className="text-sm font-medium">Failed to load image</p>
                  </div>
                ) : (
                  <Image
                    src="/img/mchungaji.jpeg"
                    alt="Deogratias Katabazi"
                    fill
                    className="object-cover rounded-4xl"
                    priority
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-primary-gradient bg-clip-text text-primary-50">
                Deogratias Katabazi
              </h1>
              <div className="flex items-center justify-center">
                <Crown size={24} className="text-yellow-500 mr-2" />
                <p className="text-xl md:text-2xl font-semibold text-primary-100">Mtheolojia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(groupedRoles).map(([prefix]) => (
              <button
                key={prefix}
                onClick={() => handleTabChange(prefix)}
                className={`
                  px-8 py-4 rounded-full font-bold uppercase tracking-wide text-sm
                  transition-all duration-300 relative overflow-hidden
                  backdrop-blur-md border-2
                  ${activeTab === prefix
                    ? 'btn-primary text-white transform -translate-y-1 shadow-primary-lg'
                    : 'bg-white/90 text-primary-700 border-primary-200 hover:bg-primary-gradient hover:text-white hover:border-transparent hover:transform hover:-translate-y-1 hover:shadow-primary'
                  }
                `}
              >
                <span className="flex items-center relative z-10">
                  <Users size={18} className="mr-2" />
                  {prefix}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Role Selection Buttons */}
        {activeTab && (
          <div className="animate-slide-up mb-12" style={{ animationDelay: '0.2s' }}>
            <div className="glass-strong rounded-4xl p-8 max-w-6xl mx-auto shadow-medium">
              <div className="flex flex-wrap justify-center gap-3">
                {groupedRoles[activeTab]?.map((role, roleIndex) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`
                      px-6 py-3 rounded-3xl font-semibold transition-all duration-300
                      relative overflow-hidden backdrop-blur-md border-2
                      ${activeRole === role
                        ? 'btn-primary text-white transform -translate-y-1 shadow-primary'
                        : 'bg-white/90 text-primary-700 border-primary-300/30 hover:btn-primary hover:text-white hover:border-transparent hover:transform hover:-translate-y-1'
                      }
                    `}
                    style={{
                      animationDelay: `${roleIndex * 100}ms`
                    }}
                  >
                    <span className="relative z-10">{formatRoleName2(role)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="mt-12">
          {loading ? (
            <div className="animate-fade-in">
              <div className="glass-strong rounded-4xl p-16 text-center max-w-md mx-auto shadow-medium">
                <Loader2 size={50} className="text-primary-600 animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-bold text-primary-700 mb-2">
                  Loading Leaders...
                </h3>
                <p className="text-text-secondary">Please wait while we fetch the leadership team</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <Team 
                leaders={leaders} 
                activeSelection={activeRole ? formatRoleName2(activeRole) : ""} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leadership;