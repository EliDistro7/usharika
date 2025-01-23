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
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('none'); // Sorting criteria

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

  const filteredUsers =
    activeTab === 'washarika'
      ? users
      : users.filter((user) => user.selectedRoles.includes(activeTab));

// Sort users based on the selected pledge type
const sortedUsers = () => {
  if (sortBy === 'ahadi') {
    return [...filteredUsers].sort(
      (a, b) => (b.pledges.ahadi || 0) - (a.pledges.ahadi || 0)
    );
  } else if (sortBy === 'jengo') {
    return [...filteredUsers].sort(
      (a, b) => (b.pledges.jengo || 0) - (a.pledges.jengo || 0)
    );
  } else if (sortBy && filteredUsers[0]?.pledges?.other?.[sortBy]) {
    // Handle dynamic 'other' fields
    return [...filteredUsers].sort(
      (a, b) =>
        (b.pledges.other[sortBy]?.total || 0) -
        (a.pledges.other[sortBy]?.total || 0)
    );
  } else {
    return filteredUsers;
  }
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
    if (!pledgeType || pledgeType === 'none') return null;
  
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
      <h2 className="mb-4 text-center">Yombo Dashboard</h2>
  
      {/* Loading Indicator */}
      {isLoading && <p className="text-center">Loading members...</p>}
       {/* Notification Section - Integrated Notification Component */}
       <Notification />
  
      {/* Display Overall Totals */}
      {!isLoading && currentTotals && (
        <div className="alert alert-primary text-center p-4 rounded-3 shadow-sm">
          <h3 className="fw-bold mb-3 text-uppercase">
            Muhtasari: {sortBy === 'ahadi' ? 'Ahadi' : 'Jengo'}
          </h3>
          <div className="d-flex flex-column gap-2">
            <p className="mb-1">
              <span className="fw-bold">Jumla ya Kiasi kilichoahidiwa:</span>{' '}
              <span className="fs-5 text-success fw-bolder">
                {currentTotals.totalPledged}
              </span>
            </p>
            <p className="mb-1">
              <span className="fw-bold">Kiasi kilicholipwa:</span>{' '}
              <span className="fs-5 text-primary fw-bolder">
                {currentTotals.totalPaid}
              </span>
            </p>
            <p>
              <span className="fw-bold">Kiasi kilichobaki:</span>{' '}
              <span className="fs-5 text-danger fw-bolder">
                {currentTotals.totalRemaining}
              </span>
            </p>
          </div>
        </div>
      )}

     
    
{/* Tabs Navigation */}
{/* Dropdown for Tab Names */}
{!isLoading && (
        <Dropdown className="mb-3">
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {activeTab || 'Select Category'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setActiveTab('zote')}
              active={activeTab === 'zote'}
            >
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
      )}


    {/* Sorting Dropdown */}
{/* Sorting Dropdown */}
<div className="mb-3">
  <select
    className="form-select"
    value={sortBy}
    onChange={(e) =>{
      console.log('value of sortBy changed', e.target.value)
      setSortBy(e.target.value)}}
  >
    {/* Default options */}
    <option value="none">Washarika</option>
    <option value="ahadi">Ahadi</option>
    <option value="jengo">Jengo</option>

    {/* Dynamic options from `other` field */}
    {users[0]?.pledges?.other &&
      Object.entries(users[0].pledges.other).map(([key]) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
  </select>
</div>




      <button className="btn btn-success mb-3" onClick={handleDownloadPDF}>
        Download PDF
      </button>
  
      {/* Users Table */}
      {!isLoading && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Profile</th>
                <th>Jina</th>
                {sortBy === 'none' ? (
                  <>
                    <th>Simu</th>
                    <th>Jinsia</th>
                    <th>Jumuiya</th>
                    <th>Kazi</th>
                  </>
                ) : (
                  <>
                    <th>{sortBy === 'ahadi' ? 'Ahadi' : 'Jengo'}</th>
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
        </div>
      )}
  
      {/* Payment Modal */}
      {selectedUser && (
        <PaymentModal
          selectedUser={selectedUser}
          onClose={handleModalClose}
          onSubmit={handlePaymentSubmit}
        />
      )}
  
      {/* Toast notifications */}
      <ToastContainer />
      
     
    </div>
  );
};

export default AdminDashboard;
