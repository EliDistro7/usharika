import React, { useEffect, useState } from 'react';
import { getDonationsByGroupAndFieldType, updateDonationPayment, addDonationAmount } from '@/actions/users';
import { ChevronDown, Download, Plus, X, Calendar, DollarSign, User } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const UserDonationsTable = ({ userId, group, field_type }) => {
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [userId2, setUserId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getDonationsByGroupAndFieldType({ userId, group, field_type });
        console.log('donations', data);
        setDonationsData(data);
        if (data.length > 0) setActiveTab(data[0].username);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId, group, field_type]);

  const handleAddPayment = ({ cur, donation }) => {
    console.log('cur user', cur);
    setUserId(cur.userId);
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleSavePayment = async () => {
    if (!selectedDonation || !amount) return;

    console.log('userId2', userId2);

    try {
      await addDonationAmount({
        userId: userId2,
        donationId: selectedDonation._id,
        amount: parseFloat(amount),
      });

      toast.success(`Umefanikiwa kuongeza mchango kwa ${activeUser.username}`);

      setDonationsData((prevData) =>
        prevData.map((user) =>
          user.username === selectedDonation.username
            ? {
                ...user,
                donations: user.donations.map((donation) =>
                  donation._id === selectedDonation._id
                    ? { ...donation, amountPaid: donation.amountPaid + parseFloat(amount) }
                    : donation
                ),
              }
            : user
        )
      );
    } catch (err) {
      toast.error(`Error adding donation amount: ${err.message}`);
    } finally {
      setShowModal(false);
      setAmount('');
      setSelectedDonation(null);
    }
  };

  const handleDownloadPDF = () => {
    if (!activeUser) {
      toast.error("Please select a user to download their data.");
      return;
    }

    if (!activeUser.donations || activeUser.donations.length === 0) {
      toast.error("No donations available for the selected user.");
      return;
    }

    const doc = new jsPDF({ compress: true });

    // Format Group Name (Remove underscores and capitalize words)
    const formattedGroup = group.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    // Get Current Date and Time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // Add Metadata to the PDF
    doc.setProperties({
      title: `${activeUser.username} Donations`,
      subject: "User Donation Report",
      author: "KKKT Usharika wa Yombo",
      keywords: "donations, PDF, user report",
      creator: "jsPDF",
    });

    // Add Header Section with Purple Theme
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 128);
    doc.setFontSize(20);
    doc.text("KKKT USHARIKA WA YOMBO", 105, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text(`Mwanakikundi: ${activeUser.username}`, 14, 30);
    doc.text(`Huduma: ${formattedGroup}`, 14, 40);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tarehe: ${formattedDate} | Muda: ${formattedTime}`, 14, 50);

    const headers = ['Mchango', 'Kilicholipwa', 'Kinachotakiwa', 'Deadline'];
    const body = activeUser.donations.map(donation => [
      donation.name.length > 20 ? `${donation.name.slice(0, 20)}...` : donation.name,
      donation.amountPaid,
      donation.total,
      new Date(donation.deadline).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [headers],
      body: body,
      startY: 60,
      theme: "grid",
      headStyles: {
        fillColor: [128, 0, 128],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [240, 230, 250],
      },
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
    });

    const pageHeight = doc.internal.pageSize.height;
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(128, 0, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, pageHeight - 10, { align: "center" });
    }

    const sanitizedUsername = activeUser.username.replace(/[^\w-]/g, '_');
    doc.save(`${sanitizedUsername}_donations.pdf`);
  };

  const activeUser = donationsData.find((user) => user.username === activeTab);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {loading && (
        <div className="glass p-4 rounded-2xl border border-primary-200 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-primary-300 rounded-full animate-pulse-soft"></div>
            <p className="text-primary-700 font-medium">Loading user donations...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-error-50 to-error-100 border border-error-200 p-4 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-error-500 rounded-full"></div>
            <p className="text-error-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && donationsData.length > 0 && (
        <div className="space-y-6">
          {/* Custom Dropdown for Users */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-auto min-w-[300px] flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-2xl shadow-primary-lg transition-all duration-300 hover:shadow-primary-lg hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span className="text-lg">{activeTab || 'Select User'}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-strong border border-border-light overflow-hidden animate-slide-down max-h-64 overflow-y-auto">
                {donationsData.map((user, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(user.username);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-6 py-4 text-left hover:bg-primary-50 transition-colors duration-200 ${
                      activeTab === user.username 
                        ? 'bg-primary-100 text-primary-800 font-semibold border-l-4 border-primary-600' 
                        : 'text-text-primary hover:text-primary-700'
                    } ${idx !== donationsData.length - 1 ? 'border-b border-border-light' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4" />
                      <span>{user.username}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active User Content */}
          {activeUser && (
            <div className="space-y-6">
              {activeUser.donations.length === 0 ? (
                <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 p-6 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-warning-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-warning-600" />
                  </div>
                  <p className="text-warning-700 font-medium text-lg">Hakuna Michango Uliyoanzisha mpaka sasa</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-3xl shadow-strong overflow-hidden border border-border-light">
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-6 h-6 text-white" />
                        <h3 className="text-white font-bold text-xl">{activeUser.username}</h3>
                      </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
                          <tr>
                            <th className="px-6 py-4 text-left font-bold text-primary-800">Aina Ya Mchango</th>
                            <th className="px-6 py-4 text-left font-bold text-primary-800">Kilicholipwa</th>
                            <th className="px-6 py-4 text-left font-bold text-primary-800">Kinachotakiwa</th>
                            <th className="px-6 py-4 text-left font-bold text-primary-800">Deadline</th>
                            <th className="px-6 py-4 text-center font-bold text-primary-800">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeUser.donations.map((donation, idx) => (
                            <tr 
                              key={donation._id || idx}
                              className={`border-b border-border-light hover:bg-primary-25 transition-colors duration-200 ${
                                idx % 2 === 0 ? 'bg-background-50' : 'bg-white'
                              }`}
                            >
                              <td className="px-6 py-4 font-semibold text-text-primary">{donation.name}</td>
                              <td className="px-6 py-4 text-success-600 font-medium">
                                {donation.amountPaid.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-text-secondary font-medium">
                                {donation.total.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-text-secondary">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(donation.deadline).toLocaleDateString()}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleAddPayment({ cur: activeUser, donation })}
                                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-medium rounded-xl shadow-success transition-all duration-300 hover:shadow-success-lg hover:scale-105"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Ongeza Malipo</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold rounded-2xl shadow-yellow-lg transition-all duration-300 hover:shadow-yellow-lg hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Custom Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-strong max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Ongeza Malipo</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background-100 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {selectedDonation && (
                <>
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-700 font-medium">Mchango:</span>
                      <span className="font-bold text-primary-800">{selectedDonation.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-700 font-medium">Kilicholipwa:</span>
                      <span className="font-bold text-success-600">{selectedDonation.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-700 font-medium">Kinachotakiwa:</span>
                      <span className="font-bold text-text-primary">{selectedDonation.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-700 font-medium">Balance:</span>
                      <span className="font-bold text-warning-600">
                        {(selectedDonation.total - selectedDonation.amountPaid).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary">
                      Ingiza Kiasi Unachotaka Kulipia
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        className="w-full pl-11 pr-4 py-4 border border-border-default rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-lg font-medium"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-border-light">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-border-medium text-text-secondary font-medium rounded-xl hover:bg-background-100 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayment}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-primary transition-all duration-300 hover:shadow-primary-lg hover:scale-105"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-2xl shadow-strong"
      />
    </div>
  );
};

export default UserDonationsTable;