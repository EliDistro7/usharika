'use client';

import React, { useState } from "react";
import { Alert, Button, Spinner, Breadcrumb } from "react-bootstrap";
import HighlightNameForm from "@/components/highlight/HighlightNameForm";
import GroupTable from "@/components/highlight/GroupTable";
import AddGroupModal from "@/components/highlight/AddGroupModal";
import AddContentModal from "@/components/highlight/AddContentModal";
import { createHighlight } from "@/actions/highlight";
import RecentHighlightsTable from "@/components/highlight/RecentHighlightsTable";

const HighlightDataPage = () => {
  const [highlight, setHighlight] = useState({
    name: "",
    content: [],
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
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddGroup = () => {
    if (!newGroupName) {
      setError("Group name cannot be empty!");
      return;
    }
    setHighlight((prev) => ({
      ...prev,
      content: [...prev.content, { groupName: newGroupName, content: [] }],
    }));
    setNewGroupName("");
    setShowGroupModal(false);
    setSuccess("Group added successfully!");
  };

  const handleAddContent = () => {
    if (selectedGroupIndex === null) return;
    setHighlight((prev) => {
      const updatedContent = [...prev.content];
      updatedContent[selectedGroupIndex].content.push(newContent);
      return { ...prev, content: updatedContent };
    });
    setNewContent({ title: "", description: "", imageUrl: "" });
    setShowContentModal(false);
    setSuccess("Content added successfully!");
  };

  const handleRemoveGroup = (index) => {
    setHighlight((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
    setSuccess("Group removed successfully!");
  };

  const handleRemoveContent = (groupIndex, contentIndex) => {
    setHighlight((prev) => {
      const updatedContent = [...prev.content];
      updatedContent[groupIndex].content = updatedContent[groupIndex].content.filter(
        (_, i) => i !== contentIndex
      );
      return { ...prev, content: updatedContent };
    });
    setSuccess("Content removed successfully!");
  };

  const handleSubmitHighlight = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const response = await createHighlight(highlight);
      setSuccess(response.message || "Highlight created successfully!");
      setHighlight({ name: "", content: [] }); // Reset the form
    } catch (err) {
      setError(err.message || "Failed to create highlight. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-4">
      <h2>Manage Highlight Data</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <Breadcrumb.Item
          active={view === "create"}
          onClick={() => setView("create")}
        >
          Create Highlight
        </Breadcrumb.Item>
        <Breadcrumb.Item
          active={view === "view"}
          onClick={() => setView("view")}
        >
          View Recent Highlights
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
              Add Group
            </Button>
            <Button
              variant="success"
              onClick={handleSubmitHighlight}
              disabled={!highlight.name || highlight.content.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Submit Highlight"
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
  );
};

export default HighlightDataPage;
