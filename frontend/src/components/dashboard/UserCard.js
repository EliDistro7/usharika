'use client';
import React, { useState, useEffect } from 'react';
import { formatRoleName } from '@/actions/utils';
import { getDefaultRoles } from '@/actions/users';
import { addRegisterNotification, updateUserRoles } from '@/actions/admin';
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import RoleSelector from './RoleSelector';

const UserCard = ({ user }) => {
  // Local state to track roles as updated by the user.
  const [updatedSelectedRoles, setUpdatedSelectedRoles] = useState(user.selectedRoles || []);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [defaultRolesData, setDefaultRolesData] = useState([]);

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

  useEffect(() => {
    const getDefaultUserRoles = async () => {
      try {
        const defaultData = await getDefaultRoles();
        // Save full default roles data for mapping if needed.
        setDefaultRolesData(defaultData);
        // Filter out roles already selected.
        const av = defaultData.filter((roleObj) => !updatedSelectedRoles.includes(roleObj.role));
        setAvailableRoles(av);
      } catch (error) {
        console.log(error);
      }
    };
    getDefaultUserRoles();
  }, [updatedSelectedRoles]);

  // Called when adding a role via notification.
  const handleAddRole = async (newRole) => {
    try {
      if (newRole && !updatedSelectedRoles.includes(newRole)) {
        await addRegisterNotification({
          selectedRole: newRole,
          userId: user._id,
          type: "kujiungaKikundi",
          name: user.name
        });
        toast.success(`Umefanikiwa kutuma maombi ya kujiunga na ${formatRoleName(newRole)}. Utapokea uthibitisho hivi punde`);
        // Update the local state with the newly added role.
        setUpdatedSelectedRoles(prev => [...prev, newRole]);
      }
    } catch (err) {
      toast.error(`Haikufanikiwa kutuma maombi ya kujiunga na ${newRole}`);
    }
  };

  // Callback to update roles from the RoleSelector component.
  const handleRolesChange = (newRoles) => {
    setUpdatedSelectedRoles(newRoles);
  };

  // Called when the "Save Role Changes" button is clicked.
  const handleSaveRoles = async () => {
    try {
      // If the user is a leader, retain the existing leadershipPositions.
      // Otherwise, pass an empty object.
      const leadershipPositions = user.isLeader ? user.leadershipPositions : {};
      const message = await updateUserRoles({
        userId: user._id,
        selectedRoles: updatedSelectedRoles,
        leadershipPositions,
      });
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating roles");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-medium mb-6 mx-auto max-w-2xl overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-primary-gradient text-white text-center py-6 px-6">
        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-primary-100 text-lg">{user.role}</p>
      </div>

      <div className="p-6">
        {/* Profile Picture */}
        <div className="text-center mb-6">
          <img
            src={user.profilePicture}
            alt={`${user.name}'s profile`}
            className="w-36 h-36 rounded-full border-4 border-primary-200 object-cover mx-auto shadow-primary"
          />
        </div>

        {/* User Details */}
        <div className="space-y-1 mb-6">
          <div className="flex justify-between py-3 px-4 bg-background-200 rounded-lg border border-border-light">
            <span className="font-semibold text-text-secondary">Simu:</span>
            <span className="text-text-primary">{user.phone}</span>
          </div>
          <div className="flex justify-between py-3 px-4 hover:bg-background-200 rounded-lg transition-colors duration-200">
            <span className="font-semibold text-text-secondary">Kazi:</span>
            <span className="text-text-primary">{user.occupation}</span>
          </div>
          <div className="flex justify-between py-3 px-4 bg-background-200 rounded-lg border border-border-light">
            <span className="font-semibold text-text-secondary">Jinsia:</span>
            <span className="text-text-primary">{user.gender}</span>
          </div>
          <div className="flex justify-between py-3 px-4 hover:bg-background-200 rounded-lg transition-colors duration-200">
            <span className="font-semibold text-text-secondary">Jumuiya:</span>
            <span className="text-text-primary">{user.jumuiya}</span>
          </div>
          <div className="flex justify-between py-3 px-4 bg-background-200 rounded-lg border border-border-light">
            <span className="font-semibold text-text-secondary">Ndoa:</span>
            <span className="text-text-primary">{user.maritalStatus}</span>
          </div>
        </div>

        {/* Pledges Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary-200">
                <th className="text-left py-3 px-2 font-bold text-text-primary">Aina</th>
                <th className="text-right py-3 px-2 font-bold text-text-primary hidden lg:table-cell">Kilicholipwa</th>
                <th className="text-right py-3 px-2 font-bold text-text-primary hidden lg:table-cell">Iliyoahidiwa</th>
                <th className="text-center py-3 px-2 font-bold text-text-primary hidden md:table-cell">Maendeleo</th>
                <th className="text-right py-3 px-2 font-bold text-text-primary">Iliyobaki</th>
              </tr>
            </thead>
            <tbody>
              {pledges.map((pledge, index) => (
                <tr key={index} className={`border-b border-border-light hover:bg-background-100 transition-colors duration-200 ${index % 2 === 0 ? 'bg-background-50' : 'bg-white'}`}>
                  <td className="py-3 px-2 font-medium text-text-primary">{pledge.title}</td>
                  <td className="text-right py-3 px-2 text-text-secondary hidden lg:table-cell">TZS {pledge.paid.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 text-text-secondary hidden lg:table-cell">TZS {pledge.total.toLocaleString()}</td>
                  <td className="text-center py-3 px-2 hidden md:table-cell">
                    <div className="w-full bg-background-300 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-success-500 rounded-full transition-all duration-300 flex items-center justify-center"
                        style={{ width: `${(pledge.paid / pledge.total) * 100}%` }}
                      >
                        <span className="text-xs font-semibold text-white">
                          {Math.round((pledge.paid / pledge.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 font-semibold text-warning-600">TZS {(pledge.total - pledge.paid).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          {/* Current Groups */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-text-primary mb-3">Vikundi ninavyoshiriki:</h5>
            {updatedSelectedRoles && updatedSelectedRoles.length > 0 ? (
              <ul className="space-y-2">
                {updatedSelectedRoles.map((role, index) => (
                  <li key={index} className="flex items-center py-2 px-3 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-text-primary">{formatRoleName(role)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-tertiary italic">Hakuna vikundi vilivyochaguliwa.</p>
            )}
          </div>
          
          {/* Leadership Positions */}
          {user.isLeader && user.leadershipPositions && Object.keys(user.leadershipPositions).length > 0 && (
            <div className="mb-6">
              <h6 className="text-lg font-semibold text-text-primary mb-3">Nafasi za Uongozi kwenye vikundi</h6>
              <div className="overflow-x-auto">
                <table className="w-full bg-purple-50 rounded-lg overflow-hidden border border-purple-200">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="text-center py-3 px-4 font-semibold text-purple-800">Kikundi</th>
                      <th className="text-center py-3 px-4 font-semibold text-purple-800">Nafasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(user.leadershipPositions).map(([groupKey, positions], index) => (
                      <tr key={index} className="border-t border-purple-200">
                        <td className="text-center py-3 px-4 font-semibold text-purple-700">
                          {formatRoleName(groupKey.replace("kiongozi_", ""))}
                        </td>
                        <td className="text-center py-3 px-4">
                          {positions.length > 0 ? (
                            <span className="text-purple-700">{positions.join(", ")}</span>
                          ) : (
                            <span className="text-error-500 font-medium">Hakuna Nafasi</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <RoleSelector 
              userRoles={availableRoles}
              selectedRoles={updatedSelectedRoles}
              onRolesChange={handleRolesChange}
              handleAddRole={handleAddRole}
            />
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-center">
            <button 
              className="btn-primary px-8 py-3 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-primary"
              onClick={handleSaveRoles}
            >
              Tuma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;