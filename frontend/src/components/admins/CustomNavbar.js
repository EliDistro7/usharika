

import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import Cookies from "js-cookie";
import {getLoggedInUserId} from "@/hooks/useUser";
import {formatRoleName} from "@/actions/utils"
const CustomNavbar = () => {
  const [activeTab2, setActiveTab2] = useState("home");

  return (
    <Navbar style={{ backgroundColor: "#6f42c1" }} variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#">
          <strong>{formatRoleName(Cookies.get("role"))}</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars style={{ color: "white", fontSize: "1.5rem" }} />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href={`/akaunti/${getLoggedInUserId()}`}
              onClick={() => setActiveTab2("home")}
              style={{
                color: activeTab2 === "home" ? "#fff" : "#d1d1d1",
                fontWeight: activeTab2 === "home" ? "bold" : "normal",
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href={`/admins/matangazo/${getLoggedInUserId()}`}
              onClick={() => setActiveTab2("matangazo")}
              style={{
                color: activeTab2 === "matangazo" ? "#fff" : "#d1d1d1",
                fontWeight: activeTab2 === "matangazo" ? "bold" : "normal",
              }}
            >
              Matangazo
            </Nav.Link>
            <Nav.Link
              href={`/admins/donations/${getLoggedInUserId()}`}
              onClick={() => setActiveTab2("michango")}
              style={{
                color: activeTab2 === "michango" ? "#fff" : "#d1d1d1",
                fontWeight: activeTab2 === "michango" ? "bold" : "normal",
              }}
            >
              Michango
            </Nav.Link>
            <Nav.Link
              href={`/admins/attendance/${getLoggedInUserId()}`}
              onClick={() => setActiveTab2("attendance")}
              style={{
                color: activeTab2 === "attendance" ? "#fff" : "#d1d1d1",
                fontWeight: activeTab2 === "attendance" ? "bold" : "normal",
              }}
            >
              Mahudhurio
            </Nav.Link>
           
           
            <Nav.Link
              href={`/admins/top-members/${getLoggedInUserId()}`}
              onClick={() => setActiveTab2("top-members")}
              style={{
                color: activeTab2 === "top-members" ? "#fff" : "#d1d1d1",
                fontWeight: activeTab2 === "top-members" ? "bold" : "normal",
              }}
            >
              Top Members
            </Nav.Link>
            <Nav.Link
              href={`/create-highlight/${getLoggedInUserId()}`}
              onClick={() => setActiveTab2("update-status")}
              style={{
                color: activeTab2 === "update-status" ? "#fff" : "#d1d1d1",
                fontWeight: activeTab2 === "update-status" ? "bold" : "normal",
              }}
            >
              update status
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
