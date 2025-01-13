'use client';
import React, { useState } from "react";
import CreateDonation from "@/components/admins/CreateDonation";
import UserDonationsTable from "@/components/admins/UserDonationsTable";
import UserDonationsTableAll from "@/components/admins/UserDonationsTableAll";
import { getLoggedInUserId } from "@/hooks/useUser"; // Replace with your actual import path
import Cookie from "js-cookie";

import { Navbar, Nav, Container, Breadcrumb } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { formatRoleName } from "@/actions/utils";
import CustomNavbar from "@/components/admins/CustomNavbar";

export default function AdminDonationsPage() {
  const [activeTab, setActiveTab] = useState("create"); // 'create', 'view', or 'all'

  // Retrieve userId and group dynamically
  const userId = getLoggedInUserId();
  const group = Cookie.get("role") || "Unknown Group"; // Assumes the role is stored in a cookie

  return (
    <div className="container mt-0 px-0">
      {/* Header */}
      <CustomNavbar />

      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item
          active={activeTab === "create"}
          onClick={() => setActiveTab("create")}
        >
          Anzisha Mchango
        </Breadcrumb.Item>
        <Breadcrumb.Item
          active={activeTab === "view"}
          onClick={() => setActiveTab("view")}
        >
          Angalia Michango
        </Breadcrumb.Item>
        <Breadcrumb.Item
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          Balances
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {activeTab === "create" && (
          <div className="tab-pane fade show active">
            <CreateDonation />
          </div>
        )}
        {activeTab === "view" && (
          <div className="tab-pane fade show active">
            <UserDonationsTable
              userId={userId} // Dynamically pass userId
              group={group} // Dynamically pass group
              field_type="michango"
            />
          </div>
        )}
        {activeTab === "all" && (
          <div className="tab-pane fade show active">
            <UserDonationsTableAll
              userId={userId} // Dynamically pass userId
              group={group} // Dynamically pass group
              field_type="michango"
            />
          </div>
        )}
      </div>
    </div>
  );
}
