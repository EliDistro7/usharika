

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
      <div
        className="container-fluid border-bottom bg-light wow fadeIn position-relative z-10"
        data-wow-delay="0.1s"
      >
        <div
          className="container topbar bg-secondary d-none d-lg-block py-2"
          style={{ borderRadius: "0 40px" }}
        >
          <div className="d-flex justify-content-between">
            <div className="top-info ps-2">
              <small className="me-3">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>{" "}
                <a href="#" className="text-white">
                  123 Yombo, Dar es Salaam
                </a>
              </small>
              <small className="me-3">
                <i className="fas fa-envelope me-2 text-primary"></i>
                <a href="#" className="text-white">
                  info@yombolutheran.com
                </a>
              </small>
            </div>
            <div className="top-link pe-2">
              <a href="#" className="btn btn-light btn-sm-square rounded-circle">
                <i className="fab fa-facebook-f text-secondary"></i>
              </a>
              <a href="#" className="btn btn-light btn-sm-square rounded-circle">
                <i className="fab fa-instagram text-secondary"></i>
              </a>
              <a href="#" className="btn btn-light btn-sm-square rounded-circle me-0">
                <i className="fab fa-youtube text-secondary"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="container px-0">
          <nav className="navbar navbar-light navbar-expand-xl py-3">
            <a href="/" className="navbar-brand d-flex align-items-center">
              <h1 className="m-0 fw-bold">
                <span className="text-primary display-6 fw-bold">KKKT</span>
                <span className="text-secondary display-6 fw-bold">Yombo Kuu</span>
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
              <span className="fa fa-bars text-primary"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav mx-auto">
                <a href="/" className="nav-item nav-link active">
                  Nyumbani
                </a>
                <a href="/about" className="nav-item nav-link">
                  Fahamu Zaidi
                </a>
                <a href="/kalenda" className="nav-item nav-link">
                  Kalenda ya Matukio
                </a>
               
                <a href="/uongozi" className="nav-item nav-link">
                 Uongozi 
                </a>
               
              
                <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                   System
                  </a>
                  <div className="dropdown-menu m-0 bg-secondary rounded-0">
                    <a href="/usajili" className="dropdown-item">
                      Kujisajili
                    </a>
                    <a
                      onClick={handleAkauntiNavigation}
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                    >
                      akaunti
                    </a>
                    <a
                      onClick={handleAkauntiNavigation}
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                    >
                      login
                    </a>
                   
                  </div>
                </div> 
                <a href="/contact" className="nav-item nav-link">
                  Mawasiliano
                </a>
              </div>
              <div className="d-flex me-4">
                <div
                  id="phone-tada"
                  className="d-flex align-items-center justify-content-center"
                >
                  <a
                    href="#"
                    className="position-relative wow tada"
                    data-wow-delay=".9s"
                  >
                    <i className="fa fa-phone-alt text-primary fa-2x me-4"></i>
                    <div
                      className="position-absolute"
                      style={{ top: "-7px", left: "20px" }}
                    >
                      <span>
                        <i className="fa fa-comment-dots text-secondary"></i>
                      </span>
                    </div>
                  </a>
                </div>
                <div className="d-flex flex-column pe-3">
                  <span className="text-primary">Wasiliana nasi</span>
                  <a href="#">
                    <span className="text-secondary">Piga: +0123 456 7890</span>
                  </a>
                </div>
              </div>
              {/*

                   <button
                className="btn-search btn btn-primary btn-md-square rounded-circle"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fas fa-search text-white"></i>
              </button>

              */}
              
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
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
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
              <div className="input-group w-75 mx-auto d-flex">
                <input
                  type="search"
                  className="form-control p-3"
                  placeholder="keywords"
                  aria-describedby="search-icon-1"
                />
                <span id="search-icon-1" className="input-group-text p-3">
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
