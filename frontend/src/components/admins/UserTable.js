import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomNavbar from "./CustomNavbar";
import Cookies from "js-cookie";
import { formatRoleName } from "@/actions/utils";
import UserModal from "./UserModal";

const UserTable = ({ data, tableName = "" }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const uniqueRoles = [
      ...new Set(data.flatMap((user) => user.selectedRoles || [])),
    ];
    setRoles(uniqueRoles);
  }, [data]);

  useEffect(() => {
    let updatedData = [...data];

    if (selectedGender !== "all") {
      updatedData = updatedData.filter(
        (user) => user.gender === selectedGender
      );
    }

    if (selectedRole !== "all") {
      updatedData = updatedData.filter((user) =>
        (user.selectedRoles || []).includes(selectedRole)
      );
    }

    setFilteredData(updatedData);
  }, [selectedGender, selectedRole, data]);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("KKKT Usharika wa Yombo", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.text(`${formatRoleName(Cookies.get("role"))}`, doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    const tableColumns = ["#", "Name (Jina)", "Marriage (Ndoa)", "Occupation (Kazi)", "Phone (Simu)"];
    const tableRows = filteredData.map((user, index) => [
      index + 1, // Adding the row number
      user.name,
      user.maritalStatus,
      user.occupation,
      user.phone,
    ]);

    doc.autoTable({
      startY: 40,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
    });

    doc.save(`${tableName || "UserList"}.pdf`);
  };

  return (
    <div>
      <CustomNavbar />

      <div className="container py-4">
        <div className="card shadow-sm border-0">
          <div className="card-header text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Orodha ya Wanakikundi</h5>
            <button className="btn btn-primary" onClick={generatePDF}>
              Download PDF
            </button>
          </div>

          <div className="card-body">
            {/* Filters */}
            <div className="d-flex gap-3 mb-4">
              <select
                className="form-select"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="all">Jinsia zote</option>
                <option value="me">Wanaume</option>
                <option value="ke">Wanawake</option>
              </select>

              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Vikundi vyote</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {formatRoleName(role)}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name (Jina)</th>
                    <th className="text-center">Marriage (Ndoa)</th>
                    <th className="text-center">Occupation (Kazi)</th>
                    <th className="text-center">Phone (Simu)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((user, index) => (
                    <tr
                      key={index}
                      onClick={() => openModal(user)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={user.profilePicture || "https://via.placeholder.com/50"}
                            alt={user.name}
                            className="rounded-circle me-3"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                          <div>
                            <div className="fw-bold">{user.name}</div>
                            <small className="text-muted">{user.jumuiya}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-white">{user.maritalStatus}</span>
                      </td>
                      <td className="text-center">{user.occupation}</td>
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

      <UserModal show={showModal} onClose={closeModal} user={selectedUser} />
    </div>
  );
};

export default UserTable;
