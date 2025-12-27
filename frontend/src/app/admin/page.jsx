'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentModal from '../../components/admin/PaymentModal';
import {formatRoleName} from "../../actions/utils"
import {handleDownloadPDF} from "@/actions/pdf"
import { Search, Filter, Download, Users, TrendingUp, DollarSign, AlertCircle, Plus, ChevronDown } from 'lucide-react';

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
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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
        className: 'bg-primary-gradient text-white'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 via-white to-primary-50 py-6">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="bg-primary-gradient rounded-3xl shadow-primary-lg mb-6 overflow-hidden">
          <div className="text-center py-12 px-4">
            <div className="flex justify-center items-center mb-4">
              <Users size={48} className="text-white mr-4" />
              <h1 className="text-white font-bold text-5xl mb-0">Usharika</h1>
            </div>
            <p className="text-white/75 text-xl mb-0">Mfumo wa Usimamizi wa Washarika</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-text-secondary text-lg">Inapakia washarika...</p>
          </div>
        )}

        {/* Enhanced Controls Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-primary-100 shadow-soft mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left side - Filters and controls */}
              <div className="lg:col-span-8">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Category Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center px-5 py-2.5 bg-primary-gradient text-white rounded-xl shadow-primary hover:shadow-primary-lg transition-all duration-300 font-medium"
                    >
                      <Filter size={18} className="mr-2" />
                      Chuja
                      <ChevronDown size={16} className="ml-2" />
                    </button>
                    
                    {showFilterDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-primary-lg border border-primary-200 py-2 z-50">
                        <button
                          onClick={() => {
                            setActiveTab('all');
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-left hover:bg-primary-50 transition-colors ${
                            activeTab === 'all' ? 'bg-primary-100 text-primary-700' : 'text-text-primary'
                          }`}
                        >
                          <Users size={16} className="mr-3" />
                          Washarika ({users.length})
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => {
                              setActiveTab(category._id);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full flex items-center px-4 py-2.5 text-left hover:bg-primary-50 transition-colors ${
                              activeTab === category._id ? 'bg-primary-100 text-primary-700' : 'text-text-primary'
                            }`}
                          >
                            {formatRoleName(category._id.toUpperCase())} ({category.count})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort Select */}
                  <select
                    className="px-4 py-2.5 bg-white border-2 border-primary-200 rounded-xl text-text-primary focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all"
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
                    className="flex items-center px-5 py-2.5 bg-primary-gradient text-white rounded-xl shadow-primary hover:shadow-primary-lg transition-all duration-300 font-medium"
                    onClick={handleDownloadPDF}
                  >
                    <Download size={18} className="mr-2" />
                    Pakua
                  </button>
                </div>
              </div>

              {/* Right side - Search and Notification */}
              <div className="lg:col-span-4 relative z-[1000]">
                <div className="flex gap-3 items-center justify-end">
                  {/* Search Input */}
                  <div className="flex items-center flex-1 max-w-sm">
                    <div className="flex items-center justify-center bg-primary-gradient px-3 py-2.5 rounded-l-xl">
                      <Search size={18} className="text-white" />
                    </div>
                    <input
                      type="text"
                      className="flex-1 px-4 py-2.5 bg-white border-2 border-l-0 border-primary-200 rounded-r-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all text-text-primary placeholder-text-tertiary"
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
          <div className="bg-gradient-to-br from-primary-50/50 to-lavender-50/50 rounded-2xl border border-primary-200 shadow-soft mb-6">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="flex items-center justify-center font-bold text-2xl text-primary-700 uppercase mb-2">
                  <TrendingUp size={28} className="mr-2" />
                  {sortBy}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/60 rounded-xl border border-success-200">
                  <div className="flex justify-center items-center mb-2">
                    <DollarSign size={24} className="text-success-600" />
                  </div>
                  <h5 className="text-text-tertiary mb-2 text-sm font-medium">Kiasi kilichoahidiwa</h5>
                  <h2 className="font-bold text-3xl text-success-600 mb-0">
                    {currentTotals.totalPledged.toLocaleString()}
                  </h2>
                </div>
                
                <div className="text-center p-4 bg-white/60 rounded-xl border border-primary-200">
                  <div className="flex justify-center items-center mb-2">
                    <DollarSign size={24} className="text-primary-600" />
                  </div>
                  <h5 className="text-text-tertiary mb-2 text-sm font-medium">Kiasi kilicholipwa</h5>
                  <h2 className="font-bold text-3xl text-primary-600 mb-0">
                    {currentTotals.totalPaid.toLocaleString()}
                  </h2>
                </div>
                
                <div className="text-center p-4 bg-white/60 rounded-xl border border-error-200">
                  <div className="flex justify-center items-center mb-2">
                    <AlertCircle size={24} className="text-error-600" />
                  </div>
                  <h5 className="text-text-tertiary mb-2 text-sm font-medium">Kiasi kilichobaki</h5>
                  <h2 className="font-bold text-3xl text-error-600 mb-0">
                    {currentTotals.totalRemaining.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Users Table */}
        {!isLoading && (
          <>
            {sortedUsers().length === 0 ? (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-soft border border-primary-100">
                <div className="p-12">
                  <div className="bg-gradient-to-br from-primary-50 to-peaceful-50 rounded-2xl p-12 border-2 border-dashed border-primary-200 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-primary-100/50 to-lavender-100/50 rounded-full p-6 mb-6">
                        <Users size={64} className="text-primary-600" />
                      </div>
                      <h3 className="text-primary-700 font-semibold text-2xl mb-3">
                        Hakuna Washarika
                      </h3>
                      <p className="text-text-secondary text-lg max-w-md mb-6">
                        Hakuna washarika walioorodheshwa bado. Washarika wataonekana hapa baada ya kujiunga.
                      </p>
                      <button 
                        className="flex items-center px-6 py-3 bg-primary-gradient text-white rounded-xl shadow-primary hover:shadow-primary-lg transition-all duration-300 font-semibold"
                        onClick={() => {
                          console.log("Add user clicked");
                        }}
                      >
                        <Plus size={18} className="mr-2" />
                        Ongeza Msharika
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" backdrop-blur-md rounded-2xl shadow-soft border border-primary-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-gradient">
                      <tr>
                        <th className="text-white border-0 py-4 px-4 text-left font-semibold">
                          <div className="flex items-center">
                            <Users size={18} className="mr-2" />
                            Profile
                          </div>
                        </th>
                        <th className="text-white border-0 py-4 px-4 text-left font-semibold">Jina</th>
                        {sortBy === "none" ? (
                          <>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold hidden md:table-cell">Simu</th>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold hidden sm:table-cell">Jinsia</th>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold hidden lg:table-cell">Jumuiya</th>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold">Kazi</th>
                          </>
                        ) : (
                          <>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold">{sortBy}</th>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold">Alicholipa</th>
                            <th className="text-white border-0 py-4 px-4 text-left font-semibold">Kilichobaki</th>
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
          className="mt-20"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;