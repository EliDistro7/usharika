import React from "react";
import { Crown, Phone, User, MapPin, Briefcase, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

const UserTableRows = ({
  users,
  sortBy,
  calculatePledgeTotals,
  handleUserClick,
}) => {

 

  return (
    <>
      {users.map((user, index) => {
        const { totalPledged, totalPaid, totalRemaining } =
          sortBy !== "none" ? calculatePledgeTotals(user, sortBy) : {};
  
        const hasKiongoziRole = user.selectedRoles.some((role) =>
          role.startsWith("kiongozi")
        );

        // Calculate completion percentage for pledges
        const completionPercentage = sortBy !== "none" && totalPledged > 0 
          ? Math.round((totalPaid / totalPledged) * 100) 
          : 0;
  
        return (
          <tr
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="align-middle"
            style={{
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderBottom: "1px solid rgba(139, 69, 193, 0.08)",
              background: index % 2 === 0 
                ? "linear-gradient(135deg, #ffffff 0%, #fefeff 100%)" 
                : "linear-gradient(135deg, #fafafa 0%, #f8f6ff 100%)",
            }}
        
      
          >
            {/* Enhanced Profile Picture */}
            <td className="text-center" style={{ padding: "16px 12px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={user.profilePicture || "/img/default-profile.png"}
                  alt={user.name}
                  className="rounded-circle"
                  width="48"
                  height="48"
                  style={{ 
                    border: "3px solid #8b45c1",
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(139, 69, 193, 0.2)",
                  }}
                />
                {/* Verification indicator */}
                {user.verified && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      background: "#10b981",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{
                      width: "6px",
                      height: "6px",
                      background: "white",
                      borderRadius: "50%",
                    }}></div>
                  </div>
                )}
              </div>
            </td>
  
            {/* Enhanced User Name with Kiongozi Badge */}
            <td style={{ padding: "16px 12px" }}>
              <div className="d-flex align-items-center">
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <span 
                      className="fw-bold" 
                      style={{ 
                        color: "#8b45c1",
                        fontSize: "1.05rem",
                        marginRight: "8px",
                      }}
                    >
                      {user.name}
                    </span>
                    {hasKiongoziRole && (
                      <span
                        className="badge d-flex align-items-center"
                        style={{
                          background: "linear-gradient(135deg, #8b45c1 0%, #9b59b6 100%)",
                          color: "white",
                          fontSize: "0.7rem",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontWeight: "500",
                          boxShadow: "0 2px 8px rgba(139, 69, 193, 0.3)",
                        }}
                      >
                        <Crown size={12} style={{ marginRight: "4px" }} />
                        Kiongozi
                      </span>
                    )}
                  </div>
                  {/* Show phone on mobile as subtitle */}
                  <div className="d-md-none">
                    <small style={{ color: "#64748b", fontSize: "0.8rem" }}>
                      <Phone size={12} style={{ marginRight: "4px" }} />
                      {user.phone}
                    </small>
                  </div>
                </div>
              </div>
            </td>
  
            {/* User Details */}
            {sortBy === "none" ? (
              <>
                {/* Enhanced Phone column - hidden on small screens */}
                <td className="d-none d-md-table-cell" style={{ padding: "16px 12px" }}>
                  <div className="d-flex align-items-center">
                    <Phone size={16} style={{ color: "#9b59b6", marginRight: "8px" }} />
                    <span style={{ color: "#64748b", fontWeight: "500" }}>
                      {user.phone}
                    </span>
                  </div>
                </td>
  
                {/* Enhanced Gender column - hidden on extra small screens */}
                <td className="d-none d-sm-table-cell" style={{ padding: "16px 12px" }}>
                  <div className="d-flex align-items-center">
                    <User size={16} style={{ color: "#9b59b6", marginRight: "8px" }} />
                    <span 
                      className="badge"
                      style={{
                        background: user.gender === "me" 
                          ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                          : "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                        color: "white",
                        fontSize: "0.75rem",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {user.gender === "me" ? "Mume" : "Mke"}
                    </span>
                  </div>
                </td>
  
                {/* Enhanced Jumuiya column - hidden on small screens */}
                <td
                  className="d-none d-lg-table-cell"
                  style={{ padding: "16px 12px" }}
                >
                  <div className="d-flex align-items-center">
                    <MapPin size={16} style={{ color: "#9b59b6", marginRight: "8px" }} />
                    <span
                      style={{
                        maxWidth: "180px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        color: "#8b45c1",
                        fontWeight: "500",
                      }}
                      title={user.jumuiya}
                    >
                      {user.jumuiya}
                    </span>
                  </div>
                </td>
  
                {/* Enhanced Occupation column */}
                <td style={{ padding: "16px 12px" }}>
                  <div className="d-flex align-items-center">
                    <Briefcase size={16} style={{ color: "#9b59b6", marginRight: "8px" }} />
                    <span 
                      style={{ 
                        color: "#64748b",
                        fontWeight: "500",
                        maxWidth: "150px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      title={user.occupation}
                    >
                      {user.occupation}
                    </span>
                  </div>
                </td>
              </>
            ) : (
              <>
                {/* Enhanced Pledge Totals */}
                <td style={{ padding: "16px 12px" }}>
                  <div className="d-flex align-items-center">
                    <TrendingUp size={16} style={{ color: "#10b981", marginRight: "8px" }} />
                    <div>
                      <div style={{ color: "#10b981", fontWeight: "700", fontSize: "1.1rem" }}>
                        {totalPledged?.toLocaleString() || '0'}
                      </div>
                      <small style={{ color: "#64748b", fontSize: "0.75rem" }}>
                        Ahadi
                      </small>
                    </div>
                  </div>
                </td>
                
                <td style={{ padding: "16px 12px" }}>
                  <div className="d-flex align-items-center">
                    <DollarSign size={16} style={{ color: "#3b82f6", marginRight: "8px" }} />
                    <div>
                      <div style={{ color: "#3b82f6", fontWeight: "700", fontSize: "1.1rem" }}>
                        {totalPaid?.toLocaleString() || '0'}
                      </div>
                      <small style={{ color: "#64748b", fontSize: "0.75rem" }}>
                        Iliyolipwa
                      </small>
                    </div>
                  </div>
                </td>
                
                <td style={{ padding: "16px 12px" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <AlertCircle size={16} style={{ color: "#ef4444", marginRight: "8px" }} />
                      <div>
                        <div style={{ color: "#ef4444", fontWeight: "700", fontSize: "1.1rem" }}>
                          {totalRemaining?.toLocaleString() || '0'}
                        </div>
                        <small style={{ color: "#64748b", fontSize: "0.75rem" }}>
                          Baki
                        </small>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    {sortBy !== "none" && totalPledged > 0 && (
                      <div className="ms-3">
                        <div
                          style={{
                            width: "60px",
                            height: "8px",
                            background: "rgba(139, 69, 193, 0.1)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(completionPercentage, 100)}%`,
                              height: "100%",
                              background: completionPercentage >= 100 
                                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                : completionPercentage >= 50
                                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                              borderRadius: "4px",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        <small 
                          style={{ 
                            color: "#64748b", 
                            fontSize: "0.7rem",
                            display: "block",
                            textAlign: "center",
                            marginTop: "2px",
                          }}
                        >
                          {completionPercentage}%
                        </small>
                      </div>
                    )}
                  </div>
                </td>
              </>
            )}
          </tr>
        );
      })}
    </>
  );
};

export default UserTableRows;