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
    <div className="card shadow-sm mb-4 mx-auto" style={{ maxWidth: '600px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-header text-center">
        <h2 className="card-title">{user.name}</h2>
        <p className="mb-0">{user.role}</p>
      </div>
      <div className="card-body">
        <div className="text-center mb-3">
          <img
            src={user.profilePicture}
            alt={`${user.name}'s profile`}
            className="rounded-circle img-thumbnail"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Simu:</strong> {user.phone}</li>
          <li className="list-group-item"><strong>Kazi:</strong> {user.occupation}</li>
          <li className="list-group-item"><strong>Jinsia:</strong> {user.gender}</li>
          <li className="list-group-item"><strong>Jumuiya:</strong> {user.jumuiya}</li>
          <li className="list-group-item"><strong>Ndoa:</strong> {user.maritalStatus}</li>
        </ul>
        <div className="table-responsive my-3">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th className="fw-bold">Aina</th>
                <th className="fw-bold text-end d-none d-lg-table-cell">Kilicholipwa</th>
                <th className="fw-bold text-end d-none d-lg-table-cell">Iliyoahidiwa</th>
                <th className="fw-bold text-center d-none d-md-table-cell">Maendeleo</th>
                <th className="fw-bold text-end">Iliyobaki</th>
              </tr>
            </thead>
            <tbody>
              {pledges.map((pledge, index) => (
                <tr key={index}>
                  <td>{pledge.title}</td>
                  <td className="text-end d-none d-lg-table-cell">TZS {pledge.paid.toLocaleString()}</td>
                  <td className="text-end d-none d-lg-table-cell">TZS {pledge.total.toLocaleString()}</td>
                  <td className="text-center d-none d-md-table-cell">
                    <div className="progress" style={{ height: "20px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${(pledge.paid / pledge.total) * 100}%` }}
                        aria-valuenow={(pledge.paid / pledge.total) * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {Math.round((pledge.paid / pledge.total) * 100)}%
                      </div>
                    </div>
                  </td>
                  <td className="text-end">TZS {(pledge.total - pledge.paid).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h5>Vikundi ninavyoshiriki:</h5>
          <ul>
            {updatedSelectedRoles && updatedSelectedRoles.length > 0 ? (
              updatedSelectedRoles.map((role, index) => (
                <li key={index}>{formatRoleName(role)}</li>
              ))
            ) : (
              <p>Hakuna vikundi vilivyochaguliwa.</p>
            )}
          </ul>
          
          {/* Display leadership positions if the user is a leader */}
          {user.isLeader && user.leadershipPositions && Object.keys(user.leadershipPositions).length > 0 && (
            <div className="mt-4">
              <h6 className="mb-3">Nafasi za Uongozi kwenye vikundi</h6>
              <div className="table-responsive">
                <table className="table table-bordered" style={{ backgroundColor: "#E6E6FA" }}>
                  <thead>
                    <tr>
                      <th className="text-center">Kikundi</th>
                      <th className="text-center">Nafasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(user.leadershipPositions).map(([groupKey, positions], index) => (
                      <tr key={index}>
                        <td className="text-center fw-bold">{formatRoleName(groupKey.replace("kiongozi_", ""))}</td>
                        <td className="text-center">
                          {positions.length > 0 ? positions.join(", ") : <span className="text-danger">Hakuna Nafasi</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Role selection component */}
          <div className="mt-3">
            <RoleSelector 
              userRoles={availableRoles}
              selectedRoles={updatedSelectedRoles}
              onRolesChange={handleRolesChange}
              handleAddRole={handleAddRole}
            />
          </div>

          {/* Save Changes button */}
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleSaveRoles}>
              Tuma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
