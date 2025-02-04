import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Dropdown = ({ activeTab, setActiveTab, content }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="btn btn-dark w-100 text-start d-flex justify-content-between align-items-center py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{content[activeTab].groupName}</span>
        {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {dropdownOpen && (
        <div className="mt-2 bg-white rounded-lg shadow-md p-2">
          {Object.keys(content).map((tab) => (
            <button
              key={tab}
              className={`btn w-100 text-start mb-1 rounded-lg ${
                activeTab === tab
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setDropdownOpen(false);
              }}
            >
              {content[tab].groupName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;