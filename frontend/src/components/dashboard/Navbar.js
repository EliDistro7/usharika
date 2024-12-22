

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <header className="navbar pcoded-header navbar-expand-lg navbar-light">
      <div className="container">
        <div className="m-header">
          <a className="mobile-menu" id="mobile-collapse" href="#!">
            <span></span>
          </a>
          <a href="#!" className="b-brand">
            {/* Change your logo here */}
            <img src="assets/images/logo.png" alt="Logo" className="logo" />
            <img
              src="assets/images/logo-icon.png"
              alt="Logo Thumb"
              className="logo-thumb"
            />
          </a>
          <a href="#!" className="mob-toggler">
            <i className="feather icon-more-vertical"></i>
          </a>
        </div>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a href="#!" className="pop-search">
                <i className="feather icon-search"></i>
              </a>
              <div className="search-bar">
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="Search here"
                />
                <button type="button" className="close" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </li>
            <li className="nav-item">
              <div className="dropdown">
                <a className="dropdown-toggle h-drop" href="#" data-toggle="dropdown">
                  Dropdown
                </a>
                <div className="dropdown-menu profile-notification">
                  <ul className="pro-body">
                    <li>
                      <a href="user-profile.html" className="dropdown-item">
                        <i className="fas fa-circle"></i> Profile
                      </a>
                    </li>
                    <li>
                      <a href="email_inbox.html" className="dropdown-item">
                        <i className="fas fa-circle"></i> My Messages
                      </a>
                    </li>
                    <li>
                      <a href="auth-signin.html" className="dropdown-item">
                        <i className="fas fa-circle"></i> Lock Screen
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li>
              <div className="dropdown">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                  <i className="icon feather icon-bell"></i>
                  <span className="badge badge-pill badge-danger">5</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right notification">
                  <div className="noti-head">
                    <h6 className="d-inline-block m-b-0">Notifications</h6>
                    <div className="float-right">
                      <a href="#!" className="m-r-10">
                        mark as read
                      </a>
                      <a href="#!">clear all</a>
                    </div>
                  </div>
                  <ul className="noti-body">
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-1.jpg"
                          alt="Generic placeholder"
                        />
                        <div className="media-body">
                          <p>
                            <strong>John Doe</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10"></i>5 min
                            </span>
                          </p>
                          <p>New ticket Added</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="noti-footer">
                    <a href="#!">show all</a>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="dropdown drp-user">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="feather icon-user"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right profile-notification">
                  <div className="pro-head">
                    <img
                      src="assets/images/user/avatar-1.jpg"
                      className="img-radius"
                      alt="User"
                    />
                    <span>John Doe</span>
                    <a href="auth-signin.html" className="dud-logout" title="Logout">
                      <i className="feather icon-log-out"></i>
                    </a>
                  </div>
                  <ul className="pro-body">
                    <li>
                      <a href="user-profile.html" className="dropdown-item">
                        <i className="feather icon-user"></i> Profile
                      </a>
                    </li>
                    <li>
                      <a href="email_inbox.html" className="dropdown-item">
                        <i className="feather icon-mail"></i> My Messages
                      </a>
                    </li>
                    <li>
                      <a href="auth-signin.html" className="dropdown-item">
                        <i className="feather icon-lock"></i> Lock Screen
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
