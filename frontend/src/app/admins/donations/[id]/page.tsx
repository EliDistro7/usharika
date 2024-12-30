'use client';
import React, { useState } from "react";
import CreateDonation from "@/components/admins/CreateDonation";
import UserDonationsTable from "@/components/admins/UserDonationsTable";
import UserDonationsTableAll from "@/components/admins/UserDonationsTableAll";
import { getLoggedInUserId } from "@/hooks/useUser"; // Replace with your actual import path
import Cookie from "js-cookie";

import { Navbar, Nav, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

export default function AdminDonationsPage() {
  const [activeTab, setActiveTab] = useState("create"); // 'create', 'view', or 'all'

  // Retrieve userId and group dynamically
  const userId = getLoggedInUserId();
  const group = Cookie.get("role") || "Unknown Group"; // Assumes the role is stored in a cookie

  return (
    <div className="container mt-4">
      {/* Header */}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#">Michango</Navbar.Brand>
          {/* Toggle Button for Small Screens */}
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <FaBars style={{ color: "white", fontSize: "1.5rem" }} />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                href="#create"
                onClick={() => setActiveTab("create")}
                style={{
                  color: activeTab === "create" ? "#fff" : "#d1d1d1",
                  fontWeight: activeTab === "create" ? "bold" : "normal",
                }}
              >
                Anzisha Mchango
              </Nav.Link>
              <Nav.Link
                href="#view"
                onClick={() => setActiveTab("view")}
                style={{
                  color: activeTab === "view" ? "#fff" : "#d1d1d1",
                  fontWeight: activeTab === "view" ? "bold" : "normal",
                }}
              >
                Angalia Michango
              </Nav.Link>
              <Nav.Link
                href="#all"
                onClick={() => setActiveTab("all")}
                style={{
                  color: activeTab === "all" ? "#fff" : "#d1d1d1",
                  fontWeight: activeTab === "all" ? "bold" : "normal",
                }}
              >
                Balances
              </Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text>
                Kikundi: <strong>{group.replace(/"_"/gi, " ")}</strong>
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
