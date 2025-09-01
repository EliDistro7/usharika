import React from 'react';
import Link from "next/link";
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const SuccessErrorModal = ({ errorMessage, successMessage, onClose }) => {
  if (!errorMessage && !successMessage) {
    return null;
  }

  const isError = !!errorMessage;
  const isSuccess = !!successMessage;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-strong max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center gap-3">
            {isError && (
              <div className="p-2 bg-error-50 rounded-full">
                <AlertCircle size={24} className="text-error-600" />
              </div>
            )}
            {isSuccess && (
              <div className="p-2 bg-success-50 rounded-full">
                <CheckCircle size={24} className="text-success-600" />
              </div>
            )}
            <h3 className="text-xl font-semibold text-text-primary">
              {isError ? 'Haikufanikiwa, jaribu tena' : 'Hongera, umefanikiwa kujisajili!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors duration-200 p-1"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
              <AlertCircle size={20} className="text-error-600 mt-0.5 flex-shrink-0" />
              <div className="text-error-700">
                {errorMessage}
              </div>
            </div>
          )}
          
          {successMessage && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
                <CheckCircle size={20} className="text-success-600 mt-0.5 flex-shrink-0" />
                <div className="text-success-700">
                  {successMessage}
                </div>
              </div>
              
              <div className="pt-2">
                <Link 
                  href="/auth" 
                  className="inline-block w-full text-center bg-primary-gradient text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-primary-lg hover:-translate-y-1"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 pt-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-background-300 text-text-secondary rounded-lg hover:bg-background-400 hover:text-text-primary transition-all duration-200"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessErrorModal;