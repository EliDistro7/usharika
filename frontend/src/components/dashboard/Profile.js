import { getLoggedInUserId } from "@/hooks/useUser";
import Link from "next/link";
import { FaUser, FaChurch, FaEdit, FaCrown } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const Profile = ({ user }) => {
  // Get user initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine if user has leadership role
  const isLeader = user?.roles?.some(role => role.includes('kiongozi')) || false;
  
  return (
    <>
      {/* Custom CSS for Profile Component */}
      <style jsx>{`
        .profile-container {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .profile-container:hover {
          transform: translateY(-2px);
        }
        
        .profile-image-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .profile-image {
          transition: all 0.3s ease;
          border: 3px solid rgba(157, 78, 221, 0.2);
          box-shadow: 0 4px 15px rgba(157, 78, 221, 0.2);
        }
        
        .profile-image:hover {
          border-color: #9d4edd;
          box-shadow: 0 8px 25px rgba(157, 78, 221, 0.4);
          transform: scale(1.05);
        }
        
        .profile-initials {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          border: 3px solid rgba(157, 78, 221, 0.2);
          transition: all 0.3s ease;
        }
        
        .profile-initials:hover {
          border-color: #9d4edd;
          box-shadow: 0 8px 25px rgba(157, 78, 221, 0.4);
          transform: scale(1.05);
        }
        
        .status-badge {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          animation: pulse 2s infinite;
        }
        
        .leader-crown {
          color: #ffd700;
          filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3));
        }
        
        .profile-name {
          background: linear-gradient(135deg, #9d4edd, #c77dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }
        
        .profile-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
          border: 1px solid rgba(157, 78, 221, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .online-indicator {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .edit-overlay {
          background: rgba(157, 78, 221, 0.9);
          transition: all 0.3s ease;
          opacity: 0;
        }
        
        .profile-image-wrapper:hover .edit-overlay {
          opacity: 1;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .profile-mobile {
            flex-direction: row !important;
            align-items: center !important;
            text-align: left !important;
          }
          
          .profile-image-mobile {
            width: 60px !important;
            height: 60px !important;
            margin-right: 15px !important;
            margin-bottom: 0 !important;
          }
          
          .profile-name-mobile {
            font-size: 1rem !important;
            margin-bottom: 0 !important;
          }
        }
        
        /* Desktop specific styles */
        @media (min-width: 769px) {
          .profile-desktop {
            text-align: center;
          }
          
          .profile-image-desktop {
            width: 100px !important;
            height: 100px !important;
          }
        }
      `}</style>

      <div className="profile-container">
        <Link 
          href={`/profile/${getLoggedInUserId()}`}
          className="text-decoration-none"
        >
          <div className="profile-card rounded-4 p-3 shadow-sm">
            
            {/* Mobile Layout */}
            <div className="d-flex d-md-none profile-mobile align-items-center">
              <div className="profile-image-wrapper flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user?.name || 'User'} Profile`}
                    className="profile-image rounded-circle profile-image-mobile"
                    style={{ 
                      width: "60px", 
                      height: "60px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback Avatar with Initials */}
                <div 
                  className={`profile-initials rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${user?.profilePicture ? 'd-none' : 'd-flex'}`}
                  style={{ 
                    width: "60px", 
                    height: "60px",
                    fontSize: "1.2rem"
                  }}
                >
                  {getInitials(user?.name)}
                </div>

                {/* Online Status Indicator */}
                <div 
                  className="position-absolute bottom-0 end-0 online-indicator rounded-circle border border-white"
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#28a745",
                    right: "2px",
                    bottom: "2px"
                  }}
                ></div>

                {/* Edit Overlay */}
                <div className="edit-overlay position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                  <FaEdit className="text-white" size={16} />
                </div>
              </div>

              <div className="flex-grow-1 ms-3">
                <div className="d-flex align-items-center mb-1">
                  <h6 className="profile-name profile-name-mobile fw-bold mb-0 me-2">
                    {user?.name || "Church Member"}
                  </h6>
                  
                  {/* Leadership Badge */}
                  {isLeader && (
                    <FaCrown className="leader-crown" size={16} title="Church Leader" />
                  )}
                  
                  {/* Verified Badge */}
                  <MdVerified className="text-success ms-1" size={16} title="Verified Member" />
                </div>
                
                <div className="d-flex align-items-center">
                  <FaChurch className="text-purple me-1" size={12} />
                  <small className="text-muted">Active Member</small>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="d-none d-md-block profile-desktop text-center">
              <div className="profile-image-wrapper position-relative d-inline-block mb-3">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user?.name || 'User'} Profile`}
                    className="profile-image rounded-circle profile-image-desktop"
                    style={{ 
                      width: "100px", 
                      height: "100px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback Avatar with Initials */}
                <div 
                  className={`profile-initials rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${user?.profilePicture ? 'd-none' : 'd-flex'}`}
                  style={{ 
                    width: "100px", 
                    height: "100px",
                    fontSize: "2rem"
                  }}
                >
                  {getInitials(user?.name)}
                </div>

                {/* Online Status Indicator */}
                <div 
                  className="position-absolute online-indicator rounded-circle border border-white"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#28a745",
                    right: "8px",
                    bottom: "8px"
                  }}
                ></div>

                {/* Leadership Crown */}
                {isLeader && (
                  <div 
                    className="position-absolute"
                    style={{ top: "-8px", right: "15px" }}
                  >
                    <FaCrown className="leader-crown" size={20} title="Church Leader" />
                  </div>
                )}

                {/* Edit Overlay */}
                <div className="edit-overlay position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                  <FaEdit className="text-white" size={20} />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center mb-2">
                <h5 className="profile-name fw-bold mb-0 me-2">
                  {user?.name || "Church Member"}
                </h5>
                <MdVerified className="text-success" size={18} title="Verified Member" />
              </div>
              
              <div className="d-flex align-items-center justify-content-center">
                <FaChurch className="text-purple me-2" size={14} />
                <small className="text-muted fw-medium">Active Church Member</small>
              </div>

              {/* Member Status Badge */}
              <div className="mt-2">
                <span className="status-badge badge text-white px-3 py-1 rounded-pill small">
                  <FaUser className="me-1" size={10} />
                  Online
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Profile;