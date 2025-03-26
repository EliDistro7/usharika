import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const Dropdown = ({ activeTab, setActiveTab, content, colors }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        className={`w-100 text-start d-flex justify-content-between align-items-center py-3 px-4 rounded-xl shadow-md transition-all ${cormorant.className}`}
        style={{
          backgroundColor: colors.purple,
          color: colors.white,
          fontSize: "1.2rem",
          border: "none",
          transform: dropdownOpen ? "scale(1.02)" : "scale(1)"
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{content[activeTab].groupName}</span>
        {dropdownOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
      </button>

      {dropdownOpen && (
        <div className="mt-2 rounded-xl shadow-lg overflow-hidden">
          {Object.keys(content).map((tab) => (
            <button
              key={tab}
              className={`w-100 text-start py-3 px-4 ${cormorant.className}`}
              style={{
                backgroundColor: activeTab === tab ? colors.purple : colors.white,
                color: activeTab === tab ? colors.white : colors.black,
                fontSize: "1.1rem",
                border: "none",
                borderBottom: `1px solid ${colors.lightBg}`,
                transition: "all 0.2s ease"
              }}
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