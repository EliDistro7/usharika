'use client';

import React, { useState, useEffect } from "react";
import HighlightNameForm from "@/components/highlight/HighlightNameForm";
import GroupTable from "@/components/highlight/GroupTable";
import AddGroupModal from "@/components/highlight/AddGroupModal";
import AddContentModal from "@/components/highlight/AddContentModal";
import { createHighlight } from "@/actions/highlight";
import RecentHighlightsTable from "@/components/highlight/RecentHighlightsTable";
import CustomNavbar from "@/components/admins/CustomNavbar";
import Cookies from "js-cookie";

const HighlightDataPage = () => {
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const role1 = Cookies.get("role");
    setRole(role1);
  }, []);

  const [highlight, setHighlight] = useState({
    name: "",
    content: [],
    author: role || "",
  });

  const [view, setView] = useState("create");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [contentType, setContentType] = useState("image");
  const [showContentModal, setShowContentModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    author: role || "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddGroup = () => {
    if (!newGroupName) {
      setError("Jaza chapter ili utume!");
      return;
    }
    setHighlight((prev) => ({
      ...prev,
      content: [...prev.content, { groupName: newGroupName, content: [] }],
    }));
    setNewGroupName("");
    setShowGroupModal(false);
    setSuccess("Umefanikiwa kuongeza chapter!");
  };

  const handleAddContent = (uploadedMediaUrl = null) => {
    if (selectedGroupIndex === null) return;

    const contentToAdd = {
      ...newContent,
      author: role || "",
    };

    if (uploadedMediaUrl) {
      if (contentType === "image") {
        contentToAdd.imageUrl = uploadedMediaUrl;
      } else if (contentType === "video") {
        contentToAdd.videoUrl = uploadedMediaUrl;
      }
    }

    setHighlight((prev) => {
      const updatedContent = [...prev.content];
      updatedContent[selectedGroupIndex].content.push(contentToAdd);
      return { ...prev, content: updatedContent };
    });
    setNewContent({ title: "", description: "", imageUrl: "", videoUrl: "", author: role || "" });
    setShowContentModal(false);
    setSuccess("Umefanikiwa kuongeza maudhui.");
  };

  const handleRemoveGroup = (index) => {
    setHighlight((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
    setSuccess("Umefanikiwa kuondoa chapter");
  };

  const handleRemoveContent = (groupIndex, contentIndex) => {
    setHighlight((prev) => {
      const updatedContent = [...prev.content];
      updatedContent[groupIndex].content = updatedContent[groupIndex].content.filter(
        (_, i) => i !== contentIndex
      );
      return { ...prev, content: updatedContent };
    });
    setSuccess("Umefanikiwa kuondoa maudhui");
  };

  const handleSubmitHighlight = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const highlightToSubmit = { ...highlight, author: role };
      const response = await createHighlight(highlightToSubmit);
      setSuccess(response.message || "Umefanikiwa kuunda album mpya!");
      setHighlight({ name: "", content: [], author: role });
    } catch (err) {
      console.error("Error creating highlight:", err.response?.data || err.message);
      setError(err.message || "Haukufanikiwa kuunda albamu mpya. Tafadhali jaribu tena.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "create", label: "Unda Albamu mpya", icon: "📸" },
    { id: "view", label: "Albamu za Hivi karibuni", icon: "📚" }
  ];

  return (
    <div className="min-h-screen bg-background-50">
      <CustomNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-2 flex items-center space-x-3">
            <span className="text-5xl">📖</span>
            <span>Kitabu cha Albamu</span>
          </h1>
          <p className="text-text-secondary text-lg ml-16">
            Unda na dhibiti albamu za picha na video
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-error-50 border-l-4 border-error-500 p-4 rounded-r-xl shadow-soft">
              <div className="flex items-center">
                <span className="text-error-500 text-xl mr-3">⚠️</span>
                <p className="text-error-700 font-medium">{error}</p>
                <button 
                  onClick={() => setError("")}
                  className="ml-auto text-error-400 hover:text-error-600 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-success-50 border-l-4 border-success-500 p-4 rounded-r-xl shadow-soft">
              <div className="flex items-center">
                <span className="text-success-500 text-xl mr-3">✅</span>
                <p className="text-success-700 font-medium">{success}</p>
                <button 
                  onClick={() => setSuccess("")}
                  className="ml-auto text-success-400 hover:text-success-600 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-2xl p-2 shadow-soft border border-border-light">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`
                  flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 ease-out
                  ${view === tab.id 
                    ? 'bg-primary-gradient text-white shadow-primary transform scale-105' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-200 hover:scale-102'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-medium border border-border-light overflow-hidden">
          
          {view === "create" && (
            <div className="p-8 animate-fade-in">
              {/* Section Header */}
              <div className="mb-8 pb-6 border-b border-border-light">
                <h2 className="text-2xl font-display font-bold text-text-primary flex items-center space-x-3">
                  <span className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white text-xl">
                    📸
                  </span>
                  <span>Unda Albamu Mpya</span>
                </h2>
                <p className="text-text-secondary mt-2 ml-15">
                  Jaza jina la albamu na ongeza maudhui yako
                </p>
              </div>

              {/* Highlight Name Form */}
              <div className="mb-8">
                <HighlightNameForm
                  name={highlight.name}
                  setName={(name) => setHighlight((prev) => ({ ...prev, name }))}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <button
                  onClick={() => setShowGroupModal(true)}
                  className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2 text-white font-semibold"
                >
                  <span className="text-lg">➕</span>
                  <span>Ongeza Chapter</span>
                </button>

                <button
                  onClick={handleSubmitHighlight}
                  disabled={!highlight.name || highlight.content.length === 0 || isSubmitting}
                  className={`
                    px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300
                    ${(!highlight.name || highlight.content.length === 0 || isSubmitting)
                      ? 'bg-border-medium text-text-tertiary cursor-not-allowed'
                      : 'btn-success text-white hover:shadow-green-lg'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Inatumwa...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🚀</span>
                      <span>Wasilisha</span>
                    </>
                  )}
                </button>
              </div>

              {/* Group Table */}
              <div className="bg-background-100 rounded-2xl p-6">
                <GroupTable
                  content={highlight.content}
                  onAddContent={(groupIndex) => {
                    setSelectedGroupIndex(groupIndex);
                    setShowContentModal(true);
                  }}
                  onRemoveGroup={handleRemoveGroup}
                />
              </div>
            </div>
          )}

          {view === "view" && (
            <div className="p-8 animate-fade-in">
              {/* Section Header */}
              <div className="mb-8 pb-6 border-b border-border-light">
                <h2 className="text-2xl font-display font-bold text-text-primary flex items-center space-x-3">
                  <span className="w-12 h-12 bg-yellow-gradient rounded-xl flex items-center justify-center text-white text-xl">
                    📚
                  </span>
                  <span>Albamu za Hivi Karibuni</span>
                </h2>
                <p className="text-text-secondary mt-2 ml-15">
                  Angalia na dhibiti albamu zako za hivi karibuni
                </p>
              </div>

              {/* Recent Highlights Table */}
              <div className="bg-background-100 rounded-2xl p-6">
                <RecentHighlightsTable
                  onEdit={(id) => console.log("Edit:", id)}
                  onDelete={(id) => console.log("Delete:", id)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats Card */}
        <div className="mt-8 bg-primary-gradient rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg mb-1">
                Takwimu za Albamu
              </h3>
              <p className="text-purple-100 text-sm">
                Jumla ya Chapters: {highlight.content.length} | 
                Maudhui: {highlight.content.reduce((total, group) => total + group.content.length, 0)}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddGroupModal
          show={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          onAddGroup={handleAddGroup}
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
        />

        <AddContentModal
          show={showContentModal}
          onClose={() => setShowContentModal(false)}
          onAddContent={handleAddContent}
          newContent={newContent}
          setNewContent={setNewContent}
          contentType={contentType}
          setContentType={setContentType}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          uploadError={uploadError}
          setUploadError={setUploadError}
        />
      </div>
    </div>
  );
};

export default HighlightDataPage;