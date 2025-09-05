import React from "react";

const AddGroupModal = ({ show, onClose, onAddGroup, newGroupName, setNewGroupName }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background-50 rounded-2xl shadow-strong max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-display font-semibold text-text-primary">
            Ongeza chapter kwenye Albamu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-300 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Jina la Chapter
              </label>
              <input
                type="text"
                placeholder="Ingiza jina na Chapter"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-4 py-3 border border-border-default rounded-xl 
                         bg-background-50 text-text-primary placeholder-text-tertiary
                         focus:outline-none focus:ring-2 focus:ring-primary-500 
                         focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border-light">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-border-default text-text-secondary 
                     hover:bg-background-300 hover:text-text-primary rounded-xl 
                     font-medium transition-all"
          >
            Funga
          </button>
          <button
            onClick={onAddGroup}
            className="btn-primary px-6 py-2.5 rounded-xl font-medium"
          >
            Wasilisha
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;