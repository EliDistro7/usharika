'use client';

import React, { useEffect, useState } from "react";
import { getUserDonations } from "@/actions/users"; // Import the helper function
import { getLoggedInUserId } from "@/hooks/useUser";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setLoading] = useState(false);

  // Fetch user donations
  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);
        const donations = await getUserDonations(getLoggedInUserId());
        const today = new Date();
        const validDonations = donations.filter((donation) => {
          return new Date(donation.deadline) > today;
        });
        setDonations(validDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDonations();
  }, []);

  // Function to generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text("Donation Summary", 14, 10);

    // Table data
    const tableColumn = ["Aina", "Kikundi", "Kilicholipwa", "Iliyoahidiwa", "Iliyobaki"];
    const tableRows = donations.map((donation) => [
      donation.name,
      donation.group,
      `TZS ${donation.amountPaid.toLocaleString()}`,
      `TZS ${donation.total.toLocaleString()}`,
      `TZS ${(donation.total - donation.amountPaid).toLocaleString()}`,
    ]);

    // Adding table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save("donations_summary.pdf");
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="card shadow-sm">
        <div className="card-header text-white" style={{ backgroundColor: "#6f42c1" }}>
          <h5 className="mb-0 text-white">Michango Kwenye Vikundi</h5>
        </div>
        <div className="card-body">
          {donations.length > 0 ? (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={downloadPDF}>
                  Pakua PDF
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="fw-bold">Aina</th>
                      <th className="fw-bold d-none d-md-table-cell">Kikundi</th>
                      <th className="fw-bold text-end">Kilicholipwa</th>
                      <th className="fw-bold text-end d-none d-lg-table-cell">Iliyoahidiwa</th>
                      <th className="fw-bold text-center d-none d-lg-table-cell">Maendeleo</th>
                      <th className="fw-bold text-end">Iliyobaki</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation, index) => (
                      <tr key={index}>
                        <td>{donation.name}</td>
                        <td className="d-none d-md-table-cell">{donation.group}</td>
                        <td className="text-end">TZS {donation.amountPaid}</td>
                        <td className="text-end d-none d-lg-table-cell">TZS {donation.total}</td>
                        <td className="text-center d-none d-lg-table-cell">
                          <div className="progress" style={{ height: "20px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${(donation.amountPaid / donation.total) * 100}%` }}
                              aria-valuenow={(donation.amountPaid / donation.total) * 100}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {Math.round((donation.amountPaid / donation.total) * 100)}%
                            </div>
                          </div>
                        </td>
                        <td className="text-end">
                          TZS {(donation.total - donation.amountPaid).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-muted">Hauna mchango wowtwe kwenye vikundi</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;
