'use client';

import React, { useEffect, useState } from "react";
import { getUserDonations } from "@/actions/users"; // Import the helper function
import { getLoggedInUserId } from "@/hooks/useUser";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setLoading] = useState(false);

  // Function to format numbers
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 10000) {
      return `${(amount / 1000).toFixed(0)}K`;
    } else {
      return amount.toLocaleString();
    }
  };

  // Function to format full numbers for PDF
  const formatFullAmount = (amount) => {
    return `TZS ${amount.toLocaleString()}`;
  };

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

    // Add title with styling
    doc.setFontSize(20);
    doc.setTextColor(111, 66, 193);
    doc.text("Ripoti ya Michango Kwenye Vikundi", 14, 25);
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tarehe: ${new Date().toLocaleDateString('sw-TZ')}`, 14, 35);

    // Table data with full amounts
    const tableColumn = ["Aina", "Kikundi", "Kilicholipwa (TZS)", "Iliyoahidiwa (TZS)", "Maendeleo (%)", "Iliyobaki (TZS)"];
    const tableRows = donations.map((donation) => [
      donation.name,
      donation.group,
      donation.amountPaid.toLocaleString(),
      donation.total.toLocaleString(),
      `${Math.round((donation.amountPaid / donation.total) * 100)}%`,
      (donation.total - donation.amountPaid).toLocaleString(),
    ]);

    // Adding table with enhanced styling
    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      styles: { 
        fontSize: 10,
        cellPadding: 8
      },
      headStyles: {
        fillColor: [111, 66, 193],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 255]
      },
      theme: "striped",
    });

    // Save the PDF
    doc.save("Ripoti_Michango_Vikundi.pdf");
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="d-flex flex-column align-items-center">
          <div 
            className="spinner-border mb-3"
            style={{ 
              color: '#6f42c1',
              width: '3rem',
              height: '3rem'
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mb-0">Inapakia michango...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom Styles */}
      <style jsx>{`
        .donations-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .donations-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }
        
        .card-header-donations {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 25px;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .card-header-donations::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), 
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          opacity: 0.1;
        }
        
        .btn-download-donations {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 20px;
          padding: 8px 20px;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .btn-download-donations:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
        }
        
        .table-donations {
          background: transparent;
          margin-bottom: 0;
        }
        
        .table-donations thead th {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
          color: #6f42c1;
          border: none;
          padding: 18px 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.8rem;
          vertical-align: middle;
        }
        
        .table-donations tbody tr {
          transition: all 0.3s ease;
          border: none;
        }
        
        .table-donations tbody tr:hover {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
          transform: scale(1.002);
          box-shadow: 0 3px 10px rgba(111, 66, 193, 0.1);
        }
        
        .table-donations tbody td {
          padding: 18px 15px;
          border: none;
          vertical-align: middle;
          font-weight: 500;
        }
        
        .progress-donations {
          height: 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .progress-bar-donations {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(40, 167, 69, 0.3);
        }
        
        .progress-bar-donations::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%), 
                      linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.2) 75%), 
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.2) 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
          animation: progress-animation 2s linear infinite;
        }
        
        @keyframes progress-animation {
          0% { background-position: 0 0, 0 4px, 4px -4px, -4px 0px; }
          100% { background-position: 8px 0, 8px 4px, 12px -4px, 4px 0px; }
        }
        
        .amount-display {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          color: #2d3748;
          font-variant-numeric: tabular-nums;
        }
        
        .amount-paid {
          color: #059669;
        }
        
        .amount-remaining {
          color: #dc2626;
        }
        
        .amount-total {
          color: #6366f1;
        }
        
        .mobile-donation-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          border-left: 4px solid #6f42c1;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-donation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
        }
        
        .mobile-stats-donations {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .mobile-stats-donations:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .empty-state {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 60px 30px;
          text-align: center;
          border: 2px dashed rgba(111, 66, 193, 0.3);
        }
        
        .empty-state-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 2rem;
        }
        
        @media (max-width: 768px) {
          .card-header-donations {
            padding: 15px 20px;
          }
          
          .table-donations thead th,
          .table-donations tbody td {
            padding: 12px 10px;
            font-size: 0.9rem;
          }
          
          .mobile-donation-card {
            padding: 15px;
          }
          
          .btn-download-donations {
            padding: 6px 15px;
            font-size: 0.9rem;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="animate-fade-in">
        <div className="donations-card">
          <div className="card-header-donations">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center position-relative">
              <div className="d-flex align-items-center mb-3 mb-md-0">
                <i className="bi bi-people-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h5 className="mb-0 fw-bold">Michango Kwenye Vikundi</h5>
                  <small className="opacity-75">Michango yako kwenye vikundi mbalimbali</small>
                </div>
              </div>
              {donations.length > 0 && (
                <button
                  className="btn btn-download-donations d-flex align-items-center"
                  onClick={downloadPDF}
                >
                  <i className="bi bi-download me-2"></i>
                  Pakua PDF
                </button>
              )}
            </div>
          </div>
          
          <div className="card-body p-0">
            {donations.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="d-none d-lg-block">
                  <div className="table-responsive">
                    <table className="table table-donations">
                      <thead>
                        <tr>
                          <th style={{ minWidth: '120px' }}>
                            <i className="bi bi-tag me-2"></i>
                            Aina
                          </th>
                          <th style={{ minWidth: '100px' }}>
                            <i className="bi bi-collection me-2"></i>
                            Kikundi
                          </th>
                          <th className="text-end" style={{ minWidth: '120px' }}>
                            <i className="bi bi-check-circle me-2"></i>
                            Kilicholipwa
                          </th>
                          <th className="text-end" style={{ minWidth: '120px' }}>
                            <i className="bi bi-target me-2"></i>
                            Iliyoahidiwa
                          </th>
                          <th className="text-center" style={{ minWidth: '180px' }}>
                            <i className="bi bi-graph-up me-2"></i>
                            Maendeleo
                          </th>
                          <th className="text-end" style={{ minWidth: '120px' }}>
                            <i className="bi bi-clock me-2"></i>
                            Iliyobaki
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map((donation, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="me-3"
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#764ba2' : '#20c997'
                                  }}
                                ></div>
                                <strong>{donation.name}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="badge" style={{ 
                                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
                                color: '#6f42c1',
                                border: '1px solid rgba(111, 66, 193, 0.2)',
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>
                                {donation.group}
                              </span>
                            </td>
                            <td className="text-end">
                              <span className="amount-display amount-paid">
                                TZS {formatAmount(donation.amountPaid)}
                              </span>
                            </td>
                            <td className="text-end">
                              <span className="amount-display amount-total">
                                TZS {formatAmount(donation.total)}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="progress progress-donations mx-2">
                                <div
                                  className="progress-bar progress-bar-donations d-flex align-items-center justify-content-center"
                                  role="progressbar"
                                  style={{ width: `${Math.min((donation.amountPaid / donation.total) * 100, 100)}%` }}
                                  aria-valuenow={(donation.amountPaid / donation.total) * 100}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span className="fw-bold text-white" style={{ fontSize: '0.75rem' }}>
                                    {Math.round((donation.amountPaid / donation.total) * 100)}%
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="text-end">
                              <span className="amount-display amount-remaining">
                                TZS {formatAmount(donation.total - donation.amountPaid)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile/Tablet Cards */}
                <div className="d-lg-none p-3">
                  <div className="row">
                    {donations.map((donation, index) => (
                      <div key={index} className="col-md-6 col-12">
                        <div className="mobile-donation-card">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                <div 
                                  className="me-2"
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#764ba2' : '#20c997'
                                  }}
                                ></div>
                                <h6 className="mb-0 fw-bold" style={{ color: '#6f42c1' }}>
                                  {donation.name}
                                </h6>
                              </div>
                              <span className="badge" style={{ 
                                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
                                color: '#6f42c1',
                                border: '1px solid rgba(111, 66, 193, 0.2)',
                                fontSize: '0.75rem'
                              }}>
                                {donation.group}
                              </span>
                            </div>
                            <span 
                              className="badge ms-2"
                              style={{
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                borderRadius: '12px',
                                padding: '6px 10px',
                                color: 'white',
                                fontSize: '0.8rem'
                              }}
                            >
                              {Math.round((donation.amountPaid / donation.total) * 100)}%
                            </span>
                          </div>
                          
                          <div className="progress progress-donations mb-3">
                            <div
                              className="progress-bar progress-bar-donations"
                              style={{ width: `${Math.min((donation.amountPaid / donation.total) * 100, 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="row g-2">
                            <div className="col-4">
                              <div className="mobile-stats-donations">
                                <div className="small text-muted mb-1 fw-600">Kilicholipwa</div>
                                <div className="fw-bold amount-paid" style={{ fontSize: '0.85rem' }}>
                                  TZS {formatAmount(donation.amountPaid)}
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="mobile-stats-donations">
                                <div className="small text-muted mb-1 fw-600">Lengo</div>
                                <div className="fw-bold amount-total" style={{ fontSize: '0.85rem' }}>
                                  TZS {formatAmount(donation.total)}
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="mobile-stats-donations">
                                <div className="small text-muted mb-1 fw-600">Imebaki</div>
                                <div className="fw-bold amount-remaining" style={{ fontSize: '0.85rem' }}>
                                  TZS {formatAmount(donation.total - donation.amountPaid)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4">
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <h5 className="mb-2" style={{ color: '#6f42c1' }}>Hauna Michango</h5>
                  <p className="text-muted mb-0">
                    Hauna mchango wowote kwenye vikundi kwa sasa. 
                    Michango itaonekana hapa inapotoka.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Donations;