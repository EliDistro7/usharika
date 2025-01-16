'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { getDesanitezedCookie } from "@/hooks/useUser";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header() {
  const router = useRouter();

  const handleAkauntiNavigation = () => {
    const cookieValue = getDesanitezedCookie();
    if (cookieValue) {
      router.push(`/akaunti/${cookieValue}`);
      toast.success("Umefanikiwa kuingia kwenye akaunti yako!");
    } else {
      router.push("/auth");
      toast.warning("Tafadhali, ingia kwenye akaunti yako!");
    }
  };

  return (
    <>
      {/* Navbar Start */}
      <div className="container-fluid border-bottom bg-white position-relative px-0 mx-0">
        <div
          className="container py-2  d-lg-block px-4 "
          style={{ backgroundColor: "#6f42c1", borderRadius:"0 46px" }} // Purple background
        >
          <div className="d-flex justify-content-between">
            <div className="ps-0 px-0">
              <small className="me-0">
                <i className="fas fa-map-marker-alt me-2 text-white"></i>
                <a href="#" className="text-white">
                  123 Yombo, Dar es Salaam
                </a>
              </small>
              <small className="me-3 d-none d-lg-block">
                <i className="fas fa-envelope me-2 text-white"></i>
                <a href="#" className="text-white">
                  info@yombolutheran.com
                </a>
              </small>
            </div>
            <div className="pe-2 d-flex justify-content-between">
              <a href="#" className="btn btn-light btn-sm-square rounded-circle">
                <i className="fab fa-facebook-f" style={{ color: "#6f42c1" }}></i>
              </a>
              <a href="#" className="btn btn-light btn-sm-square rounded-circle">
                <i className="fab fa-instagram" style={{ color: "#6f42c1" }}></i>
              </a>
              <a
                href="#"
                className="btn btn-light btn-sm-square rounded-circle me-0"
              >
                <i className="fab fa-youtube" style={{ color: "#6f42c1" }}></i>
              </a>
            </div>
          </div>
        </div>
        <div className="container px-3">
          <nav className="navbar navbar-light navbar-expand-xl py-3">
            <a href="/" className="navbar-brand d-flex align-items-center">
              <h1 className="m-0 fw-bold">
                <span className='' style={{color:"#6f42c1"}}>KKKT</span>{" "}
                <span className='text-secondary'>Yombo</span>
              </h1>
            </a>
            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="fa fa-bars" style={{ color: "#6f42c1" }}></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav mx-auto">
                <a href="/" className="nav-item nav-link active" style={{ color: "#6f42c1" }}>
                  Nyumbani
                </a>
                <a href="/about" className="nav-item nav-link" style={{ color: "#6f42c1" }}>
                  Fahamu Zaidi
                </a>
                <a href="/kalenda" className="nav-item nav-link" style={{ color: "#6f42c1" }}>
                  Kalenda ya Matukio
                </a>
                <a href="/uongozi" className="nav-item nav-link" style={{ color: "#6f42c1" }}>
                  Uongozi
                </a>
                <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    style={{ color: "#6f42c1" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    System
                  </a>
                  <div
                    className="dropdown-menu m-0"
                    
                  >
                    <a href="/usajili" className="dropdown-item ">
                      Kujisajili
                    </a>
                    <a
                      onClick={handleAkauntiNavigation}
                      className="dropdown-item "
                      style={{ cursor: "pointer" }}
                    >
                      Akaunti
                    </a>
                    <a
                      onClick={handleAkauntiNavigation}
                      className="dropdown-item "
                      style={{ cursor: "pointer" }}
                    >
                      Login
                    </a>
                  </div>
                </div>
                <a href="/contact" className="nav-item nav-link" style={{ color: "#6f42c1" }}>
                  Mawasiliano
                </a>
              </div>
              <div className="d-flex me-4">
                <div className="d-flex align-items-center justify-content-center">
                  <a href="#" className="position-relative">
                    <i
                      className="fa fa-phone-alt fa-2x"
                      style={{ color: "#6f42c1" }}
                    ></i>
                  </a>
                </div>
                <div className="d-flex flex-column pe-3">
                  <span style={{ color: "#6f42c1" }}>Wasiliana nasi</span>
                  <a href="#">
                    <span style={{ color: "#8e5bdb" }}>Piga: +0123 456 7890</span>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* Navbar End */}

      {/* Modal Search Start */}
      <div
        className="modal fade"
        id="searchModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content rounded-0">
            <div
              className="modal-header"
              style={{ backgroundColor: "#8e5bdb" }}
            >
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Ingiza neno utafute
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex align-items-center">
              <div className="input-group w-75 mx-auto">
                <input
                  type="search"
                  className="form-control p-3"
                  placeholder="Keywords"
                  style={{ borderColor: "#6f42c1" }}
                />
                <span
                  className="input-group-text p-3"
                  style={{
                    backgroundColor: "#6f42c1",
                    color: "white",
                  }}
                >
                  <i className="fa fa-search"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Search End */}
    </>
  );
}
