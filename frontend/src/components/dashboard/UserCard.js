import { formatRoleName } from '@/actions/utils';
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="card shadow-sm mb-4 mx-auto" style={{ maxWidth: '600px' }}>
      <div className="card-header text-center bg-primary text-white">
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
          <li className="list-group-item">
            <strong>Phone:</strong> {user.phone}
          </li>
          <li className="list-group-item">
            <strong>Occupation:</strong> {user.occupation}
          </li>
          <li className="list-group-item">
            <strong>Gender:</strong> {user.gender}
          </li>
          <li className="list-group-item">
            <strong>Jumuiya:</strong> {user.jumuiya}
          </li>
          <li className="list-group-item">
            <strong>Marital Status:</strong> {user.maritalStatus}
          </li>
        </ul>
        <div className="mt-4">
          <h5>Pledges:</h5>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ahadi</td>
                <td>{user.pledges.ahadi}</td>
                <td>{user.pledges.paidAhadi}</td>
              </tr>
              <tr>
                <td>Jengo</td>
                <td>{user.pledges.jengo}</td>
                <td>{user.pledges.paidJengo}</td>
              </tr>
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
        </div>
      </div>
    </div>
  );
};

export default UserCard;
