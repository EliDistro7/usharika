import React, { useState, useEffect } from 'react';
import { formatRoleName } from '@/actions/utils';
import { getDefaultRoles } from '@/actions/users';
import { addRegisterNotification } from '@/actions/admin';
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS


const UserCard = ({ user }) => {
  const [newRole, setNewRole] = useState("");
  
  const [availableRoles, setAvailableRoles] = useState([]);

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

     useEffect( ()=>{
        const getDefaultUserRoles = async ()=>{
          try {
            const defaultRoles = await getDefaultRoles();
            
            //setUserRoles(defaultRoles);
            //console.log('userRoles', userRoles)
            let av=defaultRoles.filter((role) => !user.selectedRoles.includes(role));
            //console.log('available roles:', av)
            setAvailableRoles(av);
            } catch(error){
              console.log(error)
            }
        }
        getDefaultUserRoles();
       
      }, [])



  const handleAddRole = async () => {
    try{
      if (newRole && !user.selectedRoles.includes(newRole)) {
    
        addRegisterNotification({selectedRole: newRole, 
          userId:user._id, 
          type: "kujiungaKikundi",
          name: user.name
        });
         toast.success(`Umefanikiwa kutuma maombi ya kujiunga na ${formatRoleName(newRole)}. Utapokea uthibitisho hivi punde`); // Success toast
        setNewRole("");
      }
    } catch(err){
      toast.error(`Haikufanikiwa kutuma maombi ya kujiunga na ${newRole}`); // Error toast
    }

  };

  return (
    <div className="card shadow-sm mb-4 mx-auto" style={{ maxWidth: '600px' }}>
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Container */}
      <div className="card-header text-center ">
        <h2 className="card-title ">{user.name}</h2>
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
          <li className="list-group-item">
            <strong>Simu:</strong> {user.phone}
          </li>
          <li className="list-group-item">
            <strong>Kazi:</strong> {user.occupation}
          </li>
          <li className="list-group-item">
            <strong>Jinsia:</strong> {user.gender}
          </li>
          <li className="list-group-item">
            <strong>Jumuiya:</strong> {user.jumuiya}
          </li>
          <li className="list-group-item">
            <strong>Ndoa:</strong> {user.maritalStatus}
          </li>
        </ul>
        <div className="table-responsive">
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
                <td className="text-end">
                  TZS {(pledge.total - pledge.paid).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="mt-4">
          <h5>Vikundi ninavyoshiriki:</h5>
          <ul>
            {user.selectedRoles && user.selectedRoles.length > 0 ? (
              user.selectedRoles.map((role, index) => (
                <li key={index}>{formatRoleName(role)}</li>
              ))
            ) : (
              <p>Hakuna vikundi vilivyochaguliwa.</p>
            )}
          </ul>
          <div className="mt-3">
            <h6>Ongeza Vikundi:</h6>
            <div className="d-flex">
              <select
                className="form-select me-2"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="">Chagua Kundi</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {formatRoleName(role)}
                  </option>
                ))}
              </select>
              <button className="btn btn-success" onClick={handleAddRole}>
                Ongeza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
