import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddContentModal = ({
  show,
  error,
  newContent,
  highlights,
  onClose,
  onContentChange,
  onAdd,
  onAddNewTab,
}) => (
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
          <option value="">Select a Highlight</option>
          {highlights.map((highlight) => (
            <option key={highlight._id} value={highlight._id}>
              {highlight.name || `Highlight ${highlight._id}`}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Dropdown for selecting a tab within the selected highlight */}
      <Form.Group className="mt-3">
        <Form.Label>Group Name (Tab)</Form.Label>
        <Form.Control
          as="select"
          value={newContent.groupName}
          onChange={(e) => onContentChange("groupName", e.target.value)}
          disabled={!newContent.highlightId}
        >
          <option value="">Select Group</option>
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
        <Form.Label>New Group Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a new group name"
          value={newContent.newGroupName || ""}
          onChange={(e) => onContentChange("newGroupName", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={newContent.title}
          onChange={(e) => onContentChange("title", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={newContent.description}
          onChange={(e) => onContentChange("description", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>Media Type</Form.Label>
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

      {newContent.mediaType === "image" && (
        <Form.Group className="mt-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={newContent.imageUrl}
            onChange={(e) => onContentChange("imageUrl", e.target.value)}
          />
        </Form.Group>
      )}
      {newContent.mediaType === "video" && (
        <Form.Group className="mt-3">
          <Form.Label>Video URL</Form.Label>
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
        Cancel
      </Button>
      <Button variant="primary" onClick={onAdd}>
        Add to Tab
      </Button>
      <Button variant="primary" onClick={onAddNewTab} className="ms-2">
        Add New Tab
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AddContentModal;
