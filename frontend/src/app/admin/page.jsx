'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentModal from '../../components/admin/PaymentModal';
import {formatRoleName} from "../../actions/utils"
import { Dropdown } from 'react-bootstrap';
import {handleDownloadPDF} from "@/actions/pdf"

import UserTableRows from '../../components/admin/UserTableRows';
import Notification from '../../components/admin/Notification';  // Import Notification component

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('washarika');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('none'); // Sorting criteria
  const [searchQuery, setSearchQuery] = useState(''); // New state for search input

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
            params: { page: 1, limit: 50 }, // Adjust pagination as needed
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

  // Check if the pledgeType is from the default fields
  if (pledgeType === 'ahadi' || pledgeType === 'jengo') {
    pledgeAmount = user.pledges[pledgeType] || 0;
    paidAmount =
      user.pledges[
        `paid${pledgeType.charAt(0).toUpperCase() + pledgeType.slice(1)}`
      ] || 0;
  } 
  // Check if the pledgeType is in the `other` field
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
        // Check if pledgeType exists in default fields or 'other'
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
          // Handle dynamic pledges in 'other'
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
  

  // Calculate totals for the current sorting
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
      toast.success('Umefanikiwa kuingiza malipo!', { position: 'top-center' });
      setSelectedUser(null); // Reset selected user
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Haikufanikiwa. Tafadhali jaribu tena.', {
        position: 'top-center',
      });
    }
  };

  const handleModalClose = () => {
    setSelectedUser(null); // Close modal by clearing selected user
  };

  

  return (
    <div className="container mt-5">
      {/* Page Header */}
      <header className="text-center mb-4">
        <h2 className="fw-bold">Usharika</h2>
      </header>
  
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-3">
          <p className="text-muted">Inapakia washarika...</p>
        </div>
      )}
  
      {/* Notification, Search, Sort & Download */}
      <section className="d-flex justify-content-between align-items-center mb-4">
       
     
        <div className="d-flex gap-3">
          <Dropdown>
            <Dropdown.Toggle variant="primary" size="sm">
              <i className="fas fa-filter"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setActiveTab('all')} active={activeTab === 'all'}>
                Washarika ({users.length})
              </Dropdown.Item>
              {categories.map((category) => (
                <Dropdown.Item
                  key={category._id}
                  onClick={() => setActiveTab(category._id)}
                  active={activeTab === category._id}
                >
                  {formatRoleName(category._id.toUpperCase())} ({category.count})
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <select
            id="sortBy"
            className="form-select form-select-sm shadow-sm"
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
          <button className="btn btn-success btn-sm" onClick={handleDownloadPDF}>
            <i className="fas fa-download"></i>
          </button>
        
        
          <div className="input-group w-auto">
          <span className="input-group-text bg-primary text-white">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Ingiza jina..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        </div>


         <Notification />
      </section>
  
      {/* Totals Summary */}
      {!isLoading && currentTotals && (
        <section className="alert alert-primary text-center shadow-sm mb-4">
          <h4 className="fw-bold text-uppercase"> {sortBy}</h4>
          <div className="d-flex justify-content-around">
            <p>
              <strong>Kiasi kilichoahidiwa:</strong>{' '}
              <span className="fs-5 text-success fw-bolder">{currentTotals.totalPledged}</span>
            </p>
            <p>
              <strong>Kiasi kilicholipwa:</strong>{' '}
              <span className="fs-5 text-primary fw-bolder">{currentTotals.totalPaid}</span>
            </p>
            <p>
              <strong>Kiasi kilichobaki:</strong>{' '}
              <span className="fs-5 text-danger fw-bolder">{currentTotals.totalRemaining}</span>
            </p>
          </div>
        </section>
      )}
  
   {/* Users Table */}
{!isLoading && (
  <section className="table-responsive shadow-sm">
    <table className="table table-striped table-bordered">
      <thead className="table-dark">
        <tr>
          <th>
            <i className="fas fa-user me-2"></i>Profile
          </th>
          <th>Jina</th>
          {sortBy === "none" ? (
            <>
              <th className="d-none d-md-table-cell">Simu</th>
              <th className="d-none d-sm-table-cell">Jinsia</th>
              <th className="d-none d-lg-table-cell">Jumuiya</th>
              <th>Kazi</th>
            </>
          ) : (
            <>
              <th>{sortBy}</th>
              <th>Alicholipa</th>
              <th>Kilichobaki</th>
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
  </section>
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
      <ToastContainer />
    </div>
  );
  
  
  
};

export default AdminDashboard;
