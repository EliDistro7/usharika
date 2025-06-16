// components/AddSessionModal.jsx
'use client';

import React, { useState, useRef } from 'react';
import { Modal, Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { uploadToCloudinary } from '@/actions/uploadToCloudinary2';

const AddSessionModal = ({ show, handleClose, onSubmit }) => {
  const [sessionData, setSessionData] = useState({
    date: '',
    title: '',
    content: '',
    author: '',
    audio: {
      link: '',
      isFree: true,
      paidBy: ''
    }
  });

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the field is part of the audio object, the name will start with "audio."
    if (name.startsWith('audio.')) {
      const audioField = name.split('.')[1];
      setSessionData((prev) => ({
        ...prev,
        audio: {
          ...prev.audio,
          [audioField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSessionData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

 // Updated audio file validation with expanded format support
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type (audio files only) - Expanded list
  const allowedTypes = [
    // Common compressed formats
    'audio/mp3',
    'audio/mpeg',
    'audio/mp4',
    'audio/m4a',
    'audio/aac',
    
    // Uncompressed formats
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    
    // Open source formats
    'audio/ogg',
    'audio/oga',
    'audio/opus',
    'audio/flac',
    
    // Legacy/Other formats
    'audio/wma',
    'audio/amr',
    'audio/3gpp',
    'audio/webm',
    'audio/x-ms-wma',
    'audio/x-flac',
    'audio/x-m4a',
    'audio/x-aac',
    
    // Additional MIME types that browsers might use
    'audio/mp4a-latm',
    'audio/x-mpeg',
    'audio/x-mp3'
  ];

  if (!allowedTypes.includes(file.type)) {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: 'Please select a valid audio file (MP3, WAV, OGG, M4A, AAC, FLAC, OPUS, WMA, WebM, AMR)',
      success: false
    });
    return;
  }

  // Validate file size (max 50MB)
  const maxSize = 200 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: 'File size must be less than 50MB',
      success: false
    });
    return;
  }

  setUploadState({
    isUploading: true,
    progress: 0,
    error: null,
    success: false
  });

  try {
    const result = await uploadToCloudinary(file, (progress) => {
      setUploadState(prev => ({ ...prev, progress }));
    });

    setSessionData(prev => ({
      ...prev,
      audio: {
        ...prev.audio,
        link: result.secureUrl
      }
    }));

    setUploadState({
      isUploading: false,
      progress: 100,
      error: null,
      success: true
    });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setUploadState(prev => ({ ...prev, success: false }));
    }, 3000);

  } catch (error) {
    console.error('Upload failed:', error);
    setUploadState({
      isUploading: false,
      progress: 0,
      error: 'Upload failed. Please try again.',
      success: false
    });
  }
};

  const clearAudioLink = () => {
    setSessionData(prev => ({
      ...prev,
      audio: {
        ...prev.audio,
        link: ''
      }
    }));
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass sessionData back to the parent component
    onSubmit(sessionData);
    // Reset form state
    setSessionData({
      date: '',
      title: '',
      content: '',
      author: '',
      audio: {
        link: '',
        isFree: true,
        paidBy: ''
      }
    });
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    handleClose();
  };

  const modalStyles = {
    '--bs-modal-header-bg': '#8b5cf6',
    '--bs-modal-header-color': '#ffffff',
    '--bs-modal-header-border-color': '#7c3aed',
  };

  return (
    <>
      <style jsx>{`
        .purple-theme .modal-header {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-bottom: 2px solid #7c3aed;
        }
        
        .purple-theme .modal-header .btn-close {
          filter: brightness(0) invert(1);
        }
        
        .purple-theme .modal-body {
          background: #faf8ff;
        }
        
        .purple-theme .form-label {
          color: #6b21a8;
          font-weight: 600;
        }
        
        .purple-theme .form-control:focus,
        .purple-theme .form-select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25);
        }
        
        .purple-theme .form-check-input:checked {
          background-color: #8b5cf6;
          border-color: #8b5cf6;
        }
        
        .purple-theme .form-check-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25);
        }
        
        .btn-purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border: none;
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .btn-purple:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6b21a8 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          color: white;
        }
        
        .btn-purple:active {
          transform: translateY(0);
        }
        
        .btn-outline-purple {
          border: 2px solid #8b5cf6;
          color: #8b5cf6;
          background: transparent;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .btn-outline-purple:hover {
          background: #8b5cf6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .audio-upload-section {
          background: white;
          border: 2px dashed #c4b5fd;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 1rem 0;
          transition: all 0.3s ease;
        }
        
        .audio-upload-section:hover {
          border-color: #8b5cf6;
          background: #f3f4f6;
        }
        
        .upload-success {
          background: #dcfce7;
          border-color: #22c55e;
          color: #166534;
        }
        
        .section-divider {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c4b5fd, transparent);
          margin: 2rem 0;
        }
        
        .progress {
          height: 8px;
          border-radius: 4px;
        }
        
        .progress-bar {
          background: linear-gradient(90deg, #8b5cf6, #7c3aed);
        }
      `}</style>
      
      <Modal show={show} onHide={handleClose} className="purple-theme" style={modalStyles}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-plus-circle me-2"></i>
            Add New Session
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="sessionDate" className="mb-3">
              <Form.Label>
                <i className="fa fa-calendar me-2"></i>Date
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={sessionData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="sessionTitle" className="mb-3">
              <Form.Label>
                <i className="fa fa-heading me-2"></i>Title
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter session title"
                name="title"
                value={sessionData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="sessionContent" className="mb-3">
              <Form.Label>
                <i className="fa fa-file-text me-2"></i>Content
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter session content"
                name="content"
                value={sessionData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="sessionAuthor" className="mb-3">
              <Form.Label>
                <i className="fa fa-user me-2"></i>Author
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author name"
                name="author"
                value={sessionData.author}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <hr className="section-divider" />

            <div className={`audio-upload-section ${uploadState.success ? 'upload-success' : ''}`}>
              <h5 className="mb-3" style={{ color: '#6b21a8' }}>
                <i className="fa fa-music me-2"></i>Audio (Optional)
              </h5>
              
              {/* File Upload Section */}
              <div className="mb-3">
                <Form.Label>Upload Audio File</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  <Button 
                    type="button" 
                    className="btn-outline-purple"
                    onClick={handleFileSelect}
                    disabled={uploadState.isUploading}
                  >
                    <i className="fa fa-upload me-2"></i>
                    {uploadState.isUploading ? 'Uploading...' : 'Choose Audio File'}
                  </Button>
                  
                  {sessionData.audio.link && (
                    <Button 
                      type="button" 
                      variant="outline-danger"
                      size="sm"
                      onClick={clearAudioLink}
                    >
                      <i className="fa fa-times"></i>
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                <Form.Text className="text-muted">
                  Supported formats: MP3, WAV, OGG, M4A (Max 50MB)
                </Form.Text>
              </div>

              {/* Upload Progress */}
              {uploadState.isUploading && (
                <div className="mb-3">
                  <ProgressBar 
                    now={uploadState.progress} 
                    label={`${uploadState.progress}%`}
                    animated
                  />
                </div>
              )}

              {/* Upload Messages */}
              {uploadState.error && (
                <Alert variant="danger" className="mb-3">
                  <i className="fa fa-exclamation-triangle me-2"></i>
                  {uploadState.error}
                </Alert>
              )}

              {uploadState.success && (
                <Alert variant="success" className="mb-3">
                  <i className="fa fa-check-circle me-2"></i>
                  Audio uploaded successfully!
                </Alert>
              )}

              {/* Manual URL Input */}
              <Form.Group controlId="audioLink" className="mb-3">
                <Form.Label>Or Enter Audio URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  name="audio.link"
                  value={sessionData.audio.link}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="audioIsFree" className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Free Audio"
                      name="audio.isFree"
                      checked={sessionData.audio.isFree}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
                
                <div className="col-md-6">
                  <Form.Group controlId="audioPaidBy" className="mb-3">
                    <Form.Label>Paid By (User ID)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter user ID"
                      name="audio.paidBy"
                      value={sessionData.audio.paidBy}
                      onChange={handleChange}
                      disabled={sessionData.audio.isFree}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline-secondary"
                onClick={handleClose}
              >
                <i className="fa fa-times me-2"></i>Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-purple"
                disabled={uploadState.isUploading}
              >
                <i className="fa fa-save me-2"></i>
                {uploadState.isUploading ? 'Uploading...' : 'Save Session'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

AddSessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddSessionModal;