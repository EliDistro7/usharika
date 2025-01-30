

import React, { useState } from "react";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import { uploadToCloudinary } from "@/actions/uploadToCloudinary";

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


  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Content</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="text-danger mb-3">{error}</div>}

        {/* Dropdown for selecting a highlight for the new tab */}
        <Form.Group className="mb-3">
          <Form.Label>Select Highlight</Form.Label>
          <Form.Control
            as="select"
            value={newContent.highlightId || ""}
            onChange={(e) => onContentChange("highlightId", e.target.value)}
          >
            <option value="">Chagua alabamu</option>
            {highlights.map((highlight) => (
              <option key={highlight._id} value={highlight._id}>
                {highlight.name || `Highlight ${highlight._id}`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Dropdown for selecting a tab within the selected highlight */}
        <Form.Group className="mt-3">
          <Form.Label>Jina la Chapter (Tab)</Form.Label>
          <Form.Control
            as="select"
            value={newContent.groupName}
            onChange={(e) => onContentChange("groupName", e.target.value)}
            disabled={!newContent.highlightId}
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
          </Form.Control>
        </Form.Group>

        {/* Input for typing a new group name */}
        <Form.Group className="mt-3">
          <Form.Label>jina la Chapter Mpya</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a new group name"
            value={newContent.newGroupName || ""}
            onChange={(e) => onContentChange("newGroupName", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Maelezo</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newContent.description}
            onChange={(e) => onContentChange("description", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Aina ya Media</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Image"
              name="mediaType"
              checked={newContent.mediaType === "image"}
              onChange={() => onContentChange("mediaType", "image")}
            />
            <Form.Check
              type="radio"
              label="Video"
              name="mediaType"
              checked={newContent.mediaType === "video"}
              onChange={() => onContentChange("mediaType", "video")}
            />
          </div>
        </Form.Group>

        {/* File Upload Section */}
        <Form.Group className="mt-3">
          <Form.Label>Upload Media</Form.Label>
          <Form.Control type="file" onChange={handleFileUpload} />
          {uploadProgress > 0 && (
              <ProgressBar
                animated
                now={uploadProgress}
                label={`${uploadProgress}%`}
                className="mt-2"
              />
            )}
        </Form.Group>

        {/* Display the uploaded media URL */}
        {newContent.mediaType === "image" && (
          <Form.Group className="mt-3">
            <Form.Label>URL ya picha</Form.Label>
            <Form.Control
              type="text"
              value={newContent.imageUrl}
              onChange={(e) => onContentChange("imageUrl", e.target.value)}
            />
          </Form.Group>
        )}
        {newContent.mediaType === "video" && (
          <Form.Group className="mt-3">
            <Form.Label>URL ya video</Form.Label>
            <Form.Control
              type="text"
              value={newContent.videoUrl}
              onChange={(e) => onContentChange("videoUrl", e.target.value)}
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
         Ondoa
        </Button>
        <Button variant="primary" onClick={onAdd}>
          Ongeza kwenye Chapter
        </Button>
        <Button variant="primary" onClick={onAddNewTab} className="ms-2">
          Ongeza chapter mpya
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddContentModal;
