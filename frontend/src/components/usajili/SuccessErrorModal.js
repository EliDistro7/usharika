import React from 'react';
import Link from "next/link";

const SuccessErrorModal = ({ errorMessage, successMessage, onClose }) => {
  if (!errorMessage && !successMessage) {
    return null;
  }

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {errorMessage ? 'Haikufanikiwa, jaribu tena' : 'Hongera, umefanikiwa kujisajili!'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div>
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
                <div className="mt-3">
                  <Link href="/auth" className="btn btn-primary">
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessErrorModal;