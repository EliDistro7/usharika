'use client';
import React from "react";

const PersonalInfoForm = ({ 
  formData, 
  handleInputChange, 
  handleDateChange, 
  handleImageChange, 
  uploadProgress 
}) => {
  return (
    <div className="container-fluid min-vh-100" style={{
      background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
      padding: '2rem 0'
    }}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow-lg border-0" style={{
            borderRadius: '1.5rem',
            background: 'rgba(255, 255, 255, 0.95)',
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
                  <i className="fas fa-user text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>
                  Taarifa ya Msharika
                </h2>
                <p className="text-muted">Jaza taarifa zako </p>
              </div>

              {/* Profile Picture Upload */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark mb-3">
                  <i className="fas fa-camera me-2 text-purple"></i>
                  Chagua Picha
                </label>
                
                <div className="position-relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="photo"
                    className="position-absolute w-100 h-100 opacity-0"
                    style={{cursor: 'pointer', zIndex: 10}}
                    onChange={handleImageChange}
                  />
                  <div className=" border-2 rounded-4 p-4 text-center" 
                       style={{
                         borderColor: '#a855f7',
                         borderStyle: 'dashed',
                         background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                         minHeight: '120px',
                         cursor: 'pointer'
                       }}>
                    <i className="fas fa-cloud-upload-alt text-purple mb-2" style={{fontSize: '2rem'}}></i>
                    <p className="mb-0 text-muted">Bofya hapa au drag picha yako hapa</p>
                   
                  </div>
                </div>

                {/* Image Preview */}
                {formData.previewUrl && (
                  <div className="text-center mt-4">
                    <div className="position-relative d-inline-block">
                      <img
                        src={formData.previewUrl}
                        alt="Onyesho la Picha"
                        className="rounded-4 shadow-lg border-3"
                        style={{ 
                          maxWidth: "200px", 
                          maxHeight: "200px", 
                          objectFit: "cover",
                          borderColor: '#a855f7 !important'
                        }}
                      />
                      <div className="position-absolute top-0 end-0 translate-middle">
                        <span className="badge bg-success rounded-pill">
                          <i className="fas fa-check"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="mt-3">
                    <div className="progress" style={{height: '8px', borderRadius: '10px'}}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ 
                          width: `${uploadProgress}%`,
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                        }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                      </div>
                    </div>
                    <small className="text-muted mt-1 d-block">Inapakia... {uploadProgress}%</small>
                  </div>
                )}
              </div>

              <div className="row">
                {/* Name */}
                <div className="col-12 mb-4">
                  <label htmlFor="name" className="form-label fw-semibold text-dark">
                    <i className="fas fa-user me-2 text-purple"></i>
                    Jina <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control form-control-lg rounded-3 border-2"
                    onChange={handleInputChange}
                    value={formData.name}
                    placeholder="Jina la Msharika"
                    required
                    style={{
                      borderColor: '#a855f7',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>

                {/* Date of Birth */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="dob" className="form-label fw-semibold text-dark">
                    <i className="fas fa-calendar me-2 text-purple"></i>
                    Tarehe ya Kuzaliwa
                  </label>
                  <input
                    type="date"
                    id="dob"
                    className="form-control form-control-lg rounded-3 border-2"
                    onChange={handleDateChange}
                    value={formData.dob}
                    style={{
                      borderColor: '#a855f7',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="gender" className="form-label fw-semibold text-dark">
                    <i className="fas fa-venus-mars me-2 text-purple"></i>
                    Jinsia
                  </label>
                  <select
                    id="gender"
                    className="form-select form-select-lg rounded-3 border-2"
                    value={formData.gender}
                    onChange={handleInputChange}
                    name="gender"
                    style={{
                      borderColor: '#a855f7',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  >
                    <option value="">Chagua Jinsia...</option>
                    <option value="me">Me</option>
                    <option value="ke">Ke</option>
                  </select>
                </div>
              </div>

              {/* Baptism and Confirmation Checkboxes */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card h-100 border-0 rounded-3" style={{background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)'}}>
                    <div className="card-body d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3 fs-5"
                        id="ubatizo"
                        name="ubatizo"
                        checked={formData.ubatizo}
                        onChange={handleInputChange}
                        style={{accentColor: '#7c3aed'}}
                      />
                      <label htmlFor="ubatizo" className="form-check-label fw-semibold flex-grow-1">
                        <i className="fas fa-cross me-2 text-purple"></i>
                        Umepata Ubatizo?
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 rounded-3" style={{background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)'}}>
                    <div className="card-body d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3 fs-5"
                        id="kipaimara"
                        name="kipaimara"
                        checked={formData.kipaimara}
                        onChange={handleInputChange}
                        style={{accentColor: '#7c3aed'}}
                      />
                      <label htmlFor="kipaimara" className="form-check-label fw-semibold flex-grow-1">
                        <i className="fas fa-hands-praying me-2 text-purple"></i>
                        Umepata Kipaimara?
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marital Status */}
              {formData.gender && (
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="maritalStatus" className="form-label fw-semibold text-dark">
                      <i className="fas fa-heart me-2 text-purple"></i>
                      Ndoa
                    </label>
                    <select
                      id="maritalStatus"
                      className="form-select form-select-lg rounded-3 border-2"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      name="maritalStatus"
                      style={{
                        borderColor: '#a855f7',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    >
                      <option value="">Chagua...</option>
                      {formData.gender === "me" ? (
                        <>
                          <option value="umeoa">Umeoa</option>
                          <option value="hujaoa">Hujaoa</option>
                        </>
                      ) : (
                        <>
                          <option value="umeolewa">Umeolewa</option>
                          <option value="hujaolewa">Hujaolewa</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Marriage Type */}
                  {(formData.maritalStatus === "umeoa" || formData.maritalStatus === "umeolewa") && (
                    <div className="col-md-6">
                      <label htmlFor="marriageType" className="form-label fw-semibold text-dark">
                        <i className="fas fa-ring me-2 text-purple"></i>
                        Aina ya Ndoa
                      </label>
                      <select
                        id="marriageType"
                        className="form-select form-select-lg rounded-3 border-2"
                        value={formData.marriageType}
                        onChange={handleInputChange}
                        name="marriageType"
                        style={{
                          borderColor: '#a855f7',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                      >
                        <option value="">Chagua aina ya ndoa...</option>
                        <option value="Ndoa ya Kikristo">Ndoa ya Kikristo</option>
                        <option value="Ndoa ya Kiserikali">Ndoa ya Kiserikali</option>
                        <option value="Nyingineyo">Nyingineyo</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="row">
                {/* Phone */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="phone" className="form-label fw-semibold text-dark">
                    <i className="fas fa-phone me-2 text-purple"></i>
                    Namba ya Simu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control form-control-lg rounded-3 border-2"
                    placeholder="+255 XXX XXX XXX"
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: '#a855f7',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>

                {/* Occupation */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="occupation" className="form-label fw-semibold text-dark">
                    <i className="fas fa-briefcase me-2 text-purple"></i>
                    Kazi/Occupation <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    className="form-control form-control-lg rounded-3 border-2"
                    placeholder="Kazi ya Msharika"
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: '#a855f7',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>
              </div>

              <div className="alert alert-info border-0 rounded-3 mb-4" 
                   style={{background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)'}}>
                <i className="fas fa-info-circle me-2 text-primary"></i>
                <span className="text-primary fw-medium">
                  <small>Kama ni mwanafunzi ingiza "mwanafunzi"</small>
                </span>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-4">
                <button 
                  type="submit" 
                  className="btn btn-lg px-5 py-3 rounded-pill fw-bold text-white border-0"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
                  }}
                >
                  <i className="fas fa-save me-2"></i>
                  Hifadhi Taarifa
                </button>
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
        
        .form-control:focus,
        .form-select:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25) !important;
        }
        
        .form-check-input:checked {
          background-color: #7c3aed !important;
          border-color: #7c3aed !important;
        }
        
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
      `}</style>
    </div>
  );
};

export default PersonalInfoForm;