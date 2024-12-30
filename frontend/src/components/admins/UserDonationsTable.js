import React, { useEffect, useState } from 'react';
import { getDonationsByGroupAndFieldType, updateDonationPayment } from '@/actions/users';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import the autoTable plugin
import  {addDonationAmount} from '@/actions/users';

const UserDonationsTable = ({ userId, group, field_type }) => {
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // State to track active tab
  const [userId2, setUserId] = useState(null); // State to track user

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getDonationsByGroupAndFieldType({ userId, group, field_type });
        console.log('daonations', data)
        setDonationsData(data);
        if (data.length > 0) setActiveTab(data[0].username); // Set the first user as active by default
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId, group, field_type]);

  const handleAddPayment = ({cur,donation}) => {
    console.log('cur user', cur)
    setUserId(cur.userId);
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleSavePayment = async () => {
    if (!selectedDonation || !amount) return;

    console.log('userId2', userId2)
  
    try {
      // Add the donation amount using the addDonationAmount function
      await addDonationAmount({
        userId:userId2,
        donationId: selectedDonation._id,
        amount: parseFloat(amount),
      });
  
      // Show success message using Toastify
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
      // Show error message using Toastify
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
    doc.setTextColor(128, 0, 128); // Purple color
    doc.setFontSize(20);
    doc.text("KKKT USHARIKA WA YOMBO", 105, 15, { align: "center" }); // Centered Title
  
    doc.setFontSize(14);
    doc.text(`Mwanakikundi: ${activeUser.username}`, 14, 30); // User Name
    doc.text(`Huduma: ${formattedGroup}`, 14, 40); // Group Name
  
    // Add Date and Time
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black text for date and time
    doc.text(`Tarehe: ${formattedDate} | Muda: ${formattedTime}`, 14, 50);
  
    // Add Purple Table Headers and User-Specific Data
    const headers = ['Mchango', 'Kilicholipwa', 'Kinachotakiwa', 'Deadline'];
    const body = activeUser.donations.map(donation => [
      donation.name.length > 20 ? `${donation.name.slice(0, 20)}...` : donation.name, // Truncate long names
      donation.amountPaid,
      donation.total,
      new Date(donation.deadline).toLocaleDateString()
    ]);
  
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 60, // Adjust start position to avoid overlapping with header
      theme: "grid",
      headStyles: {
        fillColor: [128, 0, 128], // Purple background
        textColor: [255, 255, 255], // White text
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [240, 230, 250], // Light purple for alternate rows
      },
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
    });
  
    // Add Footer Section with Page Numbers
    const pageHeight = doc.internal.pageSize.height;
    const pageCount = doc.internal.getNumberOfPages();
  
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(128, 0, 128); // Purple text for the footer
      doc.text(`Page ${i} of ${pageCount}`, 105, pageHeight - 10, { align: "center" });
    }
  
    // Save the PDF with the sanitized username in the filename
    const sanitizedUsername = activeUser.username.replace(/[^\w-]/g, '_');
    doc.save(`${sanitizedUsername}_donations.pdf`);
  };
  
  

  const activeUser = donationsData.find((user) => user.username === activeTab);

  return (
    <div className="container mt-4">
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && donationsData.length > 0 && (
        <div>
          {/* Dropdown for Tab Names */}
          <Dropdown className="mb-3">
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {activeTab || 'Select User'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {donationsData.map((user, idx) => (
                <Dropdown.Item
                  key={idx}
                  onClick={() => setActiveTab(user.username)}
                  active={activeTab === user.username}
                >
                  {user.username}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Active Tab Content */}
          {activeUser && (
            <div>
              {activeUser.donations.length === 0 ? (
                <div>Hakuna Michango Uliyoanzisha mpaka sasa</div>
              ) : (
                <table className="table table-bordered table-striped mt-3">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-bold">Aina Ya Mchango</th>
                      <th scope="col" className="fw-bold">Kilicholipwa</th>
                      <th scope="col" className="fw-bold">Kinachotakiwa</th>
                      <th scope="col" className="fw-bold">Deadline</th>
                      <th scope="col" className="fw-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeUser.donations.map((donation, idx) => (
                      <tr key={donation._id || idx}>
                        <td className="fw-bold">{donation.name}</td>
                        <td>{donation.amountPaid}</td>
                        <td>{donation.total}</td>
                        <td>{new Date(donation.deadline).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddPayment({cur:activeUser,donation})}
                          >
                            Ongeza Malipo
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Button variant="success" onClick={handleDownloadPDF} className="mt-3">
                Download PDF
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ongeza Malipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonation && (
            <div>
              <p>
                <strong>Mchango:</strong> {selectedDonation.name}
              </p>
              <p>
                <strong>Kilicholipwa:</strong> {selectedDonation.amountPaid}
              </p>
              <Form>
                <Form.Group>
                  <Form.Label>Ingiza Kiasi Unachotaka Kulipia</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    className="mb-3"
                  />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePayment}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Container for Toastify Notifications */}
      <ToastContainer />
    </div>
  );
};

export default UserDonationsTable;
