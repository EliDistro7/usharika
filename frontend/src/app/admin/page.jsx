'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentModal from '../../components/admin/PaymentModal';
import {formatRoleName} from "../../actions/utils"
import { Dropdown } from 'react-bootstrap';
import {handleDownloadPDF} from "@/actions/pdf"
import { Search, Filter, Download, Users, TrendingUp, DollarSign, AlertCircle, Plus } from 'lucide-react';

import UserTableRows from '../../components/admin/UserTableRows';
import Notification from '../../components/admin/Notification';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('washarika');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/allMembers`,
          {
            adminId: process.env.NEXT_PUBLIC_KIONGOZI,
          },
          {
            params: { page: 1, limit: 50 },
          }
        );
        const { users, categories } = response.data;
        setUsers(users);
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Sort users based on the selected pledge type
  const filteredUsers =
      activeTab === 'washarika'
        ? users
        : users.filter((user) => user.selectedRoles.includes(activeTab));

  const sortedUsers = () => {
    let userList = filteredUsers;

    if (sortBy === 'ahadi') {
      userList = [...filteredUsers].sort(
        (a, b) => (b.pledges.ahadi || 0) - (a.pledges.ahadi || 0)
      );
    } else if (sortBy === 'jengo') {
      userList = [...filteredUsers].sort(
        (a, b) => (b.pledges.jengo || 0) - (a.pledges.jengo || 0)
      );
    } else if (sortBy && filteredUsers[0]?.pledges?.other?.[sortBy]) {
      userList = [...filteredUsers].sort(
        (a, b) =>
          (b.pledges.other[sortBy]?.total || 0) -
          (a.pledges.other[sortBy]?.total || 0)
      );
    }

    // Apply search query filter
    if (searchQuery) {
      userList = userList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return userList;
  };

  // Calculate totals for the selected pledge type
  const calculatePledgeTotals = (user, pledgeType) => {
    let pledgeAmount = 0;
    let paidAmount = 0;

    if (pledgeType === 'ahadi' || pledgeType === 'jengo') {
      pledgeAmount = user.pledges[pledgeType] || 0;
      paidAmount =
        user.pledges[
          `paid${pledgeType.charAt(0).toUpperCase() + pledgeType.slice(1)}`
        ] || 0;
    } 
    else if (user.pledges.other?.[pledgeType]) {
      pledgeAmount = user.pledges.other[pledgeType]?.total || 0;
      paidAmount = user.pledges.other[pledgeType]?.paid || 0;
    }

    const remainingAmount = pledgeAmount - paidAmount;

    return {
      totalPledged: pledgeAmount,
      totalPaid: paidAmount,
      totalRemaining: remainingAmount,
    };
  };

  const calculateOverallTotals = (users, pledgeType) => {
    if (!pledgeType || pledgeType === 'washarika') return null;
  
    return users.reduce(
      (totals, user) => {
        if (pledgeType === 'ahadi' || pledgeType === 'jengo') {
          const pledgeAmount = user.pledges[pledgeType] || 0;
          const paidAmount =
            user.pledges[
              `paid${pledgeType.charAt(0).toUpperCase() + pledgeType.slice(1)}`
            ] || 0;
  
          totals.totalPledged += pledgeAmount;
          totals.totalPaid += paidAmount;
          totals.totalRemaining += pledgeAmount - paidAmount;
        } else if (user.pledges.other?.[pledgeType]) {
          const pledgeAmount = user.pledges.other[pledgeType]?.total || 0;
          const paidAmount = user.pledges.other[pledgeType]?.paid || 0;
  
          totals.totalPledged += pledgeAmount;
          totals.totalPaid += paidAmount;
          totals.totalRemaining += pledgeAmount - paidAmount;
        }
  
        return totals;
      },
      { totalPledged: 0, totalPaid: 0, totalRemaining: 0 }
    );
  };

  const currentTotals =
    sortBy !== 'none' ? calculateOverallTotals(sortedUsers(), sortBy) : null;

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handlePaymentSubmit = async ({ pledgeType, amount }) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/addPayment`, {
        username: selectedUser.name,
        pledgeType,
        amount,
      });
      toast.success('Umefanikiwa kuingiza malipo!', { 
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Haikufanikiwa. Tafadhali jaribu tena.', {
        position: 'top-center',
      });
    }
  };

  const handleModalClose = () => {
    setSelectedUser(null);
  };

  const customStyles = {
    container: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    headerCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
      border: 'none'
    },
    controlsCard: {
      background: 'rgba(255, 255, 255, 0.95)',

      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)'
    },
    summaryCard: {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)'
    },
    tableCard: {
      background: 'rgba(255, 255, 255, 0.95)',

      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
      overflow: 'hidden'
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      transition: 'all 0.3s ease'
    },
    searchInput: {
      borderRadius: '12px',
      border: '2px solid rgba(102, 126, 234, 0.2)',
      background: 'rgba(255, 255, 255, 0.9)',
      transition: 'all 0.3s ease'
    },
    select: {
      borderRadius: '12px',
      border: '2px solid rgba(102, 126, 234, 0.2)',
      background: 'rgba(255, 255, 255, 0.9)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={customStyles.container} className="min-vh-100 py-4">
      <div className="container">
        {/* Enhanced Header */}
        <div className="card mb-4" style={customStyles.headerCard}>
          <div className="card-body text-center py-5">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <Users size={48} className="text-white me-3" />
              <h1 className="text-white fw-bold mb-0 display-4">Usharika</h1>
            </div>
            <p className="text-white-50 mb-0 fs-5">Mfumo wa Usimamizi wa Washarika</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-purple" role="status" style={{color: '#667eea'}}>
              <span className="visually-hidden">Inapakia...</span>
            </div>
            <p className="mt-3 text-muted fs-5">Inapakia washarika...</p>
          </div>
        )}

        {/* Enhanced Controls Section */}
        <div className="card mb-4" style={customStyles.controlsCard}>
          <div className="card-body p-4">
            <div className="row align-items-center g-3">
              {/* Left side - Filters and controls */}
              <div className="col-lg-8">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {/* Category Filter */}
                  <Dropdown>
                    <Dropdown.Toggle 
                      style={customStyles.button} 
                      className="d-flex align-items-center px-4 py-2"
                    >
                      <Filter size={18} className="me-2" />
                      Chuja
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow-lg border-0" style={{borderRadius: '12px'}}>
                      <Dropdown.Item 
                        onClick={() => setActiveTab('all')} 
                        active={activeTab === 'all'}
                        className="py-2"
                      >
                        <Users size={16} className="me-2" />
                        Washarika ({users.length})
                      </Dropdown.Item>
                      {categories.map((category) => (
                        <Dropdown.Item
                          key={category._id}
                          onClick={() => setActiveTab(category._id)}
                          active={activeTab === category._id}
                          className="py-2"
                        >
                          {formatRoleName(category._id.toUpperCase())} ({category.count})
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Sort Select */}
                  <select
                    className="form-select px-3 py-2"
                    style={customStyles.select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="ahadi">Ahadi</option>
                    <option value="jengo">Jengo</option>
                    {users[0]?.pledges?.other &&
                      Object.entries(users[0].pledges.other).map(([key]) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                  </select>

                  {/* Download Button */}
                  <button 
                    className="btn px-4 py-2 d-flex align-items-center" 
                    style={customStyles.button}
                    onClick={handleDownloadPDF}
                  >
                    <Download size={18} className="me-2" />
                    Pakua
                  </button>
                </div>
              </div>

              {/* Right side - Search and Notification */}
              <div className="col-lg-4" style={{ position: 'relative', zIndex: 1000 }}>
                <div className="d-flex gap-3 align-items-center justify-content-lg-end">
                  {/* Search Input */}
                  <div className="input-group">
                    <span 
                      className="input-group-text border-0" 
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px 0 0 12px'
                      }}
                    >
                      <Search size={18} className="text-white" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 px-3 py-2"
                      style={{
                        ...customStyles.searchInput,
                        borderRadius: '0 12px 12px 0'
                      }}
                      placeholder="Tafuta jina..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                  </div>
                  
                  <Notification />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Totals Summary */}
        {!isLoading && currentTotals && (
          <div className=" mb-4" style={customStyles.summaryCard}>
            <div className=" p-4">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-uppercase mb-2" style={{color: '#667eea'}}>
                  <TrendingUp size={28} className="me-2" />
                  {sortBy}
                </h3>
              </div>
              
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center p-3">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <DollarSign size={24} style={{color: '#28a745'}} />
                    </div>
                    <h5 className="text-muted mb-1">Kiasi kilichoahidiwa</h5>
                    <h2 className="fw-bold mb-0" style={{color: '#28a745'}}>
                      {currentTotals.totalPledged.toLocaleString()}
                    </h2>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="text-center p-3">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <DollarSign size={24} style={{color: '#667eea'}} />
                    </div>
                    <h5 className="text-muted mb-1">Kiasi kilicholipwa</h5>
                    <h2 className="fw-bold mb-0" style={{color: '#667eea'}}>
                      {currentTotals.totalPaid.toLocaleString()}
                    </h2>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="text-center p-3">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <AlertCircle size={24} style={{color: '#dc3545'}} />
                    </div>
                    <h5 className="text-muted mb-1">Kiasi kilichobaki</h5>
                    <h2 className="fw-bold mb-0" style={{color: '#dc3545'}}>
                      {currentTotals.totalRemaining.toLocaleString()}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Users Table */}
     

        {/* Enhanced Users Table */}
{!isLoading && (
  <>
    {/* Check if there are no users and show message above table */}
    {sortedUsers().length === 0 ? (
      <div style={customStyles.tableCard}>
        <div className="p-5">
          <div 
            style={{
              background: "linear-gradient(135deg, #f8f6ff 0%, #f0f9ff 100%)",
              borderRadius: "16px",
              padding: "48px 32px",
              border: "2px dashed rgba(139, 69, 193, 0.2)",
              textAlign: "center"
            }}
          >
            <div className="d-flex flex-column align-items-center">
              <div 
                style={{
                  background: "linear-gradient(135deg, rgba(139, 69, 193, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%)",
                  borderRadius: "50%",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <Users size={64} style={{ color: "#8b45c1" }} />
              </div>
              <h3 style={{ color: "#8b45c1", fontWeight: "600", marginBottom: "12px" }}>
                Hakuna Washarika
              </h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem", maxWidth: "400px" }}>
                Hakuna washarika walioorodheshwa bado. Washarika wataonekana hapa baada ya kujiunga.
              </p>
              {/* Optional: Add action button */}
              <button 
                className="btn mt-3 px-4 py-2"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "500"
                }}
                onClick={() => {
                  // Add your action here, e.g., navigate to add user page
                  console.log("Add user clicked");
                }}
              >
                <Plus size={18} className="me-2" />
                Ongeza Msharika
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      /* Show table only when there are users */
      <div >
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <tr>
                <th className="text-white border-0 py-3">
                  <Users size={18} className="me-2" />
                  Profile
                </th>
                <th className="text-white border-0 py-3">Jina</th>
                {sortBy === "none" ? (
                  <>
                    <th className="text-white border-0 py-3 d-none d-md-table-cell">Simu</th>
                    <th className="text-white border-0 py-3 d-none d-sm-table-cell">Jinsia</th>
                    <th className="text-white border-0 py-3 d-none d-lg-table-cell">Jumuiya</th>
                    <th className="text-white border-0 py-3">Kazi</th>
                  </>
                ) : (
                  <>
                    <th className="text-white border-0 py-3">{sortBy}</th>
                    <th className="text-white border-0 py-3">Alicholipa</th>
                    <th className="text-white border-0 py-3">Kilichobaki</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              <UserTableRows
                users={sortedUsers()}
                sortBy={sortBy}
                calculatePledgeTotals={calculatePledgeTotals}
                handleUserClick={handleUserClick}
              />
            </tbody>
          </table>
        </div>
      </div>
    )}
  </>
)}

        {/* Payment Modal */}
        {selectedUser && (
          <PaymentModal
            selectedUser={selectedUser}
            onClose={handleModalClose}
            onSubmit={handlePaymentSubmit}
          />
        )}

        {/* Toast Notifications */}
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;