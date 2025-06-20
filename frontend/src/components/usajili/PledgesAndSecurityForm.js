'use client';
import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import RoleSelector from "./roles-selector/index";

const PledgesAndSecurityForm = ({ 
  formData, 
  handlePledgeChange, 
  handleInputChange, 
  handleRoleChange,
  handleLeadershipPositionsChange,
  userRoles,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  return (
    <div className="container-fluid p-0">
      <div className="row g-4">
        {/* Financial Commitments Section */}
        <div className="col-12">
          <div className="card border-0 shadow-lg rounded-4" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" 
                     style={{
                       width: '80px', 
                       height: '80px',
                       background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                     }}>
                  <i className="fas fa-hand-holding-usd text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>
                  Sadaka za Ahadi
                </h2>
                <p className="text-muted">Ingiza taarifa za michango yako</p>
              </div>

              <div className="row g-4">
                {/* Ahadi */}
                <div className="col-md-6">
                  <div className="card h-100 border-0 rounded-3" style={{
                    background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                    border: '1px solid rgba(168, 85, 247, 0.1)'
                  }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" 
                             style={{
                               width: '40px', 
                               height: '40px',
                               background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                             }}>
                          <i className="fas fa-heart text-white" style={{fontSize: '1rem'}}></i>
                        </div>
                        <label htmlFor="ahadi" className="form-label fw-bold text-dark mb-0">
                          Ahadi <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-2" style={{
                          borderColor: '#a855f7',
                          color: '#7c3aed'
                        }}>
                          <i className="fas fa-dollar-sign"></i>
                        </span>
                        <input
                          type="number"
                          id="ahadi"
                          className="form-control border-2"
                          placeholder="Kiasi cha Ahadi"
                          onChange={handlePledgeChange}
                          required
                          style={{
                            borderColor: '#a855f7',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)';
                            e.target.style.borderColor = '#7c3aed';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = '#a855f7';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jengo */}
                <div className="col-md-6">
                  <div className="card h-100 border-0 rounded-3" style={{
                    background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                    border: '1px solid rgba(168, 85, 247, 0.1)'
                  }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" 
                             style={{
                               width: '40px', 
                               height: '40px',
                               background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                             }}>
                          <i className="fas fa-building text-white" style={{fontSize: '1rem'}}></i>
                        </div>
                        <label htmlFor="jengo" className="form-label fw-bold text-dark mb-0">
                          Jengo <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-2" style={{
                          borderColor: '#a855f7',
                          color: '#7c3aed'
                        }}>
                          <i className="fas fa-dollar-sign"></i>
                        </span>
                        <input
                          type="number"
                          id="jengo"
                          className="form-control border-2"
                          placeholder="Kiasi cha Jengo"
                          onChange={handlePledgeChange}
                          required
                          style={{
                            borderColor: '#a855f7',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)';
                            e.target.style.borderColor = '#7c3aed';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = '#a855f7';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Security Section */}
        <div className="col-12">
          <div className="card border-0 shadow-lg rounded-4" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" 
                     style={{
                       width: '80px', 
                       height: '80px',
                       background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                     }}>
                  <i className="fas fa-shield-alt text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>
                  Usalama wa Akaunti
                </h2>
                <p className="text-muted">Tengeneza nenosiri salama la akaunti yako</p>
              </div>

              <div className="row g-4">
                {/* Password */}
                <div className="col-md-6">
                  <div className="card h-100 border-0 rounded-3" style={{
                    background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                    border: '1px solid rgba(168, 85, 247, 0.1)'
                  }}>
                    <div className="card-body p-4">
                      <label htmlFor="password" className="form-label fw-bold text-dark mb-3">
                        <i className="fas fa-lock me-2 text-purple"></i>
                        Nenosiri <span className="text-danger">*</span>
                      </label>
                      <InputGroup size="lg">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="Ingiza nenosiri salama"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="border-2"
                          style={{
                            borderColor: '#a855f7',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)';
                            e.target.style.borderColor = '#7c3aed';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = '#a855f7';
                          }}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          className="border-2"
                          style={{
                            borderColor: '#a855f7',
                            color: '#7c3aed',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#7c3aed';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#7c3aed';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#7c3aed';
                            e.target.style.borderColor = '#a855f7';
                          }}
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} me-2`}></i>
                          {showPassword ? "Ficha" : "Onyesha"}
                        </Button>
                      </InputGroup>
                      <div className="alert alert-warning border-0 rounded-3 mt-3 py-2" 
                           style={{background: 'linear-gradient(135deg, #fef3c7, #fde68a)'}}>
                        <i className="fas fa-exclamation-triangle me-2 text-amber-600"></i>
                        <small className="text-amber-800 fw-medium">Tunza nenosiri lako salama</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="col-md-6">
                  <div className="card h-100 border-0 rounded-3" style={{
                    background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                    border: '1px solid rgba(168, 85, 247, 0.1)'
                  }}>
                    <div className="card-body p-4">
                      <label htmlFor="confirmPassword" className="form-label fw-bold text-dark mb-3">
                        <i className="fas fa-check-circle me-2 text-purple"></i>
                        Thibitisha Nenosiri <span className="text-danger">*</span>
                      </label>
                      <InputGroup size="lg">
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          placeholder="Rudia nenosiri"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="border-2"
                          style={{
                            borderColor: '#a855f7',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)';
                            e.target.style.borderColor = '#7c3aed';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = '#a855f7';
                          }}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="border-2"
                          style={{
                            borderColor: '#a855f7',
                            color: '#7c3aed',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#7c3aed';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#7c3aed';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#7c3aed';
                            e.target.style.borderColor = '#a855f7';
                          }}
                        >
                          <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} me-2`}></i>
                          {showConfirmPassword ? "Ficha" : "Onyesha"}
                        </Button>
                      </InputGroup>
                      
                      {/* Password Match Indicator */}
                      {formData.password && formData.confirmPassword && (
                        <div className={`alert border-0 rounded-3 mt-3 py-2 ${
                          formData.password === formData.confirmPassword 
                            ? 'alert-success' 
                            : 'alert-danger'
                        }`} style={{
                          background: formData.password === formData.confirmPassword 
                            ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
                            : 'linear-gradient(135deg, #fee2e2, #fecaca)'
                        }}>
                          <i className={`fas ${
                            formData.password === formData.confirmPassword 
                              ? 'fa-check-circle text-green-600' 
                              : 'fa-times-circle text-red-600'
                          } me-2`}></i>
                          <small className={`fw-medium ${
                            formData.password === formData.confirmPassword 
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            {formData.password === formData.confirmPassword 
                              ? 'Nenosiri zinapatana' 
                              : 'Nenosiri hazipatani'}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="col-12">
          <div className="card border-0 shadow-lg rounded-4" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" 
                     style={{
                       width: '80px', 
                       height: '80px',
                       background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                     }}>
                  <i className="fas fa-users-cog text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>
                  Vikundi na Nafasi za Uongozi
                </h2>
                <p className="text-muted mb-4">Chagua vikundi unavyoshiriki na nafasi za kiuongozi</p>
                
                <div className="alert border-0 rounded-3" 
                     style={{background: 'linear-gradient(135deg, #fef3c7, #fde68a)'}}>
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="fas fa-exclamation-triangle me-2 text-amber-600"></i>
                    <small className="text-amber-800 fw-medium">
                      Hakikisha unaingiza vikundi vyote unavyoshiriki au nafasi za kiuongozi
                    </small>
                  </div>
                </div>
              </div>

              {/* Role Selector Component */}
              <div className="p-4 px-0 rounded-3 ms-0" style={{
                background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
               
              }}>
                <RoleSelector
                  userRoles={userRoles}
                  formData={formData}
                  handleRoleChange={handleRoleChange}
                  handleLeadershipPositionsChange={handleLeadershipPositionsChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .text-purple {
          color: #7c3aed !important;
        }
        
        .text-amber-600 {
          color: #d97706 !important;
        }
        
        .text-amber-800 {
          color: #92400e !important;
        }
        
        .text-green-600 {
          color: #059669 !important;
        }
        
        .text-green-800 {
          color: #065f46 !important;
        }
        
        .text-red-600 {
          color: #dc2626 !important;
        }
        
        .text-red-800 {
          color: #991b1b !important;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25) !important;
        }
        
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
      `}</style>
    </div>
  );
};

export default PledgesAndSecurityForm;