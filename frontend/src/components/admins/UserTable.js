import React from 'react';

const UserTable = ({ data, tableName="" }) => {
  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        {/* Card Header */}
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-white">{tableName}</h5>
          <button className="btn btn-sm btn-light ">Ongeza mwanakwaya</button>
        </div>
        
        {/* Card Body */}
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Name (Jina)</th>
                  <th className="text-center">Marriage (Ndoa)</th>
                  <th className="text-center">Occupation (Kazi)</th>
                  <th className="text-center">Phone (Simu)</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={index}>
                    {/* User Name and Details */}
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={user.profilePicture || 'https://via.placeholder.com/50'}
                          alt={user.name}
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">{user.jumuiya}</small>
                        </div>
                      </div>
                    </td>

                    {/* Marital Status */}
                    <td className="text-center">
                      <span className="badge bg-info text-white">{user.maritalStatus}</span>
                    </td>

                    {/* Occupation */}
                    <td className="text-center">{user.occupation}</td>

                    {/* Phone Number */}
                    <td className="text-center">{user.phone}</td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary" title="View">
                          <i className="far fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info" title="Edit">
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete">
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav className="mt-4">
            <ul className="pagination justify-content-center mb-0">
              <li className="page-item disabled">
                <span className="page-link">nyuma</span>
              </li>
              <li className="page-item active">
                <span className="page-link">1</span>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Mbele
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
