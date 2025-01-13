'use client';

import React, { useState, useEffect } from "react";
import { Alert, Button, Spinner, Breadcrumb } from "react-bootstrap";
import HighlightNameForm from "@/components/highlight/HighlightNameForm";
import GroupTable from "@/components/highlight/GroupTable";
import AddGroupModal from "@/components/highlight/AddGroupModal";
import AddContentModal from "@/components/highlight/AddContentModal";
import { createHighlight } from "@/actions/highlight";
import RecentHighlightsTable from "@/components/highlight/RecentHighlightsTable";
import CustomNavbar from "@/components/admins/CustomNavbar";
import Cookies from "js-cookie";

const HighlightDataPage = () => {
   const [role, setRole]= useState('');
   useEffect(()=>{
    const role1 = Cookies.get("role"); // Get the role from cookies
    setRole(role1); // Set the role in state

   })

  const [highlight, setHighlight] = useState({
    name: "",
    content: [],
    author: role || "", // Initialize with the role from cookies
  });

  const [view, setView] = useState("create"); // 'create' or 'view'
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
    author: role || "", // Include author in new content initialization
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
      author: role || "", // Ensure author is set for the content
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
      const highlightToSubmit = { ...highlight, author:role }; // Ensure author is included
      console.log("Submitting highlight with author", highlightToSubmit.author);

      const response = await createHighlight(highlightToSubmit);
      setSuccess(response.message || "Umefanikiwa kuunda album mpya!");
      setHighlight({ name: "", content: [], author }); // Reset;
    } catch (err) {
      console.error("Error creating highlight:", err.response?.data || err.message);
      setError(err.message || "Haukufanikiwa kuunda albamu mpya. Tafadhali jaribu tena.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-0 px-0">
      <CustomNavbar />
      <div className="px-4">

      <h2>Status Book</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <Breadcrumb.Item
          active={view === "create"}
          onClick={() => setView("create")}
        >
          Unda Albamu mpya
        </Breadcrumb.Item>
        <Breadcrumb.Item
          active={view === "view"}
          onClick={() => setView("view")}
        >
          Albamu za Hivi karibuni
        </Breadcrumb.Item>
      </Breadcrumb>

      {view === "create" && (
        <>
          <HighlightNameForm
            name={highlight.name}
            setName={(name) => setHighlight((prev) => ({ ...prev, name }))}
          />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="primary" onClick={() => setShowGroupModal(true)}>
              Ongeza chapter
            </Button>
            <Button
              variant="success"
              onClick={handleSubmitHighlight}
              disabled={!highlight.name || highlight.content.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Wasilisha"
              )}
            </Button>
          </div>

          <GroupTable
            content={highlight.content}
            onAddContent={(groupIndex) => {
              setSelectedGroupIndex(groupIndex);
              setShowContentModal(true);
            }}
            onRemoveGroup={handleRemoveGroup}
          />

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
        </>
      )}

      {view === "view" && (
        <RecentHighlightsTable
          onEdit={(id) => console.log("Edit:", id)} // Implement edit logic
          onDelete={(id) => console.log("Delete:", id)} // Implement delete logic
        />
      )}
      </div>
    </div>
  );
};

export default HighlightDataPage;
