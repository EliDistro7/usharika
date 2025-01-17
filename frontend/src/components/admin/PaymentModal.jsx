import React, { useState } from 'react';

const PaymentModal = ({ selectedUser, onClose, onSubmit }) => {
  const [pledgeType, setPledgeType] = useState('');
  const [amount, setAmount] = useState('');

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
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ingiza malipo ya {selectedUser.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="payment-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Chagua aina ya ahadi</label>

                {/* Default pledge types */}
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

                {/* Dynamic pledge types */}
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
            <button type="submit" className="btn btn-primary" form="payment-form">
              Wasilisha
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
