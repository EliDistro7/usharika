'use client';

import React, { useEffect, useState } from "react";
import { Users, Tag, Download, CheckCircle, Target, TrendingUp, Clock, ChevronRight } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-text-secondary mt-4 font-medium">Inapakia michango...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="glass-strong rounded-5xl overflow-hidden shadow-primary-lg border border-border-light hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
        {/* Header */}
        <div className="bg-primary-gradient text-white p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-gradient opacity-90"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold font-display mb-1">
                  Michango Kwenye Vikundi
                </h2>
                <p className="text-purple-100 text-sm lg:text-base opacity-90">
                  Michango yako kwenye vikundi mbalimbali
                </p>
              </div>
            </div>
            {donations.length > 0 && (
              <button
                onClick={downloadPDF}
                className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-white border-opacity-30 hover:border-opacity-40 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm"
              >
                <Download className="w-4 h-4" />
                <span>Pakua PDF</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white">
          {donations.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-background-300 border-b border-border-light">
                        <th className="px-6 py-5 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4" />
                            <span>Aina</span>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Kikundi</span>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-right text-xs font-bold text-primary-700 uppercase tracking-wider">
                          <div className="flex items-center justify-end space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Kilicholipwa</span>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-right text-xs font-bold text-primary-700 uppercase tracking-wider">
                          <div className="flex items-center justify-end space-x-2">
                            <Target className="w-4 h-4" />
                            <span>Iliyoahidiwa</span>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-center text-xs font-bold text-primary-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center space-x-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Maendeleo</span>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-right text-xs font-bold text-primary-700 uppercase tracking-wider">
                          <div className="flex items-center justify-end space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Iliyobaki</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-background-200 transition-all duration-300 hover:scale-[1.001] hover:shadow-soft border-b border-border-light"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-3">
                              <div 
                                className={`w-3 h-3 rounded-full ${
                                  index % 3 === 0 ? 'bg-primary-600' : 
                                  index % 3 === 1 ? 'bg-purple-600' : 'bg-green-500'
                                }`}
                              ></div>
                              <span className="font-semibold text-text-primary">{donation.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-background-300 text-primary-700 border border-border-accent">
                              {donation.group}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="font-semibold text-success-600 font-mono">
                              TZS {formatAmount(donation.amountPaid)}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="font-semibold text-primary-600 font-mono">
                              TZS {formatAmount(donation.total)}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="px-4">
                              <div className="w-full bg-background-400 rounded-xl h-6 overflow-hidden shadow-inner">
                                <div
                                  className="h-full bg-accent-gradient rounded-xl transition-all duration-500 shadow-green flex items-center justify-center relative overflow-hidden"
                                  style={{ width: `${Math.min((donation.amountPaid / donation.total) * 100, 100)}%` }}
                                >
                                  <span className="text-white text-xs font-bold z-10">
                                    {Math.round((donation.amountPaid / donation.total) * 100)}%
                                  </span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse-soft"></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="font-semibold text-error-600 font-mono">
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
              <div className="lg:hidden p-4 space-y-4">
                {donations.map((donation, index) => (
                  <div 
                    key={index} 
                    className="glass rounded-4xl p-6 hover:shadow-primary transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              index % 3 === 0 ? 'bg-primary-600' : 
                              index % 3 === 1 ? 'bg-purple-600' : 'bg-green-500'
                            }`}
                          ></div>
                          <h3 className="font-bold text-primary-700 text-lg">
                            {donation.name}
                          </h3>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-background-300 text-primary-700 border border-border-accent">
                          {donation.group}
                        </span>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-accent-gradient shadow-green">
                          {Math.round((donation.amountPaid / donation.total) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-background-400 rounded-xl h-6 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-accent-gradient rounded-xl transition-all duration-500 shadow-green relative overflow-hidden"
                          style={{ width: `${Math.min((donation.amountPaid / donation.total) * 100, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse-soft"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-background-300 hover:bg-primary-gradient hover:text-white rounded-2xl p-3 text-center transition-all duration-300 group">
                        <div className="text-xs text-text-secondary group-hover:text-white font-semibold mb-1 uppercase tracking-wide">
                          Kilicholipwa
                        </div>
                        <div className="font-bold text-success-600 group-hover:text-white text-sm font-mono">
                          TZS {formatAmount(donation.amountPaid)}
                        </div>
                      </div>
                      <div className="bg-background-300 hover:bg-primary-gradient hover:text-white rounded-2xl p-3 text-center transition-all duration-300 group">
                        <div className="text-xs text-text-secondary group-hover:text-white font-semibold mb-1 uppercase tracking-wide">
                          Lengo
                        </div>
                        <div className="font-bold text-primary-600 group-hover:text-white text-sm font-mono">
                          TZS {formatAmount(donation.total)}
                        </div>
                      </div>
                      <div className="bg-background-300 hover:bg-primary-gradient hover:text-white rounded-2xl p-3 text-center transition-all duration-300 group">
                        <div className="text-xs text-text-secondary group-hover:text-white font-semibold mb-1 uppercase tracking-wide">
                          Imebaki
                        </div>
                        <div className="font-bold text-error-600 group-hover:text-white text-sm font-mono">
                          TZS {formatAmount(donation.total - donation.amountPaid)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8">
              <div className="bg-white border-2 border-dashed border-primary-300 rounded-5xl p-16 text-center">
                <div className="w-20 h-20 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-primary">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-3 font-display">
                  Hauna Michango
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  Hauna mchango wowote kwenye vikundi kwa sasa. 
                  Michango itaonekana hapa inapotoka.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;