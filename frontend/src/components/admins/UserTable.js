import { getLoggedInUserId } from '@/hooks/useUser';
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const UserTable = ({ data, tableName = "" }) => {
  return (
    <div>
     {/* Navbar */}
<Navbar style={{backgroundColor:"#6f42c1"}} variant="dark" expand="lg">
  <Container>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
   
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto text-white">
        <Nav.Link href={`/akaunti/${getLoggedInUserId()}`}>Home</Nav.Link>
        <Nav.Link href={`/admins/matangazo/${getLoggedInUserId()}`}>Matangazo</Nav.Link>
        <Nav.Link href={`/admins/donations/${getLoggedInUserId()}`}>Michango</Nav.Link>
        <Nav.Link href={`/admins/attendance/${getLoggedInUserId()}`}>Mahudhurio</Nav.Link>
        <Nav.Link href={`/admins/top-members/${getLoggedInUserId()}`}>top members</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


      {/* Main Content */}
      <div className="container py-4">
        <div className="card shadow-sm border-0">
          {/* Card Header */}
          <div className="card-header text-white d-flex justify-content-between align-items-center" style={{backgroundColor:"#6f42c1"}}>
            <h5 className="mb-0 text-white">{tableName}</h5>
          </div>

          {/* Card Body */}
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="">
                  <tr>
                    <th>Name (Jina)</th>
                    <th className="text-center">Marriage (Ndoa)</th>
                    <th className="text-center">Occupation (Kazi)</th>
                    <th className="text-center">Phone (Simu)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, index) => (
                    <tr key={index}>
                      {/* User Name and Details */}
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={user.profilePicture || "https://via.placeholder.com/50"}
                            alt={user.name}
                            className="rounded-circle me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
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
    </div>
  );
};

export default UserTable;
