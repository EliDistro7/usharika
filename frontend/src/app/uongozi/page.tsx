'use client';

import React, { useState, useEffect } from "react";
import Team from "@/components/Team";
import { getDefaultRoles, getLeadersByRole } from "@/actions/users";
import { formatRoleName2 } from "@/actions/utils";
import { Tabs, Tab } from "react-bootstrap";
import Image from "next/image";
import { Fade, Slide } from "react-awesome-reveal";
import { Crown, Users, Star } from "lucide-react";

const Leadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
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
          setActiveTab(leaderRoleNames[0]);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (activeTab) {
      const fetchLeaders = async () => {
        setLoading(true);
        try {
          const leadersData = await getLeadersByRole(activeTab);
          setLeaders(leadersData.leaders);
        } catch (error) {
          console.error(`Failed to fetch leaders for role ${activeTab}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchLeaders();
    }
  }, [activeTab]);

  const customStyles = `
    .leadership-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      position: relative;
    }
    
    .leadership-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="150" fill="url(%23a)"/><circle cx="800" cy="300" r="100" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>') no-repeat;
      background-size: cover;
      opacity: 0.3;
      pointer-events: none;
    }

    .hero-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border-radius: 24px;
      position: relative;
      overflow: hidden;
    }

    .hero-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    }

    .image-container {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
      transition: all 0.4s ease;
    }

    .image-container:hover {
      transform: scale(1.02);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .image-container:hover .image-overlay {
      opacity: 1;
    }

    .leader-title {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
    }

    .role-subtitle {
      color: #764ba2;
      font-weight: 600;
    }

    .custom-tabs {
      border: none;
      background: none;
    }

    .custom-tabs .nav-tabs {
      border: none;
      justify-content: center;
      gap: 1rem;
    }

    .custom-tabs .nav-link {
      border: none;
      background: rgba(255, 255, 255, 0.9);
      color: #764ba2;
      padding: 15px 30px;
      border-radius: 50px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .custom-tabs .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s ease;
    }

    .custom-tabs .nav-link:hover::before {
      left: 100%;
    }

    .custom-tabs .nav-link:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .custom-tabs .nav-link.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .role-buttons-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .role-btn {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
      border: 2px solid rgba(102, 126, 234, 0.3);
      color: #764ba2;
      font-weight: 600;
      border-radius: 25px;
      padding: 12px 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .role-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .role-btn span {
      position: relative;
      z-index: 1;
    }

    .role-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
      border-color: transparent;
    }

    .role-btn:hover::before {
      opacity: 1;
    }

    .role-btn:hover span {
      color: white;
    }

    .role-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
    }

    .loading-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 60px;
      text-align: center;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }

    .custom-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(102, 126, 234, 0.2);
      border-left: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .floating-icon {
      position: absolute;
      color: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .floating-icon:nth-child(1) {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .floating-icon:nth-child(2) {
      top: 60%;
      left: 80%;
      animation-delay: 2s;
    }

    .floating-icon:nth-child(3) {
      top: 40%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @media (max-width: 768px) {
      .hero-card {
        margin: 15px;
        border-radius: 20px;
      }
      
      .role-buttons-container {
        margin: 15px;
        padding: 20px;
      }
      
      .custom-tabs .nav-link {
        padding: 12px 20px;
        font-size: 14px;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="leadership-container">
        <div className="floating-elements">
          <Crown size={60} className="floating-icon" />
          <Users size={50} className="floating-icon" />
          <Star size={40} className="floating-icon" />
        </div>

        <div className="container-fluid py-5">
          <Fade duration={1000} triggerOnce>
            <div className="text-center mb-5">
              <div className="hero-card mx-auto" style={{ maxWidth: '800px' }}>
                <div className="p-4 p-md-5">
                  <Slide direction="up" duration={800} triggerOnce>
                    <div
                      className="image-container mb-4 mx-auto"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '400px',
                        backgroundColor: imageLoaded ? 'transparent' : '#eee',
                      }}
                    >
                      <div className="image-overlay"></div>
                      
                      {!imageLoaded && !imageError && (
                        <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                          <div className="custom-spinner"></div>
                        </div>
                      )}

                      {imageError ? (
                        <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                          <p className="text-danger mb-0">
                            <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
                            <br />Failed to load image
                          </p>
                        </div>
                      ) : (
                        <Image
                          src="/img/mchungaji.jpg"
                          alt="Deogratias Katabazi"
                          layout="fill"
                          objectFit="cover"
                          priority
                          style={{ borderRadius: '20px' }}
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                  </Slide>

                  <Slide direction="up" delay={300} duration={800} triggerOnce>
                    <h1 className="leader-title display-3 font-weight-bold mb-3">
                      Deogratias Katabazi
                    </h1>
                    <div className="d-flex align-items-center justify-content-center">
                      <Crown size={24} className="text-warning me-2" />
                      <p className="role-subtitle h4 mb-0">Mchungaji Kiongozi</p>
                    </div>
                  </Slide>
                </div>
              </div>
            </div>
          </Fade>

          <Fade direction="up" delay={500} duration={1000} triggerOnce>
            <Tabs
              id="role-tabs"
              activeKey={activeTab || ""}
              onSelect={(key) => setActiveTab(key as string)}
              className="custom-tabs mb-0"
            >
              {Object.entries(groupedRoles).map(([prefix, roles], index) => (
                <Tab
                  key={prefix}
                  eventKey={prefix}
                  title={
                    <span className="d-flex align-items-center">
                      <Users size={18} className="me-2" />
                      {prefix}
                    </span>
                  }
                >
                  <Slide direction="up" delay={200} duration={600} triggerOnce>
                    <div className="role-buttons-container mt-4">
                      <div className="d-flex flex-wrap justify-content-center gap-3">
                        {roles.map((role, roleIndex) => (
                          <button
                            key={role}
                            onClick={() => setActiveTab(role)}
                            className={`role-btn ${activeTab === role ? 'active' : ''}`}
                            style={{
                              animationDelay: `${roleIndex * 100}ms`
                            }}
                          >
                            <span>{formatRoleName2(role)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Slide>
                </Tab>
              ))}
            </Tabs>
          </Fade>

          <div className="mt-5">
            {loading ? (
              <Fade duration={500}>
                <div className="loading-container mx-auto" style={{ maxWidth: '400px' }}>
                  <div className="custom-spinner mx-auto mb-4"></div>
                  <h5 className="text-primary font-weight-bold mb-0">
                    Loading Leaders...
                  </h5>
                  <p className="text-muted mt-2">Please wait while we fetch the leadership team</p>
                </div>
              </Fade>
            ) : (
              <Fade direction="up" duration={800} triggerOnce>
                <Team 
                  leaders={leaders} 
                  activeSelection={activeTab ? formatRoleName2(activeTab) : ""} 
                />
              </Fade>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leadership;