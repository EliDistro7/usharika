

import React from "react";

const CustomModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0  flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className=" rounded-lg shadow-lg max-w-3xl w-full p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
