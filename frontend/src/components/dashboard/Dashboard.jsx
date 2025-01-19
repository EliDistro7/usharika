'use client';

import React, { useEffect, useState } from "react";

import NavbarTabs from "./NavbarTabs";
import { getUserNotifications, getUserDonations } from "@/actions/users";
import { getLoggedInUserId, removeCookie } from "@/hooks/useUser";
import Donations from './Donations';
import { useRouter } from "next/navigation";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import jsPDF from "jspdf";
import "jspdf-autotable";


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
  const router = useRouter();
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

  
const confirmLogout = (isConfirmed) => {
  if (isConfirmed) {
    removeCookie(); // Logout logic
    router.push("/"); // Redirect to home
  } else {
    toast.dismiss(); // Dismiss the toast
  }
};

   // Handle logout confirmation
 const handleLogout = () => {
  toast.info(
    <div>
      <p>Unataka ku-log-out?</p>
      <div>
        <button
          className="btn btn-danger btn-sm me-2"
          onClick={() => confirmLogout(true)}
        >
          Ndio
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => confirmLogout(false)}
        >
          Hapana
        </button>
      </div>
    </div>,
    { autoClose: false }
  );
};



const handleDownload = () => {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(18);
  doc.text("Ripoti ya Sadaka za Kanisa", 14, 20);

  // Format table data
  const tableColumn = ["Aina", "Kilicholipwa (TZS)", "Iliyoahidiwa (TZS)", "Maendeleo (%)", "Iliyobaki (TZS)"];
  const tableRows = pledges.map((pledge) => [
    pledge.title,
    pledge.paid.toLocaleString(),
    pledge.total.toLocaleString(),
    `${Math.round((pledge.paid / pledge.total) * 100)}%`,
    (pledge.total - pledge.paid).toLocaleString(),
  ]);

  // Add the table
  doc.autoTable({
    startY: 30,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 10 },
    theme: "grid",
  });

  // Save the PDF
  doc.save("Ripoti_Sadaka_za_Kanisa.pdf");
};


  return (
    <div className="container">
     
       {/* Dynamic Navbar */}
       <div className="mb-4">
        <div className="navbar bg-white container-fluid ">
          <NavbarTabs roles={userRoles} notifications={notifications || []} user={user} />
        </div>
         {/* Pinned Announcements */}
      <div className="d-flex justify-content-center gap-4 pt-4 mb-4">
      <button className="btn btn-primary ms-auto" onClick={handleLogout}>
    Log Out
  </button>
       
        <PinnedAnnouncements notifications={notifications} />
      </div>
      </div>
      
      <Donations />

     


      {/* Contributions Table */}
        
 {/* Contributions Table */}
<div className="my-4">
  <div className="card shadow-sm">
    <div
      className="card-header text-white d-flex justify-content-between align-items-center"
      style={{ backgroundColor: "#6f42c1" }}
    >
      <h5 className="mb-0 text-white">Sadaka za Kanisa</h5>
      <button
        className="btn btn-outline-light btn-sm"
        onClick={handleDownload}
      >
        <i className="bi bi-download"></i> Pakua Ripoti
      </button>
    </div>
    <div className="card-body">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="fw-bold">Aina</th>
              <th className="fw-bold text-end d-none d-lg-table-cell">Kilicholipwa</th>
              <th className="fw-bold text-end d-none d-lg-table-cell">Iliyoahidiwa</th>
              <th className="fw-bold text-center d-none d-md-table-cell">Maendeleo</th>
              <th className="fw-bold text-end">Iliyobaki</th>
            </tr>
          </thead>
          <tbody>
            {pledges.map((pledge, index) => (
              <tr key={index}>
                <td>{pledge.title}</td>
                <td className="text-end d-none d-lg-table-cell">TZS {pledge.paid.toLocaleString()}</td>
                <td className="text-end d-none d-lg-table-cell">TZS {pledge.total.toLocaleString()}</td>
                <td className="text-center d-none d-md-table-cell">
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
