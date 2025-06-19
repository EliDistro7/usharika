import React from 'react';
import { FaPlusCircle, FaMinusCircle, FaUsers, FaUser, FaCalendarAlt, FaHeart } from "react-icons/fa";

const DependentsForm = ({ dependents, onDependentsChange }) => {
  // Add Dependent
  const addDependent = () => {
    const updatedDependents = [...dependents, { name: "", dob: "", relation: "" }];
    onDependentsChange(updatedDependents);
  };

  // Remove Dependent
  const removeDependent = (index) => {
    const updatedDependents = dependents.filter((dependent, i) => i !== index);
    onDependentsChange(updatedDependents);
  };

  // Handle dependent data change
  const handleDependentChange = (index, field, value) => {
    const updatedDependents = dependents.map((dependent, i) =>
      i === index ? { ...dependent, [field]: value } : dependent
    );
    onDependentsChange(updatedDependents);
  };

  return (
    <div className="container-fluid p-0">
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
              <FaUsers className="text-white" style={{fontSize: '2rem'}} />
            </div>
            <h2 className="fw-bold mb-2" style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}>
              Wategemezi
            </h2>
            <p className="text-muted">Ongeza taarifa za wategemezi wako</p>
          </div>

          {/* Dependents List */}
          <div className="mb-5">
            {dependents.length === 0 ? (
              <div className="text-center py-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style={{
                       width: '60px', 
                       height: '60px',
                       background: 'linear-gradient(135deg, #f3e8ff, #e0e7ff)',
                       border: '2px dashed #a855f7'
                     }}>
                  <FaUsers className="text-purple" style={{fontSize: '1.5rem'}} />
                </div>
                <h5 className="text-muted mb-2">Hakuna Wategemezi</h5>
                <p className="text-muted small">Bofya kitufe cha chini kuongeza mtegemezi</p>
              </div>
            ) : (
              <div className="row g-4">
                {dependents.map((dependent, index) => (
                  <div className="col-12" key={index}>
                    <div className="card border-0 shadow-sm" style={{
                      background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                      borderRadius: '1.5rem',
                      border: '1px solid rgba(168, 85, 247, 0.1)'
                    }}>
                      <div className="card-body p-4">
                        {/* Dependent Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="d-flex align-items-center">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" 
                                 style={{
                                   width: '40px', 
                                   height: '40px',
                                   background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                                 }}>
                              <FaUser className="text-white" style={{fontSize: '1rem'}} />
                            </div>
                            <h5 className="mb-0 fw-bold text-purple">
                              Mtegemezi #{index + 1}
                            </h5>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            onClick={() => removeDependent(index)}
                            style={{
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <FaMinusCircle className="me-2" />
                            Ondoa
                          </button>
                        </div>

                        {/* Form Fields */}
                        <div className="row g-3">
                          {/* Name */}
                          <div className="col-md-6">
                            <label htmlFor={`dependentName${index}`} className="form-label fw-semibold text-dark">
                              <FaUser className="me-2 text-purple" />
                              Jina la Mtegemezi
                            </label>
                            <input
                              type="text"
                              id={`dependentName${index}`}
                              className="form-control form-control-lg rounded-3 border-2"
                              placeholder="Jina la Mtegemezi"
                              value={dependent.name}
                              onChange={(e) => handleDependentChange(index, 'name', e.target.value)}
                              style={{
                                borderColor: '#a855f7',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 255, 255, 0.8)'
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

                          {/* Relation */}
                          <div className="col-md-6">
                            <label htmlFor={`dependentRelation${index}`} className="form-label fw-semibold text-dark">
                              <FaHeart className="me-2 text-purple" />
                              Uhusiano na Msharika
                            </label>
                            <select
                              id={`dependentRelation${index}`}
                              className="form-select form-select-lg rounded-3 border-2"
                              value={dependent.relation}
                              onChange={(e) => handleDependentChange(index, 'relation', e.target.value)}
                              style={{
                                borderColor: '#a855f7',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 255, 255, 0.8)'
                              }}
                              onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(168, 85, 247, 0.25)';
                                e.target.style.borderColor = '#7c3aed';
                              }}
                              onBlur={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = '#a855f7';
                              }}
                            >
                              <option value="">Chagua Uhusiano...</option>
                              <option value="Mke">Mke</option>
                              <option value="Mume">Mume</option>
                              <option value="Mtoto">Mtoto</option>
                              <option value="Binti">Binti</option>
                              <option value="Mama">Mama</option>
                              <option value="Baba">Baba</option>
                              <option value="Kaka">Kaka</option>
                              <option value="Dada">Dada</option>
                              <option value="Mjukuu">Mjukuu</option>
                              <option value="Mwingine">Mwingine</option>
                            </select>
                          </div>

                          {/* Date of Birth */}
                          <div className="col-12">
                            <label htmlFor={`dependentDob${index}`} className="form-label fw-semibold text-dark">
                              <FaCalendarAlt className="me-2 text-purple" />
                              Tarehe ya Kuzaliwa
                            </label>
                            <input
                              type="date"
                              id={`dependentDob${index}`}
                              className="form-control form-control-lg rounded-3 border-2"
                              value={dependent.dob}
                              onChange={(e) => handleDependentChange(index, 'dob', e.target.value)}
                              style={{
                                borderColor: '#a855f7',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 255, 255, 0.8)'
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
                ))}
              </div>
            )}
          </div>

          {/* Add Dependent Button */}
          <div className="text-center">
            <button 
              type="button" 
              className="btn btn-lg px-5 py-3 rounded-pill fw-bold text-white border-0"
              onClick={addDependent}
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
              <FaPlusCircle className="me-2" />
              Ongeza Mtegemezi
            </button>
          </div>

          {/* Info Alert */}
          {dependents.length > 0 && (
            <div className="alert border-0 rounded-3 mt-4" 
                 style={{background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)'}}>
              <div className="d-flex align-items-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" 
                     style={{
                       width: '30px', 
                       height: '30px',
                       background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                     }}>
                  <i className="fas fa-info text-white" style={{fontSize: '0.8rem'}}></i>
                </div>
                <span className="text-primary fw-medium">
                  <small>
                    Umesajili wategemezi {dependents.length}. 
                    Hakikisha taarifa zote ni sahihi kabla ya kuendelea.
                  </small>
                </span>
              </div>
            </div>
          )}
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
        
        .btn-outline-danger:hover {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
        }
        
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
      `}</style>
    </div>
  );
};

export default DependentsForm;