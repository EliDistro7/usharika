import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Cookies from "js-cookie";
import { formatRoleName } from "@/actions/utils";
import UserModal from "./UserModal";
import { Download, Filter, Users, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const UserTable = ({ data, tableName = "" }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
      index + 1,
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

  const getGenderLabel = (value) => {
    switch (value) {
      case "all": return "Jinsia zote";
      case "me": return "Wanaume";
      case "ke": return "Wanawake";
      default: return "Jinsia zote";
    }
  };

  const getRoleLabel = (value) => {
    if (value === "all") return "Vikundi vyote";
    return formatRoleName(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-3xl shadow-strong border border-border-light overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-r from-primary-600 to-primary-700 border-b border-primary-500">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Orodha ya Wanakikundi</h2>
          </div>
          <button
            onClick={generatePDF}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold rounded-xl border border-white border-opacity-30 transition-all duration-300 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gradient-to-r from-background-50 to-background-100 border-b border-border-light">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-primary-800">Filters</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Gender Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => {
                  setGenderDropdownOpen(!genderDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border-default rounded-xl hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <span className="text-text-primary">{getGenderLabel(selectedGender)}</span>
                <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${genderDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {genderDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-strong border border-border-light overflow-hidden animate-slide-down">
                  {[
                    { value: "all", label: "Jinsia zote" },
                    { value: "me", label: "Wanaume" },
                    { value: "ke", label: "Wanawake" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedGender(option.value);
                        setGenderDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200 ${
                        selectedGender === option.value 
                          ? 'bg-primary-100 text-primary-800 font-semibold border-l-4 border-primary-600' 
                          : 'text-text-primary hover:text-primary-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setGenderDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border-default rounded-xl hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <span className="text-text-primary">{getRoleLabel(selectedRole)}</span>
                <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-strong border border-border-light overflow-hidden max-h-64 overflow-y-auto animate-slide-down">
                  <button
                    onClick={() => {
                      setSelectedRole("all");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200 ${
                      selectedRole === "all" 
                        ? 'bg-primary-100 text-primary-800 font-semibold border-l-4 border-primary-600' 
                        : 'text-text-primary hover:text-primary-700'
                    }`}
                  >
                    Vikundi vyote
                  </button>
                  {roles.map((role, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200 ${
                        selectedRole === role 
                          ? 'bg-primary-100 text-primary-800 font-semibold border-l-4 border-primary-600' 
                          : 'text-text-primary hover:text-primary-700'
                      }`}
                    >
                      {formatRoleName(role)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-primary-800">#</th>
                <th className="px-6 py-4 text-left font-bold text-primary-800">Name (Jina)</th>
                <th className="px-6 py-4 text-center font-bold text-primary-800 hidden md:table-cell">(Ndoa)</th>
                <th className="px-6 py-4 text-center font-bold text-primary-800 hidden md:table-cell">(Kazi)</th>
                <th className="px-6 py-4 text-center font-bold text-primary-800 hidden sm:table-cell">(Simu)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr
                  key={index}
                  onClick={() => openModal(user)}
                  className={`border-b border-border-light hover:bg-primary-25 transition-colors duration-200 cursor-pointer ${
                    index % 2 === 0 ? 'bg-background-50' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-text-primary">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.profilePicture || "https://via.placeholder.com/50"}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary-200 shadow-sm"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border border-white"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{user.name}</div>
                        <div className="text-sm text-text-secondary">{user.jumuiya}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center hidden md:table-cell">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300">
                      {user.maritalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-text-primary font-medium hidden md:table-cell">
                    {user.occupation}
                  </td>
                  <td className="px-6 py-4 text-center text-text-primary font-medium hidden sm:table-cell">
                    {user.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center p-6 bg-gradient-to-r from-background-50 to-background-100 border-t border-border-light">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-text-tertiary bg-background-200 rounded-lg cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="px-4 py-2 text-text-secondary hover:bg-primary-100 hover:text-primary-700 rounded-lg transition-colors duration-200">
              2
            </button>
            <button className="px-4 py-2 text-text-secondary hover:bg-primary-100 hover:text-primary-700 rounded-lg transition-colors duration-200">
              3
            </button>
            <button className="px-4 py-2 text-text-secondary hover:bg-primary-100 hover:text-primary-700 rounded-lg transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <UserModal show={showModal} onClose={closeModal} user={selectedUser} />
    </div>
  );
};

export default UserTable;