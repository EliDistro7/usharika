import React, { useState } from "react";
import { uploadToCloudinary } from "@/actions/uploadToCloudinary";

const AddContentModal = ({
  show,
  onClose,
  onAddContent,
  newContent,
  setNewContent,
  contentType,
  setContentType,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await uploadToCloudinary(file, setUploadProgress);
        const mediaKey = contentType === "image" ? "imageUrl" : "videoUrl";
        setNewContent((prev) => ({ ...prev, [mediaKey]: result.secureUrl }));
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setUploadProgress(0);
      }
    }
  };

  const handleAddContent = () => {
    const mediaUrl =
      contentType === "image" ? newContent.imageUrl : newContent.videoUrl;

    if (mediaUrl) {
      onAddContent(mediaUrl);
      onClose();
    } else {
      alert("Ingiza file la media u-upload au ingiza anuani sahihi ya URL.");
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-3xl shadow-strong max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Modal Header */}
          <div className="bg-primary-gradient px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center space-x-3">
                <span className="text-3xl">📎</span>
                <span>Ongeza Maudhui</span>
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <span className="text-xl font-bold">✕</span>
              </button>
            </div>
            <p className="text-purple-100 mt-2 text-sm">
              Ongeza picha au video kwenye chapter yako
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary flex items-center space-x-2">
                <span className="text-lg">📝</span>
                <span>Maelezo</span>
              </label>
              <input
                type="text"
                placeholder="Ingiza maelezo ya maudhui..."
                value={newContent.description}
                onChange={(e) =>
                  setNewContent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-text-primary placeholder-text-tertiary"
              />
            </div>

            {/* Media Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-text-primary flex items-center space-x-2">
                <span className="text-lg">🎬</span>
                <span>Aina ya Media</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contentType"
                    checked={contentType === "image"}
                    onChange={() => {
                      setContentType("image");
                      setNewContent((prev) => ({
                        ...prev,
                        videoUrl: "",
                        imageUrl: prev.imageUrl || "",
                      }));
                    }}
                    className="w-5 h-5 text-primary-600 border-2 border-border-medium focus:ring-primary-200 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🖼️</span>
                    <span className="font-medium text-text-primary">Picha</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contentType"
                    checked={contentType === "video"}
                    onChange={() => {
                      setContentType("video");
                      setNewContent((prev) => ({
                        ...prev,
                        imageUrl: "",
                        videoUrl: prev.videoUrl || "",
                      }));
                    }}
                    className="w-5 h-5 text-primary-600 border-2 border-border-medium focus:ring-primary-200 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🎥</span>
                    <span className="font-medium text-text-primary">Video</span>
                  </div>
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-text-primary flex items-center space-x-2">
                <span className="text-lg">⬆️</span>
                <span>Upload Media</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept={contentType === "image" ? "image/*" : "video/*"}
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-border-medium hover:border-primary-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-gradient file:text-white file:font-medium file:cursor-pointer cursor-pointer"
                />
              </div>
              
              {/* Upload Progress Bar */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Inapakia...</span>
                    <span className="font-semibold text-primary-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-background-300 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary-gradient transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Image URL Input */}
            {contentType === "image" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary flex items-center space-x-2">
                  <span className="text-lg">🔗</span>
                  <span>URL ya Picha</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/picha.jpg"
                  value={newContent.imageUrl}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-text-primary placeholder-text-tertiary"
                />
                {/* Image Preview */}
                {newContent.imageUrl && (
                  <div className="mt-3 p-3 bg-background-100 rounded-xl">
                    <p className="text-sm text-text-secondary mb-2">Hakiki:</p>
                    <img
                      src={newContent.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-border-light"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Video URL Input */}
            {contentType === "video" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary flex items-center space-x-2">
                  <span className="text-lg">🔗</span>
                  <span>URL ya Video</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={newContent.videoUrl}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      videoUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-text-primary placeholder-text-tertiary"
                />
                {/* Video Preview */}
                {newContent.videoUrl && (
                  <div className="mt-3 p-3 bg-background-100 rounded-xl">
                    <p className="text-sm text-text-secondary mb-2">Hakiki:</p>
                    <video
                      src={newContent.videoUrl}
                      className="w-full h-32 rounded-lg border border-border-light"
                      controls
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 bg-background-100 border-t border-border-light flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-text-secondary border-2 border-border-medium hover:border-border-dark hover:text-text-primary transition-all duration-200 hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <span>❌</span>
                <span>Funga</span>
              </span>
            </button>
            
            <button
              onClick={handleAddContent}
              disabled={uploadProgress > 0}
              className={`
                px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200
                ${uploadProgress > 0
                  ? 'bg-border-medium text-text-tertiary cursor-not-allowed'
                  : 'btn-primary text-white hover:shadow-primary-lg hover:scale-105'
                }
              `}
            >
              <span>🚀</span>
              <span>{uploadProgress > 0 ? 'Inapakia...' : 'Wasilisha'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContentModal;