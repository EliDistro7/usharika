'use client';

import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarCheck, FaChevronDown } from "react-icons/fa";
import Summary from "./Summary";
import ContributionProgress from "./ContributionProgress";
import NavbarTabs from "./NavbarTabs";
import { getUserNotifications, getUserDonations } from "@/actions/users";
import { getLoggedInUserId } from "@/hooks/useUser";
import Donations from './Donations';


// Check if the user has any "kiongozi" roles
const hasKiongoziRole = (roles) => roles.some((role) => role.startsWith("kiongozi"));

// Pinned Announcements Component
const PinnedAnnouncements = ({ notifications }) => {
  const pinned = notifications.filter((notification) => notification.pinned);

  return (
    <div className="dropdown">
      <button
        className="btn btn-warning dropdown-toggle"
        type="button"
        id="pinnedAnnouncementsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Matangazo (pinned) {pinned.length > 0 && <span className="badge bg-light text-dark ms-1">{pinned.length}</span>}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end shadow-sm"
        aria-labelledby="pinnedAnnouncementsDropdown"
      >
        {pinned.length > 0 ? (
          pinned.map((announcement, index) => (
            <li key={index} className="dropdown-item">
              <p className="mb-1">{announcement.message}</p>
              <small className="text-muted">
                {new Date(announcement.time).toLocaleDateString()}
              </small>
            </li>
          ))
        ) : (
          <li className="dropdown-item text-muted">No pinned announcements.</li>
        )}
      </ul>
    </div>
  );
};


const Dashboard = ({ user, summary }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const isKiongozi = hasKiongoziRole(user?.selectedRoles || []);
  const userRoles = user?.selectedRoles || [];

  const pledges = [
    { title: "Ahadi", paid: user?.pledges?.paidAhadi || 0, total: user?.pledges?.ahadi || 0 },
    { title: "Jengo", paid: user?.pledges?.paidJengo || 0, total: user?.pledges?.jengo || 0 },
    ...(user?.pledges?.other
      ? Object.keys(user?.pledges?.other).map((key) => ({
          title: key,
          paid: user?.pledges?.other[key]?.paid || 0,
          total: user?.pledges?.other[key]?.total || 0,
        }))
      : []),
  ];

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const notifications = await getUserNotifications(getLoggedInUserId());
        setNotifications(notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  return (
    <div className="container">
      {/* Pinned Announcements */}
      <div className="d-flex justify-content-end mb-4">
       
        <PinnedAnnouncements notifications={notifications} />
      </div>
       {/* Dynamic Navbar */}
       <div className="mb-4">
        <div className="navbar bg-white container-fluid">
          <NavbarTabs roles={userRoles} notifications={notifications || []} user={user} />
        </div>
      </div>
      
      <Donations />

     

      {/* Summary Section */}
      <div className="row mb-4">
        <div className="col-md-12">
          <Summary summary={summary} />
        </div>
      </div>

      {/* Contributions Table */}
      <div className="my-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0 text-white">Sadaka Nyingine za Ahadi</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-primary">
                  <tr>
                    <th className="fw-bold">Aina</th>
                    <th className="fw-bold text-end">Kilicholipwa</th>
                    <th className="fw-bold text-end">Iliyoahidiwa</th>
                    <th className="fw-bold text-center">Maendeleo</th>
                    <th className="fw-bold text-end">Iliyobaki</th>
                  </tr>
                </thead>
                <tbody>
                  {pledges.map((pledge, index) => (
                    <tr key={index}>
                      <td>{pledge.title}</td>
                      <td className="text-end">TZS {pledge.paid.toLocaleString()}</td>
                      <td className="text-end">TZS {pledge.total.toLocaleString()}</td>
                      <td className="text-center">
                        <div className="progress" style={{ height: "20px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${(pledge.paid / pledge.total) * 100}%` }}
                            aria-valuenow={(pledge.paid / pledge.total) * 100}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {Math.round((pledge.paid / pledge.total) * 100)}%
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        TZS {(pledge.total - pledge.paid).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
