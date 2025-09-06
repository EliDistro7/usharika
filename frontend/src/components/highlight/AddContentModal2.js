import React, { useState } from "react";
import { uploadToCloudinary } from "@/actions/uploadToCloudinary";
import { Upload, Image, Video, FileText, Sparkles, X } from "lucide-react";

const AddContentModal = ({
  show,
  error,
  newContent,
  highlights,
  onClose,
  onContentChange,
  onAdd,
  onAddNewTab,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await uploadToCloudinary(file, setUploadProgress);
        const mediaUrlKey =
          newContent.mediaType === "image" ? "imageUrl" : "videoUrl";
        onContentChange(mediaUrlKey, result.secureUrl);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Container */}
        <div className="bg-gradient-to-br from-background-50 to-background-300 rounded-4xl border-0 shadow-primary-lg animate-scale-in">
          
          {/* Header */}
          <div className="bg-primary-gradient text-white rounded-t-4xl px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={24} />
              <h2 className="text-xl font-display font-semibold">Add New Content</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="px-8 py-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-2xl p-4 text-error-700">
                {error}
              </div>
            )}

            {/* Select Highlight */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                <FileText size={16} />
                Select Highlight
              </label>
              <select
                value={newContent.highlightId || ""}
                onChange={(e) => onContentChange("highlightId", e.target.value)}
                className="w-full rounded-xl border-2 border-border-default bg-white/80 px-4 py-3 text-sm transition-all duration-300 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary-600/10"
              >
                <option value="">Chagua alabamu</option>
                {highlights.map((highlight) => (
                  <option key={highlight._id} value={highlight._id}>
                    {highlight.name || `Highlight ${highlight._id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Tab */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                <FileText size={16} />
                Jina la Chapter (Tab)
              </label>
              <select
                value={newContent.groupName}
                onChange={(e) => onContentChange("groupName", e.target.value)}
                disabled={!newContent.highlightId}
                className="w-full rounded-xl border-2 border-border-default bg-white/80 px-4 py-3 text-sm transition-all duration-300 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Au Chagua kutoka chapater zilizopo</option>
                {highlights
                  .filter((h) => h._id === newContent.highlightId)
                  .flatMap((highlight) =>
                    highlight.content.map((tab) => (
                      <option key={tab._id} value={tab.groupName}>
                        {tab.groupName}
                      </option>
                    ))
                  )}
              </select>
            </div>

            {/* New Group Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                <Sparkles size={16} />
                Jina la Chapter Mpya
              </label>
              <input
                type="text"
                placeholder="Enter a new group name"
                value={newContent.newGroupName || ""}
                onChange={(e) => onContentChange("newGroupName", e.target.value)}
                className="w-full rounded-xl border-2 border-border-default bg-white/80 px-4 py-3 text-sm transition-all duration-300 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary-600/10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                <FileText size={16} />
                Maelezo
              </label>
              <textarea
                rows={3}
                value={newContent.description}
                onChange={(e) => onContentChange("description", e.target.value)}
                placeholder="Andika maelezo hapa..."
                className="w-full rounded-xl border-2 border-border-default bg-white/80 px-4 py-3 text-sm transition-all duration-300 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary-600/10 resize-none"
              />
            </div>

            {/* Media Type Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                <Image size={16} />
                Aina ya Media
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => onContentChange("mediaType", "image")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    newContent.mediaType === "image"
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-border-default bg-white/60 text-text-secondary hover:border-primary-300 hover:bg-primary-50/50"
                  }`}
                >
                  <Image size={18} />
                  <span className="font-medium">Image</span>
                  <input
                    type="radio"
                    name="mediaType"
                    checked={newContent.mediaType === "image"}
                    onChange={() => onContentChange("mediaType", "image")}
                    className="ml-auto accent-primary-600"
                  />
                </div>
                <div
                  onClick={() => onContentChange("mediaType", "video")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    newContent.mediaType === "video"
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-border-default bg-white/60 text-text-secondary hover:border-primary-300 hover:bg-primary-50/50"
                  }`}
                >
                  <Video size={18} />
                  <span className="font-medium">Video</span>
                  <input
                    type="radio"
                    name="mediaType"
                    checked={newContent.mediaType === "video"}
                    onChange={() => onContentChange("mediaType", "video")}
                    className="ml-auto accent-primary-600"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                <Upload size={16} />
                Upload Media
              </label>
              <div className="relative border-2 border-dashed border-purple-400 rounded-xl p-6 bg-purple-50/50 text-center transition-all duration-300 hover:border-purple-500 hover:bg-purple-50 cursor-pointer">
                <Upload size={24} className="mx-auto mb-3 text-purple-500" />
                <div className="text-primary-700 mb-2 font-medium">
                  Click to upload or drag and drop
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-primary-700">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary-gradient transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Media URL Inputs */}
            {newContent.mediaType === "image" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                  <Image size={16} />
                  URL ya picha
                </label>
                <input
                  type="text"
                  value={newContent.imageUrl || ""}
                  onChange={(e) => onContentChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border-2 border-border-default bg-white/80 px-4 py-3 text-sm transition-all duration-300 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary-600/10"
                />
              </div>
            )}
            
            {newContent.mediaType === "video" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                  <Video size={16} />
                  URL ya video
                </label>
                <input
                  type="text"
                  value={newContent.videoUrl || ""}
                  onChange={(e) => onContentChange("videoUrl", e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full rounded-xl border-2 border-border-default bg-white/80 px-4 py-3 text-sm transition-all duration-300 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary-600/10"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-background-200/80 border-t border-border-light rounded-b-4xl px-8 py-6 flex flex-wrap gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-border-medium bg-white/60 text-text-secondary font-semibold text-sm transition-all duration-300 hover:bg-white hover:border-border-dark hover:text-text-primary"
            >
              Ondoa
            </button>
            <button
              onClick={onAdd}
              className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Ongeza kwenye Chapter
            </button>
            <button
              onClick={onAddNewTab}
              className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Ongeza chapter mpya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;