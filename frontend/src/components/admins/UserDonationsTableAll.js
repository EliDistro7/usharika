import React, { useEffect, useState } from 'react';
import { getDonationsByGroupAndFieldType } from '@/actions/users';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import the autoTable plugin

const UserDonationsTableAll = ({ userId, group, field_type }) => {
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // State to track active donation name

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getDonationsByGroupAndFieldType({ userId, group, field_type });
        console.log('donations', data);
        setDonationsData(data);
        if (data.length > 0) setActiveTab(data[0].donations[0].name); // Set first donation name as active by default
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId, group, field_type]);

  const handleDownloadPDF = () => {
    if (!activeTab) {
      toast.error("Please select a donation to download data.");
      return;
    }

    const doc = new jsPDF();

    // Format Group Name (Remove underscores and capitalize words)
    const formattedGroup = group.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    // Get Current Date and Time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // Add Header Section with Purple Theme
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 128); // Purple color
    doc.setFontSize(20);
    doc.text("KKKT USHARIKA WA YOMBO", 105, 15, { align: "center" }); // Centered Title
    doc.setFontSize(16);
    doc.text(`Mchango: ${activeTab}`, 105, 25, { align: "center" }); // Donation name as a subheader

    doc.setFontSize(14);
    doc.text(`Huduma: ${formattedGroup}`, 14, 40); // Group Name
    doc.text(`Tarehe: ${formattedDate} | Muda: ${formattedTime}`, 14, 50); // Date and Time

    // Add Purple Table Headers and Donation Data
    const headers = ['Username', 'Kilicholipwa', 'Kinachotakiwa', 'Balance'];

    // Filter donations based on the selected name (activeTab)
    const activeDonationData = donationsData
      .flatMap(user => user.donations.map(donation => ({ username: user.username, ...donation })))
      .filter(donation => donation.name === activeTab);

    const body = activeDonationData.map(donation => [
      donation.username,
      donation.amountPaid,
      donation.total,
      donation.total - donation.amountPaid, // Calculate balance
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

    // Add Total Summary Below the Table
    const totalDonation = activeDonationData.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const totalKuu = activeDonationData.reduce((acc, curr) => acc + curr.total, 0);

    const summaryStartY = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`Total Kilicholipwa: ${totalDonation}`, 14, summaryStartY);
    doc.text(`Total Inayotarajiwa: ${totalKuu}`, 14, summaryStartY + 10);
    doc.text(`Total Balance ambayo Haijalipwa: ${totalKuu - totalDonation}`, 14, summaryStartY + 20);

    // Add Footer Section with Purple Color
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(128, 0, 128); // Purple text for the footer

    doc.text("Generated by KKKT Usharika Wa Yombo System", 105, pageHeight - 10, { align: "center" });

    // Save the PDF with the selected donation name in the filename
    doc.save(`${activeTab}_donations.pdf`);
  };

  // Group donations by name
  const donationNames = Array.from(new Set(donationsData.flatMap(user => user.donations.map(donation => donation.name))));

  const totalDonation = donationsData
    .flatMap(user => user.donations)
    .filter(donation => donation.name === activeTab)
    .reduce((acc, donation) => acc + donation.amountPaid, 0);

  const totalKuu = donationsData
    .flatMap(user => user.donations)
    .filter(donation => donation.name === activeTab)
    .reduce((acc, donation) => acc + donation.total, 0);

    return (
      <div className="container mt-4">
        {loading && <div className="alert alert-info">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && donationsData.length === 0 && (
          <div className="alert alert-warning">Hakuna Michango yoyote kwa sasa</div>
        )}
        {!loading && !error && donationsData.length > 0 && (
          <div>
            {/* Dropdown for Donation Names */}
            <Dropdown className="mb-3">
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {activeTab || 'Select Donation'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {donationNames.map((donationName, idx) => (
                  <Dropdown.Item
                    key={idx}
                    onClick={() => setActiveTab(donationName)}
                    active={activeTab === donationName}
                  >
                    {donationName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
    
            {/* Active Donation Content */}
            {activeTab && (
              <div>
                {donationsData
                  .flatMap(user => user.donations)
                  .filter(donation => donation.name === activeTab).length === 0 ? (
                    <div>Hakuna Michango kwenye hichi kikundi</div>
                  ) : (
                    <div>
                      <table className="table table-bordered table-striped mt-3">
                        <thead>
                          <tr>
                            <th scope="col" className="fw-bold">Jina</th>
                            <th scope="col" className="fw-bold">Kilicholipwa</th>
                            <th scope="col" className="fw-bold">Kinachotakiwa</th>
                            <th scope="col" className="fw-bold">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donationsData
                            .flatMap(user => user.donations.map(donation => ({ username: user.username, ...donation }))) // Combine username with donation
                            .filter(donation => donation.name === activeTab) // Filter by activeTab (name)
                            .map((donation, idx) => (
                              <tr key={donation._id || idx}>
                                <td className="fw-bold">{donation.username}</td> {/* Display username from user object */}
                                <td>{donation.amountPaid}</td>
                                <td>{donation.total}</td>
                                <td>{donation.total - donation.amountPaid}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="mt-3 d-flex flex-direction-column">
                        <strong>Total Kilicholipwa: {totalDonation}</strong>
                      </div>
                      <div>
                        <strong>Total Inayotarajiwa: {totalKuu}</strong>
                      </div>
                      <div>
                        <strong>Total Balance ambayo Haijalipwa: {totalKuu - totalDonation}</strong>
                      </div>
                    </div>
                  )}
                <Button variant="success" onClick={handleDownloadPDF} className="mt-3">
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        )}
    
        {/* Toast Container for Toastify Notifications */}
        <ToastContainer />
      </div>
    );
    
};

export default UserDonationsTableAll;
