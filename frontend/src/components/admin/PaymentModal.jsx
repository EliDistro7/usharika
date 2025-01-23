import React, { useState } from 'react';
import UserModal from '../admins/UserModal';

const PaymentModal = ({ selectedUser, onClose, onSubmit }) => {
  const [pledgeType, setPledgeType] = useState('');
  const [amount, setAmount] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  if (!selectedUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pledgeType || !amount) {
      alert('Please select a pledge type and enter an amount.');
      return;
    }
    onSubmit({ pledgeType, amount });
  };

  const renderOtherPledgeTypes = () => {
    const otherPledges = selectedUser.pledges.other || {};
    return Object.entries(otherPledges).map(([key, { total, paid }]) => (
      <div className="form-check" key={key}>
        <input
          type="radio"
          id={`pledge-${key}`}
          name="pledgeType"
          value={key}
          className="form-check-input"
          checked={pledgeType === key}
          onChange={() => setPledgeType(key)}
          required
        />
        <label htmlFor={`pledge-${key}`} className="form-check-label">
          {key.charAt(0).toUpperCase() + key.slice(1)}: {total} / Iliyolipwa: {paid}
        </label>
      </div>
    ));
  };

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog" >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content" style={{ backgroundColor: '#f7f3fd' }}>
            <div className="modal-header text-white"  style={{ backgroundColor: '#e6e0f8', color: '#4a2ea0' }}>
              <h5 className="modal-title">
                <i className="fas fa-money-check-alt me-2"></i>
                Ingiza malipo ya {selectedUser.name}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-muted">Taarifa za Malipo</h6>
                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={() => setShowUserModal(true)}
                >
                  <i className="fas fa-user-circle me-1"></i>
                  Tazama Profile
                </button>
              </div>
              <form id="payment-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Chagua aina ya ahadi</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="pledge-ahadi"
                      name="pledgeType"
                      value="ahadi"
                      className="form-check-input"
                      checked={pledgeType === 'ahadi'}
                      onChange={() => setPledgeType('ahadi')}
                      required
                    />
                    <label htmlFor="pledge-ahadi" className="form-check-label">
                      Ahadi: {selectedUser.pledges.ahadi} / Iliyolipwa: {selectedUser.pledges.paidAhadi}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="pledge-jengo"
                      name="pledgeType"
                      value="jengo"
                      className="form-check-input"
                      checked={pledgeType === 'jengo'}
                      onChange={() => setPledgeType('jengo')}
                      required
                    />
                    <label htmlFor="pledge-jengo" className="form-check-label">
                      Jengo: {selectedUser.pledges.jengo} / Iliyolipwa: {selectedUser.pledges.paidJengo}
                    </label>
                  </div>
                  {renderOtherPledgeTypes()}
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Ingiza kiasi
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    placeholder="Enter amount"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-success"
                form="payment-form"
              >
                <i className="fas fa-check-circle me-1"></i> Wasilisha
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <i className="fas fa-times me-1"></i> Funga
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UserModal */}
      {showUserModal && (
        <UserModal
          show={showUserModal}
          onClose={() => setShowUserModal(false)}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default PaymentModal;
