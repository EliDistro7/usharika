'use client';

import React, { useEffect, useState } from "react";
import NavbarTabs from "./NavbarTabs";
import { getUserNotifications, getUserDonations } from "@/actions/users";
import { getLoggedInUserId, removeCookie } from "@/hooks/useUser";
import Donations from './Donations';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Check if the user has any "kiongozi" roles
const hasKiongoziRole = (roles) => roles.some((role) => role.startsWith("kiongozi"));

// Enhanced Pinned Announcements Component
const PinnedAnnouncements = ({ notifications }) => {
  const pinned = notifications.filter((notification) => notification.pinned);

  return (
    <div className="dropdown">
      <button
        className="btn btn-gradient-purple dropdown-toggle shadow-sm d-flex align-items-center"
        type="button"
        id="pinnedAnnouncementsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '25px',
          padding: '10px 20px',
          fontWeight: '600',
          color: 'white',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
          minWidth: '180px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 25px rgba(111, 66, 193, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(111, 66, 193, 0.3)';
        }}
      >
        <i className="bi bi-pin-angle-fill me-2"></i>
        <span className="flex-grow-1 text-start">Matangazo</span>
        {pinned.length > 0 && (
          <span 
            className="badge ms-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              minWidth: '20px'
            }}
          >
            {pinned.length}
          </span>
        )}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end shadow-lg"
        aria-labelledby="pinnedAnnouncementsDropdown"
        style={{
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
          minWidth: '350px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
      >
        {pinned.length > 0 ? (
          pinned.map((announcement, index) => (
            <li key={index} className="dropdown-item-wrapper">
              <div 
                className="dropdown-item border-0 p-3 mb-1 mx-2"
                style={{
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
                  border: '1px solid rgba(111, 66, 193, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)';
                  e.target.style.color = 'inherit';
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="me-3 mt-1 flex-shrink-0"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#6f42c1'
                    }}
                  ></div>
                  <div className="flex-grow-1">
                    <p className="mb-2 fw-500" style={{ lineHeight: '1.4', fontSize: '0.9rem' }}>
                      {announcement.message}
                    </p>
                    <small className="text-muted d-flex align-items-center">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(announcement.time).toLocaleDateString('sw-TZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="dropdown-item text-center py-5">
            <div className="text-muted">
              <i className="bi bi-pin" style={{ fontSize: '2.5rem', opacity: '0.3' }}></i>
              <p className="mt-3 mb-0">Hakuna matangazo uliyo-pin.</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

const Dashboard = ({ user, summary }) => {
  console.log('user', user)
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const isKiongozi = hasKiongoziRole(user?.selectedRoles || []);
  const userRoles = user?.selectedRoles || [];

  const pledges = [
    { title: "Ahadi", paid: user?.pledges?.paidAhadi || 0, total: user?.pledges?.ahadi || 0 },
    { title: "Jengo", paid: user?.pledges?.paidJengo || 0, total: user?.pledges?.jengo || 0 },
    ...(user?.pledges?.other
      ? Object.keys(user?.pledges?.other).map((key) => ({
          title: key,
          paid: user?.pledges?.other[key]?.paid || 0,
          total: user?.pledges?.other[key]?.total || 0,
        }))
      : []),
  ];

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const notifications = await getUserNotifications(getLoggedInUserId());
        setNotifications(notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const confirmLogout = (isConfirmed) => {
    if (isConfirmed) {
      removeCookie();
      router.push("/");
    } else {
      toast.dismiss();
    }
  };

  const handleLogout = () => {
    toast.info(
      <div className="text-center p-3">
        <div className="mb-3">
          <i className="bi bi-question-circle" style={{ fontSize: '2.5rem', color: '#6f42c1' }}></i>
        </div>
        <h6 className="mb-3 fw-600">Unataka ku-log-out?</h6>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-danger btn-sm px-4 py-2"
            onClick={() => confirmLogout(true)}
            style={{ borderRadius: '20px', fontWeight: '600' }}
          >
            <i className="bi bi-check-lg me-1"></i>
            Ndio
          </button>
          <button
            className="btn btn-secondary btn-sm px-4 py-2"
            onClick={() => confirmLogout(false)}
            style={{ borderRadius: '20px', fontWeight: '600' }}
          >
            <i className="bi bi-x-lg me-1"></i>
            Hapana
          </button>
        </div>
      </div>,
      { 
        autoClose: false,
        closeButton: false,
        className: 'custom-toast'
      }
    );
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add a title with styling
    doc.setFontSize(20);
    doc.setTextColor(111, 66, 193);
    doc.text("Ripoti ya Sadaka za Kanisa", 14, 25);
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tarehe: ${new Date().toLocaleDateString('sw-TZ')}`, 14, 35);

    // Format table data
    const tableColumn = ["Aina", "Kilicholipwa (TZS)", "Iliyoahidiwa (TZS)", "Maendeleo (%)", "Iliyobaki (TZS)"];
    const tableRows = pledges.map((pledge) => [
      pledge.title,
      pledge.paid.toLocaleString(),
      pledge.total.toLocaleString(),
      `${Math.round((pledge.paid / pledge.total) * 100)}%`,
      (pledge.total - pledge.paid).toLocaleString(),
    ]);

    // Add the table with enhanced styling
    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      styles: { 
        fontSize: 10,
        cellPadding: 8
      },
      headStyles: {
        fillColor: [111, 66, 193],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 255]
      },
      theme: "striped",
    });

    doc.save("Ripoti_Sadaka_za_Kanisa.pdf");
  };

  return (
    <>
      {/* Custom Styles */}
      <style jsx>{`
        .dashboard-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 20px 0;
        }
        
        .navbar-enhanced {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }
        
        .header-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 25px 30px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 25px;
        }
        
        .user-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
          flex-shrink: 0;
        }
        
        .btn-logout {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          border: none;
          border-radius: 25px;
          padding: 10px 25px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          min-width: 120px;
        }
        
        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
          color: white;
        }
        
        .donations-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 30px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 25px;
        }
        
        .contributions-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .contributions-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .card-header-enhanced {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px 30px;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .card-header-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), 
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          opacity: 0.1;
        }
        
        .btn-download {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 20px;
          padding: 10px 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          min-width: 150px;
        }
        
        .btn-download:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
        }
        
        .table-enhanced {
          background: transparent;
          margin-bottom: 0;
        }
        
        .table-enhanced thead th {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
          color: #6f42c1;
          border: none;
          padding: 20px 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.85rem;
          vertical-align: middle;
          white-space: nowrap;
        }
        
        .table-enhanced tbody tr {
          transition: all 0.3s ease;
          border: none;
        }
        
        .table-enhanced tbody tr:hover {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
          transform: scale(1.005);
          box-shadow: 0 5px 15px rgba(111, 66, 193, 0.1);
        }
        
        .table-enhanced tbody td {
          padding: 20px 20px;
          border: none;
          vertical-align: middle;
          font-weight: 500;
        }
        
        .progress-enhanced {
          height: 25px;
          border-radius: 15px;
          background: linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .progress-bar-enhanced {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(111, 66, 193, 0.3);
        }
        
        .progress-bar-enhanced::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%), 
                      linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.2) 75%), 
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.2) 75%);
          background-size: 10px 10px;
          background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
          animation: progress-animation 2s linear infinite;
        }
        
        @keyframes progress-animation {
          0% { background-position: 0 0, 0 5px, 5px -5px, -5px 0px; }
          100% { background-position: 10px 0, 10px 5px, 15px -5px, 5px 0px; }
        }
        
        .amount-display {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          color: #2d3748;
          font-variant-numeric: tabular-nums;
        }
        
        .amount-paid {
          color: #059669;
        }
        
        .amount-remaining {
          color: #dc2626;
        }
        
        .mobile-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          border-left: 5px solid #6f42c1;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }
        
        .mobile-stats {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
          border-radius: 15px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .mobile-stats:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 15px 10px;
          }
          
          .header-section {
            padding: 20px;
            margin-bottom: 20px;
          }
          
          .user-avatar {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }
          
          .donations-container {
            padding: 20px;
            margin-bottom: 20px;
          }
          
          .card-header-enhanced {
            padding: 20px;
          }
          
          .mobile-card {
            padding: 20px;
            margin-bottom: 15px;
          }
          
          .btn-logout,
          .btn-download {
            padding: 8px 20px;
            min-width: auto;
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 576px) {
          .header-section {
            padding: 15px;
          }
          
          .donations-container {
            padding: 15px;
          }
          
          .card-header-enhanced {
            padding: 15px;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
      `}</style>

      <div className="dashboard-container">
        <div className="container-fluid animate-fade-in">
          {/* Enhanced Navbar */}
          <div className="navbar-enhanced p-3 mb-4 animate-slide-up">
            <NavbarTabs roles={userRoles} notifications={notifications || []} user={user} />
          </div>
          
          {/* Enhanced Header Section */}
          <div className="header-section animate-slide-up">
            <div className="row align-items-center g-3">
              <div className="col-lg-8">
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-4">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="mb-1 fw-bold" style={{ color: '#2d3748' }}>
                      Karibu, {user?.name || 'Msharika'}!
                    </h4>
                    <p className="mb-0 text-muted">
                      <i className="bi bi-graph-up me-2"></i>
                      Hali ya sadaka zako za kanisa
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">
                  <PinnedAnnouncements notifications={notifications} />
                  <button 
                    className="btn btn-logout d-flex align-items-center justify-content-center"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    <span>Toka</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Donations Component */}
          <div className="donations-container animate-slide-up">
            <Donations />
          </div>

          {/* Enhanced Contributions Table */}
          <div className="contributions-card animate-slide-up">
            <div className="card-header-enhanced">
              <div className="row align-items-center position-relative">
                <div className="col-lg-8">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="bi bi-bar-chart-fill" style={{ fontSize: '1.8rem' }}></i>
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">Sadaka za Kanisa</h4>
                      <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
                        Muhtasari wa michango yako
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mt-3 mt-lg-0">
                  <div className="d-flex justify-content-lg-end">
                    <button
                      className="btn btn-download d-flex align-items-center justify-content-center"
                      onClick={handleDownload}
                    >
                      <i className="bi bi-download me-2"></i>
                      <span>Pakua Ripoti</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              {/* Desktop Table */}
              <div className="d-none d-xl-block">
                <div className="table-responsive">
                  <table className="table table-enhanced">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '150px' }}>
                          <i className="bi bi-tag me-2"></i>
                          Aina ya Sadaka
                        </th>
                        <th className="text-end" style={{ minWidth: '140px' }}>
                          <i className="bi bi-check-circle me-2"></i>
                          Kilicholipwa
                        </th>
                        <th className="text-end" style={{ minWidth: '140px' }}>
                          <i className="bi bi-target me-2"></i>
                          Iliyoahidiwa
                        </th>
                        <th className="text-center" style={{ minWidth: '200px' }}>
                          <i className="bi bi-graph-up me-2"></i>
                          Maendeleo
                        </th>
                        <th className="text-end" style={{ minWidth: '140px' }}>
                          <i className="bi bi-clock me-2"></i>
                          Iliyobaki
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pledges.map((pledge, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="me-3 flex-shrink-0"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: index % 2 === 0 ? '#667eea' : '#764ba2'
                                }}
                              ></div>
                              <strong className="text-nowrap">{pledge.title}</strong>
                            </div>
                          </td>
                          <td className="text-end">
                            <span className="amount-display amount-paid">
                              TZS {pledge.paid.toLocaleString()}
                            </span>
                          </td>
                          <td className="text-end">
                            <span className="amount-display">
                              TZS {pledge.total.toLocaleString()}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="progress progress-enhanced mx-2">
                              <div
                                className="progress-bar progress-bar-enhanced d-flex align-items-center justify-content-center"
                                role="progressbar"
                                style={{ width: `${Math.min((pledge.paid / pledge.total) * 100, 100)}%` }}
                                aria-valuenow={(pledge.paid / pledge.total) * 100}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                <span className="fw-bold text-white" style={{ fontSize: '0.8rem' }}>
                                  {Math.round((pledge.paid / pledge.total) * 100)}%
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-end">
                            <span className="amount-display amount-remaining">
                              TZS {(pledge.total - pledge.paid).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="d-xl-none p-3">
                <div className="row">
                  {pledges.map((pledge, index) => (
                    <div key={index} className="col-lg-6 col-12">
                      <div className="mobile-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="me-3"
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: index % 2 === 0 ? '#667eea' : '#764ba2'
                              }}
                            ></div>
                            <h6 className="mb-0 fw-bold" style={{ color: '#6f42c1' }}>
                              {pledge.title}
                            </h6>
                          </div>
                          <span 
                            className="badge"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '15px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                          >
                            {Math.round((pledge.paid / pledge.total) * 100)}%
                          </span>
                        </div>
                        
                        <div className="progress progress-enhanced mb-4">
                          <div
                            className="progress-bar progress-bar-enhanced"
                            style={{ width: `${Math.min((pledge.paid / pledge.total) * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="row g-3">
                          <div className="col-4">
                            <div className="mobile-stats">
                              <div className="small text-muted mb-1 fw-600">Kilicholipwa</div>
                              <div className="fw-bold amount-paid" style={{ fontSize: '0.9rem' }}>
                                TZS {(pledge.paid / 1000000).toFixed(1)}M
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="mobile-stats">
                              <div className="small text-muted mb-1 fw-600">Lengo</div>
                              <div className="fw-bold amount-display" style={{ fontSize: '0.9rem' }}>
                                TZS {(pledge.total / 1000000).toFixed(1)}M
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="mobile-stats">
                              <div className="small text-muted mb-1 fw-600">Imebaki</div>
                              <div className="fw-bold amount-remaining" style={{ fontSize: '0.9rem' }}>
                                TZS {((pledge.total - pledge.paid) / 1000000).toFixed(1)}M
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        style={{
          marginTop: '80px'
        }}
      />

      <style jsx global>{`
        .custom-toast {
          border-radius: 20px !important;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px) !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }
        
        .custom-toast-body {
          padding: 20px !important;
        }
        
        .Toastify__toast--info {
          background: rgba(255, 255, 255, 0.95) !important;
        }
        
        .table-responsive {
          border-radius: 0 0 25px 25px;
          overflow: hidden;
        }
        
        .dropdown-menu {
          animation: fadeInDown 0.3s ease-out;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;