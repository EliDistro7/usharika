import React, { useEffect, useState } from 'react';
import { getDonationsByGroupAndFieldType, updateDonationPayment } from '@/actions/users';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import the autoTable plugin

const UserDonationsTable = ({ userId, group, field_type }) => {
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // State to track active tab

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getDonationsByGroupAndFieldType({ userId, group, field_type });
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

  const handleAddPayment = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleSavePayment = async () => {
    if (!selectedDonation || !amount) return;

    try {
      await updateDonationPayment(selectedDonation._id, { amountPaid: parseFloat(amount) });
      // Show success message using Toastify
      toast.success("Payment updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });

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
      toast.error(`Error updating payment: ${err.message}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    } finally {
      setShowModal(false);
      setAmount('');
      setSelectedDonation(null);
    }
  };

  const handleDownloadPDF = () => {
    if (!activeUser) {
      toast.error("Tafadhali inatakiwa uchague mwanakikundi ii uweze ku-download data zake za malipo.");
      return;
    }
  
     // Format Group Name (Remove underscores and capitalize words)
  const formattedGroup = group.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const doc = new jsPDF();


  // Add Header with Enlarged Font
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(` ${activeUser.username}`, 14, 10);
  doc.text(` ${formattedGroup}`, 14, 20);
  
    // Add Table Headers and User-Specific Data
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const headers = ['Mchango', 'Kilicholipwa', 'Kinachotakiwa', 'Deadline'];
  const body = activeUser.donations.map(donation => [
    donation.name,
    donation.amountPaid,
    donation.total,
    new Date(donation.deadline).toLocaleDateString()
  ]);

  doc.autoTable({
    head: [headers],
    body: body,
    startY: 30, // Adjust start position to avoid overlapping with user info
    theme: "grid",
    headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    margin: { top: 10, left: 10, right: 10, bottom: 10 },
  });
    // Save the PDF with the username in the filename
    doc.save(`${activeUser.username}_donations.pdf`);
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
                            onClick={() => handleAddPayment(donation)}
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
