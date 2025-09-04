// components/AddSessionModal.jsx
'use client';

import React, { useState, useRef } from 'react';
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

    // Validate file size (max 200MB)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: 'File size must be less than 200MB',
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

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-background-50 rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-primary-gradient p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <i className="fa fa-plus-circle"></i>
              Add New Session
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <i className="fa fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Field */}
            <div className="space-y-2">
              <label htmlFor="sessionDate" className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                <i className="fa fa-calendar text-primary-600"></i>
                Date
              </label>
              <input
                id="sessionDate"
                type="date"
                name="date"
                value={sessionData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="sessionTitle" className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                <i className="fa fa-heading text-primary-600"></i>
                Title
              </label>
              <input
                id="sessionTitle"
                type="text"
                placeholder="Enter session title"
                name="title"
                value={sessionData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label htmlFor="sessionContent" className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                <i className="fa fa-file-text text-primary-600"></i>
                Content
              </label>
              <textarea
                id="sessionContent"
                rows={4}
                placeholder="Enter session content"
                name="content"
                value={sessionData.content}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
              />
            </div>

            {/* Author Field */}
            <div className="space-y-2">
              <label htmlFor="sessionAuthor" className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                <i className="fa fa-user text-primary-600"></i>
                Author
              </label>
              <input
                id="sessionAuthor"
                type="text"
                placeholder="Enter author name"
                name="author"
                value={sessionData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-medium to-transparent"></div>
              <span className="text-text-secondary text-sm font-medium">Audio (Optional)</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-medium to-transparent"></div>
            </div>

            {/* Audio Upload Section */}
            <div className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 ${
              uploadState.success 
                ? 'bg-success-50 border-success-300' 
                : 'bg-background-100 border-border-accent hover:border-primary-400 hover:bg-background-50'
            }`}>
              <h5 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <i className="fa fa-music text-primary-600"></i>
                Audio Upload
              </h5>
              
              {/* File Upload Section */}
              <div className="space-y-3 mb-4">
                <label className="block text-sm font-medium text-text-primary">Upload Audio File</label>
                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    disabled={uploadState.isUploading}
                    className="px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <i className="fa fa-upload"></i>
                    {uploadState.isUploading ? 'Uploading...' : 'Choose Audio File'}
                  </button>
                  
                  {sessionData.audio.link && (
                    <button
                      type="button"
                      onClick={clearAudioLink}
                      className="px-3 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-all duration-200"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <p className="text-xs text-text-tertiary">
                  Supported formats: MP3, WAV, OGG, M4A (Max 200MB)
                </p>
              </div>

              {/* Upload Progress */}
              {uploadState.isUploading && (
                <div className="mb-4">
                  <div className="w-full bg-background-300 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary-gradient h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-text-secondary mt-1 text-center">{uploadState.progress}%</p>
                </div>
              )}

              {/* Upload Messages */}
              {uploadState.error && (
                <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg flex items-start gap-2">
                  <i className="fa fa-exclamation-triangle text-error-500 mt-0.5"></i>
                  <p className="text-error-700 text-sm">{uploadState.error}</p>
                </div>
              )}

              {uploadState.success && (
                <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center gap-2">
                  <i className="fa fa-check-circle text-success-500"></i>
                  <p className="text-success-700 text-sm">Audio uploaded successfully!</p>
                </div>
              )}

              {/* Manual URL Input */}
              <div className="space-y-2 mb-4">
                <label htmlFor="audioLink" className="block text-sm font-medium text-text-primary">Or Enter Audio URL</label>
                <input
                  id="audioLink"
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  name="audio.link"
                  value={sessionData.audio.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              {/* Audio Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    id="audioIsFree"
                    type="checkbox"
                    name="audio.isFree"
                    checked={sessionData.audio.isFree}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 bg-background-50 border-border-default rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="audioIsFree" className="text-sm font-medium text-text-primary cursor-pointer">
                    Free Audio
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="audioPaidBy" className="block text-sm font-medium text-text-primary">Paid By (User ID)</label>
                  <input
                    id="audioPaidBy"
                    type="text"
                    placeholder="Enter user ID"
                    name="audio.paidBy"
                    value={sessionData.audio.paidBy}
                    onChange={handleChange}
                    disabled={sessionData.audio.isFree}
                    className="w-full px-4 py-2 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-200"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-border-medium text-text-secondary hover:bg-background-100 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <i className="fa fa-times"></i>
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadState.isUploading}
                className="btn-primary px-6 py-3 rounded-lg font-medium text-white shadow-primary hover:shadow-primary-lg transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                <i className="fa fa-save"></i>
                {uploadState.isUploading ? 'Uploading...' : 'Save Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddSessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddSessionModal;