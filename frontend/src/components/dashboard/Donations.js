'use client';

import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaChevronDown } from "react-icons/fa";
import { getUserDonations } from "@/actions/users"; // Import the helper function
import { getLoggedInUserId } from "@/hooks/useUser";

// Donations Component
const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setLoading] = useState(false);

  // Fetch user donations
  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);
        const donations = await getUserDonations(getLoggedInUserId());
        // Filter donations where deadline has not passed
        const today = new Date();
        const validDonations = donations.filter(donation => {
          return new Date(donation.deadline) > today;
        });
        console.log('valid donations', validDonations);
        setDonations(validDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDonations();
  }, []);

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
        <div className="card-header text-white" style={{backgroundColor:"#6f42c1"}}>
          <h5 className="mb-0 text-white">Michango Kwenye Vikundi</h5>
        </div>
        <div className="card-body">
          {donations.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="">
                  <tr>
                    <th className="fw-bold">Aina</th>
                    <th className="fw-bold">Kikundi</th> {/* Added Group */}
                    <th className="fw-bold text-end">Kilicholipwa</th>
                    <th className="fw-bold text-end">Iliyoahidiwa</th>
                    <th className="fw-bold text-center">Maendeleo</th>
                    <th className="fw-bold text-end">Iliyobaki</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, index) => (
                    <tr key={index}>
                      <td>{donation.name}</td>
                      <td>{donation.group}</td> {/* Displaying the Group */}
                      <td className="text-end">TZS {donation.amountPaid}</td>
                      <td className="text-end">TZS {donation.total}</td>
                      <td className="text-center">
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
          ) : (
            <p className="text-muted">Hauna mchango wowtwe kwenye vikundi</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;
