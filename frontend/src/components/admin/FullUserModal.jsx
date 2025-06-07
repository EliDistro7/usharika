import { verifyUser } from "@/actions/admin";
import { formatRoleName } from "@/actions/utils";
import React from "react";
import { Toast } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { User, Phone, Users, Calendar, Briefcase, Award, Gift, Heart } from "lucide-react";

const FullUserModal = ({ user, onClose, notification }) => {
  if (!user) return null;

  const handleVerification = async () => {
    try {
      if (notification.type === "registeringNotification") {
        await verifyUser({ userId: notification.userId });
        toast.success(`Ndugu ${notification.name} amethibitishwa kuwa Msharika wa Usharika wa Yombo`);
        return;
      }
      if (notification.type === "kujiungaKikundi") {
        toast.success(`Ndugu ${notification.name} amethibitishwa kujiunga na ${notification.selectedRole}`);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(139, 69, 193, 0.1) 0%, rgba(155, 89, 182, 0.2) 100%)",
        backdropFilter: "blur(10px)",
        zIndex: 1050,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <ToastContainer 
        autoClose={4000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div
        className="modal-content"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)",
          borderRadius: "24px",
          maxWidth: "800px",
          width: "95%",
          maxHeight: "95vh",
          boxShadow: "0 25px 50px rgba(139, 69, 193, 0.15), 0 15px 35px rgba(155, 89, 182, 0.1)",
          border: "1px solid rgba(139, 69, 193, 0.1)",
          overflow: "hidden",
          animation: "slideUp 0.4s ease-out",
        }}
      >
        {/* Header with gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #8b45c1 0%, #9b59b6 100%)",
            padding: "24px 32px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}></div>
          
          <div className="d-flex justify-content-between align-items-center position-relative">
            <div>
              <h4 className="mb-2" style={{ fontWeight: "700", fontSize: "1.5rem" }}>
                {notification.type === "registeringNotification"
                  ? "Maombi ya Usajili"
                  : `Kujiunga na Kikundi`}
              </h4>
              {notification.type !== "registeringNotification" && (
                <p className="mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>
                  {formatRoleName(notification.selectedRole)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                cursor: "pointer",
                color: "white",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          className="overflow-auto"
          style={{ 
            maxHeight: "calc(95vh - 180px)",
            padding: "32px",
          }}
        >
          {/* User Profile Card */}
          <div 
            className="mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f3f0ff 100%)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(139, 69, 193, 0.1)",
              boxShadow: "0 8px 25px rgba(139, 69, 193, 0.08)",
            }}
          >
            <div className="d-flex align-items-center">
              <div style={{ position: "relative" }}>
                <img
                  src={user.profilePicture || "/img/default-profile.png"}
                  alt={`${user.name}'s profile`}
                  className="rounded-circle"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    marginRight: "24px",
                    border: "4px solid #8b45c1",
                    boxShadow: "0 8px 25px rgba(139, 69, 193, 0.2)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "24px",
                    background: user.verified ? "#10b981" : "#f59e0b",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    border: "3px solid white",
                  }}
                ></div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="mb-3" style={{ 
                  fontWeight: "700", 
                  color: "#8b45c1",
                  fontSize: "1.8rem"
                }}>
                  {user.name}
                </h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Phone size={18} style={{ color: "#9b59b6", marginRight: "8px" }} />
                      <span style={{ color: "#64748b" }}>{user.phone}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Users size={18} style={{ color: "#9b59b6", marginRight: "8px" }} />
                      <span style={{ color: "#64748b" }}>{user.jumuiya}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <User size={18} style={{ color: "#9b59b6", marginRight: "8px" }} />
                      <span style={{ color: "#64748b" }}>
                        {user.gender === "me" ? "Mwanaume" : "Mwanamke"}
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Calendar size={18} style={{ color: "#9b59b6", marginRight: "8px" }} />
                      <span style={{ color: "#64748b" }}>
                        {new Date().getFullYear() - new Date(user.dob).getFullYear()} miaka
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div 
            className="mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(139, 69, 193, 0.1)",
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <User size={20} style={{ color: "#8b45c1", marginRight: "8px" }} />
              <h5 style={{ fontWeight: "600", color: "#8b45c1", margin: 0 }}>
                Taarifa binafsi
              </h5>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <small style={{ color: "#64748b", fontWeight: "500" }}>Hali ya Ndoa</small>
                  <p style={{ color: "#334155", marginBottom: "0", fontWeight: "500" }}>
                    {user.maritalStatus} ({user.marriageType})
                  </p>
                </div>
                <div className="mb-3">
                  <small style={{ color: "#64748b", fontWeight: "500" }}>Ubatizo</small>
                  <p style={{ color: "#334155", marginBottom: "0", fontWeight: "500" }}>
                    <span className={`badge ${user.ubatizo ? 'bg-success' : 'bg-warning'}`}>
                      {user.ubatizo ? "Ndiyo" : "Hapana"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <small style={{ color: "#64748b", fontWeight: "500" }}>Kipaimara</small>
                  <p style={{ color: "#334155", marginBottom: "0", fontWeight: "500" }}>
                    <span className={`badge ${user.kipaimara ? 'bg-success' : 'bg-warning'}`}>
                      {user.kipaimara ? "Ndiyo" : "Hapana"}
                    </span>
                  </p>
                </div>
                <div className="mb-3">
                  <small style={{ color: "#64748b", fontWeight: "500" }}>Kazi</small>
                  <div className="d-flex align-items-center">
                    <Briefcase size={16} style={{ color: "#9b59b6", marginRight: "6px" }} />
                    <span style={{ color: "#334155", fontWeight: "500" }}>{user.occupation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Card */}
          <div 
            className="mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fef7ff 100%)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(139, 69, 193, 0.1)",
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <Award size={20} style={{ color: "#8b45c1", marginRight: "8px" }} />
              <h5 style={{ fontWeight: "600", color: "#8b45c1", margin: 0 }}>
                Nafasi na Vikundi alivyomo
              </h5>
            </div>
            {user.selectedRoles.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {user.selectedRoles.map((role, index) => (
                  <span
                    key={index}
                    className="badge"
                    style={{
                      background: "linear-gradient(135deg, #8b45c1 0%, #9b59b6 100%)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                    }}
                  >
                    {role.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontStyle: "italic", margin: 0 }}>
                Hakuna majukumu yaliyotolewa.
              </p>
            )}
          </div>

          {/* Pledges Card */}
          <div 
            className="mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(139, 69, 193, 0.1)",
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <Gift size={20} style={{ color: "#8b45c1", marginRight: "8px" }} />
              <h5 style={{ fontWeight: "600", color: "#8b45c1", margin: 0 }}>
                Ahadi za Msharika
              </h5>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div 
                  style={{
                    background: "rgba(139, 69, 193, 0.05)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(139, 69, 193, 0.1)",
                  }}
                >
                  <h6 style={{ color: "#8b45c1", fontWeight: "600", marginBottom: "8px" }}>Ahadi</h6>
                  <p style={{ margin: 0, color: "#334155" }}>
                    <strong>{user.pledges.ahadi.toLocaleString()}</strong> TZS
                  </p>
                  <small style={{ color: "#10b981" }}>
                    Iliyolipwa: {user.pledges.paidAhadi.toLocaleString()} TZS
                  </small>
                </div>
              </div>
              <div className="col-md-6">
                <div 
                  style={{
                    background: "rgba(139, 69, 193, 0.05)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(139, 69, 193, 0.1)",
                  }}
                >
                  <h6 style={{ color: "#8b45c1", fontWeight: "600", marginBottom: "8px" }}>Jengo</h6>
                  <p style={{ margin: 0, color: "#334155" }}>
                    <strong>{user.pledges.jengo.toLocaleString()}</strong> TZS
                  </p>
                  <small style={{ color: "#10b981" }}>
                    Iliyolipwa: {user.pledges.paidJengo.toLocaleString()} TZS
                  </small>
                </div>
              </div>
            </div>
            
            {/* Dynamic pledges */}
            {user.pledges.other && Object.keys(user.pledges.other).length > 0 && (
              <div className="mt-3">
                <div className="row g-2">
                  {Object.entries(user.pledges.other).map(([key, { total, paid }]) => (
                    <div key={key} className="col-md-6">
                      <div 
                        style={{
                          background: "rgba(139, 69, 193, 0.05)",
                          borderRadius: "12px",
                          padding: "16px",
                          border: "1px solid rgba(139, 69, 193, 0.1)",
                        }}
                      >
                        <h6 style={{ color: "#8b45c1", fontWeight: "600", marginBottom: "8px" }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </h6>
                        <p style={{ margin: 0, color: "#334155" }}>
                          <strong>{total.toLocaleString()}</strong> TZS
                        </p>
                        <small style={{ color: "#10b981" }}>
                          Iliyolipwa: {paid.toLocaleString()} TZS
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dependents Card */}
          <div 
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(139, 69, 193, 0.1)",
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <Heart size={20} style={{ color: "#8b45c1", marginRight: "8px" }} />
              <h5 style={{ fontWeight: "600", color: "#8b45c1", margin: 0 }}>
                Wategemezi
              </h5>
            </div>
            {user.dependents.length > 0 ? (
              <div className="row g-2">
                {user.dependents.map((dependent, index) => (
                  <div key={index} className="col-md-6">
                    <div 
                      style={{
                        background: "rgba(139, 69, 193, 0.05)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        border: "1px solid rgba(139, 69, 193, 0.1)",
                      }}
                    >
                      <p style={{ margin: 0, color: "#334155", fontWeight: "500" }}>
                        {dependent.name}
                      </p>
                      <small style={{ color: "#64748b" }}>({dependent.relation})</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontStyle: "italic", margin: 0 }}>
                Hakuna wategemezi waliosajiliwa.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #f3f0ff 100%)",
            padding: "20px 32px",
            borderTop: "1px solid rgba(139, 69, 193, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "2px solid #8b45c1",
              color: "#8b45c1",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#8b45c1";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#8b45c1";
            }}
          >
            Funga
          </button>
          <button
            type="button"
            onClick={handleVerification}
            style={{
              background: "linear-gradient(135deg, #8b45c1 0%, #9b59b6 100%)",
              border: "none",
              color: "white",
              padding: "12px 32px",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(139, 69, 193, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(139, 69, 193, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(139, 69, 193, 0.3)";
            }}
          >
            Thibitisha
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(139, 69, 193, 0.1);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b45c1 0%, #9b59b6 100%);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
        }
      `}</style>
    </div>
  );
};

export default FullUserModal;