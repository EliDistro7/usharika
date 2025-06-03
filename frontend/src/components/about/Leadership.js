'use client';

import React, { useState, useEffect } from "react";
import { getDefaultRoles, getLeadersByRole } from "@/actions/users";
import { formatRoleName2 } from "@/actions/utils";
import { Tabs, Tab } from "react-bootstrap";
import Image from "next/image";
import { Fade, Slide } from "react-awesome-reveal";
import { Crown, Users, Star, Phone, UserCheck } from "lucide-react";
import PropTypes from "prop-types";

// Enhanced Team Component
const Team = ({ leaders, activeSelection }) => {
  console.log('leaders', leaders);
  
  // Format activeSelection: remove spaces and replace with underscores, then prefix with "kiongozi_"
  const formattedSelection = `kiongozi_${(activeSelection || "").toLowerCase().replace(/\s+/g, '_')}`;

  const teamStyles = `
    .team-container {
    
      position: relative;
      overflow: hidden;
    }

    .team-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="team" cx="50%" cy="50%"><stop offset="0%" stop-color="%23667eea" stop-opacity="0.05"/><stop offset="100%" stop-color="%23764ba2" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="100" r="80" fill="url(%23team)"/><circle cx="900" cy="200" r="60" fill="url(%23team)"/><circle cx="300" cy="800" r="90" fill="url(%23team)"/></svg>') no-repeat;
      background-size: cover;
    }

    .team-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 40px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    }

    .team-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    }

    .team-title {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      margin-bottom: 15px;
    }

    .team-subtitle {
      background: linear-gradient(135deg, #764ba2, #667eea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      margin-bottom: 0;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 30px;
      padding: 0 15px;
    }

    .team-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    }

    .team-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .team-card:hover::before {
      left: 100%;
    }

    .team-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 25px 50px rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .profile-image-container {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 25px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid transparent;
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 4px;
      transition: all 0.3s ease;
    }

    .team-card:hover .profile-image-container {
      transform: scale(1.1);
      box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
    }

    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      background: #f8f9fa;
      transition: all 0.3s ease;
    }

    .member-name {
      color: #2d3748;
      font-weight: 700;
      font-size: 1.4rem;
      margin-bottom: 10px;
      transition: all 0.3s ease;
    }

    .team-card:hover .member-name {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .member-position {
      color: #764ba2;
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .member-phone {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      color: #667eea;
      padding: 12px 20px;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      border: 2px solid rgba(102, 126, 234, 0.2);
    }

    .member-phone:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      text-decoration: none;
      border-color: transparent;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      margin: 40px 0;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .empty-icon {
      color: #cbd5e0;
      margin-bottom: 20px;
    }

    .empty-text {
      color: #718096;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .team-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 0 10px;
      }
      
      .team-card {
        padding: 25px 20px;
      }
      
      .team-header {
        padding: 30px 20px;
        margin: 0 10px 30px;
      }
    }
  `;

  return (
    <>
      <style>{teamStyles}</style>
      <div className="team-container py-5">
        <div className="container">
          <Fade duration={800} triggerOnce>
            <div className="team-header text-center">
              <h4 className="team-title h3">
                {activeSelection || "Leadership Team"}
              </h4>
              <h1 className="team-subtitle display-5">
                USHARIKA WA YOMBO
              </h1>
            </div>
          </Fade>

          {leaders.length === 0 ? (
            <Fade duration={600} triggerOnce>
              <div className="empty-state">
                <Users size={60} className="empty-icon" />
                <p className="empty-text">No leaders found for this selection</p>
              </div>
            </Fade>
          ) : (
            <div className="team-grid">
              {leaders.map((leader, index) => {
                // Extract the positions from the leader's `leadershipPositions` field
                const leaderPositions = leader.leadershipPositions?.[formattedSelection] || [];

                return (
                  <Slide 
                    key={leader.id || index}
                    direction="up" 
                    delay={index * 100} 
                    duration={600} 
                    triggerOnce
                  >
                    <div className="team-card">
                      <div className="profile-image-container">
                        <img
                          src={leader.profilePicture || "/default-profile.png"}
                          alt={leader.name}
                          className="profile-image"
                          onError={(e) => {
                            e.target.src = "/default-profile.png";
                          }}
                        />
                      </div>
                      
                      <h5 className="member-name">{leader.name}</h5>
                      
                      <div className="member-position">
                        <UserCheck size={18} />
                        {leaderPositions.length > 0 ? leaderPositions.join(", ") : "Leader"}
                      </div>

                      <a
                        href={`tel:${leader.phone}`}
                        className="member-phone"
                      >
                        <Phone size={16} />
                        {leader.phone}
                      </a>
                    </div>
                  </Slide>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Team.propTypes = {
  leaders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
      leadershipPositions: PropTypes.object,
    })
  ).isRequired,
  activeSelection: PropTypes.string,
};

const Leadership= () => {
  const [activeTab, setActiveTab] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [leaders, setLeaders] = useState([]);
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
  }, {});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const defaultRoles = await getDefaultRoles();
        const leaderRoleNames = defaultRoles
          .filter((roleObj) => roleObj.role.startsWith("kiongozi"))
          .map((roleObj) => roleObj.role);
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
              onSelect={(key) => setActiveTab(key)}
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