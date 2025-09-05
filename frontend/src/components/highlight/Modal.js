import React from "react";
import { FaTimes } from "react-icons/fa";

const CustomModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-center items-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className="relative bg-background-50 rounded-2xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header/Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            className="w-10 h-10 rounded-full bg-background-200 hover:bg-error-100 border-2 border-border-light hover:border-error-300 text-text-secondary hover:text-error-600 transition-all duration-200 hover:scale-110 shadow-soft flex items-center justify-center group"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes 
              size={14} 
              className="transition-transform duration-200 group-hover:rotate-90" 
            />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;