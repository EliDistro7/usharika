import React, { useState } from 'react';
import { CheckCircle, X, User, DollarSign, TrendingUp } from 'lucide-react';
import UserModal from '../admins/UserModal';

const PaymentModal = ({ selectedUser, onClose, onSubmit }) => {
  const [pledgeType, setPledgeType] = useState('');
  const [amount, setAmount] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  if (!selectedUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pledgeType || !amount) {
      alert('Tafadhali chagua aina ya ahadi na ingiza kiasi.');
      return;
    }
    onSubmit({ pledgeType, amount });
  };

  const renderOtherPledgeTypes = () => {
    const otherPledges = selectedUser.pledges.other || {};
    return Object.entries(otherPledges).map(([key, { total, paid }]) => (
      <div className="flex items-center mb-3" key={key}>
        <input
          type="radio"
          id={`pledge-${key}`}
          name="pledgeType"
          value={key}
          className="w-4 h-4 text-primary-600 border-primary-300 focus:ring-primary-500 focus:ring-2 cursor-pointer"
          checked={pledgeType === key}
          onChange={() => setPledgeType(key)}
          required
        />
        <label 
          htmlFor={`pledge-${key}`} 
          className="ml-3 text-text-primary font-medium cursor-pointer flex-1"
        >
          <span className="font-semibold text-primary-700">
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </span>
          <span className="ml-2 text-text-secondary">
            {total.toLocaleString()} TZS
          </span>
          <span className="mx-2 text-text-tertiary">/</span>
          <span className="text-success-600 font-medium">
            Iliyolipwa: {paid.toLocaleString()} TZS
          </span>
        </label>
      </div>
    ));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-gradient-to-br from-white to-background-100 rounded-3xl max-w-2xl w-full shadow-primary-lg border border-primary-100 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-100 to-lavender-100 px-6 py-5 rounded-t-3xl border-b border-primary-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mr-3 shadow-primary">
                  <DollarSign size={20} className="text-white" />
                </div>
                <h5 className="text-xl font-bold text-primary-800 m-0">
                  Ingiza malipo ya {selectedUser.name}
                </h5>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-200 transition-colors text-primary-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary-100">
              <h6 className="text-text-tertiary font-semibold text-sm uppercase tracking-wide m-0">
                Taarifa za Malipo
              </h6>
              <button
                className="flex items-center px-4 py-2 bg-peaceful-100 hover:bg-peaceful-200 text-peaceful-700 rounded-xl transition-colors font-medium text-sm border border-peaceful-300"
                onClick={() => setShowUserModal(true)}
              >
                <User size={16} className="mr-2" />
                Tazama Profile
              </button>
            </div>

            {/* Form */}
            <form id="payment-form" onSubmit={handleSubmit}>
              {/* Pledge Type Selection */}
              <div className="mb-6">
                <label className="block text-text-primary font-semibold mb-4 text-base">
                  Chagua aina ya ahadi
                </label>
                
                {/* Ahadi Option */}
                <div className="mb-3 bg-primary-50 hover:bg-primary-100 rounded-xl p-4 border border-primary-200 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="pledge-ahadi"
                      name="pledgeType"
                      value="ahadi"
                      className="w-4 h-4 text-primary-600 border-primary-300 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                      checked={pledgeType === 'ahadi'}
                      onChange={() => setPledgeType('ahadi')}
                      required
                    />
                    <label 
                      htmlFor="pledge-ahadi" 
                      className="ml-3 cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-700">Ahadi</span>
                        <TrendingUp size={16} className="text-primary-500" />
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-text-secondary">
                          Jumla: {selectedUser.pledges.ahadi.toLocaleString()} TZS
                        </span>
                        <span className="mx-2 text-text-tertiary">•</span>
                        <span className="text-success-600 font-medium">
                          Iliyolipwa: {selectedUser.pledges.paidAhadi.toLocaleString()} TZS
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Jengo Option */}
                <div className="mb-3 bg-primary-50 hover:bg-primary-100 rounded-xl p-4 border border-primary-200 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="pledge-jengo"
                      name="pledgeType"
                      value="jengo"
                      className="w-4 h-4 text-primary-600 border-primary-300 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                      checked={pledgeType === 'jengo'}
                      onChange={() => setPledgeType('jengo')}
                      required
                    />
                    <label 
                      htmlFor="pledge-jengo" 
                      className="ml-3 cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-700">Jengo</span>
                        <TrendingUp size={16} className="text-primary-500" />
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-text-secondary">
                          Jumla: {selectedUser.pledges.jengo.toLocaleString()} TZS
                        </span>
                        <span className="mx-2 text-text-tertiary">•</span>
                        <span className="text-success-600 font-medium">
                          Iliyolipwa: {selectedUser.pledges.paidJengo.toLocaleString()} TZS
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Other Pledge Types */}
                {renderOtherPledgeTypes()}
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label 
                  htmlFor="amount" 
                  className="block text-text-primary font-semibold mb-3 text-base"
                >
                  Ingiza kiasi (TZS)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500">
                    <DollarSign size={20} />
                  </div>
                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-3 bg-background-50 border-2 border-primary-200 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all font-medium"
                    id="amount"
                    name="amount"
                    placeholder="Ingiza kiasi (mfano: 50000)"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                {amount && (
                  <p className="mt-2 text-sm text-primary-700 font-medium">
                    Kiasi: {Number(amount).toLocaleString()} TZS
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-background-200 rounded-b-3xl border-t border-primary-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border-2 border-primary-300 text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors text-sm flex items-center"
            >
              <X size={16} className="mr-2" />
              Funga
            </button>
            <button
              type="submit"
              form="payment-form"
              className="px-6 py-2.5 bg-primary-gradient text-white rounded-xl font-semibold shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 transition-all text-sm flex items-center"
            >
              <CheckCircle size={16} className="mr-2" />
              Wasilisha
            </button>
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(168, 85, 247, 0.1);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
        }
      `}</style>
    </>
  );
};

export default PaymentModal;