

import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddContentModal = ({
  show,
  onClose,
  onAddContent,
  newContent,
  setNewContent,
  contentType,
  setContentType,
}) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add Content</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={newContent.title}
            onChange={(e) => setNewContent((prev) => ({ ...prev, title: e.target.value }))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={newContent.description}
            onChange={(e) => setNewContent((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Content Type</Form.Label>
          <div className="d-flex justify-content-between">
            <Form.Check
              type="radio"
              label="Image"
              name="contentType"
              checked={contentType === "image"}
              onChange={() => {
                setContentType("image");
                setNewContent((prev) => ({ ...prev, videoUrl: "" }));
              }}
            />
            <Form.Check
              type="radio"
              label="Video"
              name="contentType"
              checked={contentType === "video"}
              onChange={() => {
                setContentType("video");
                setNewContent((prev) => ({ ...prev, imageUrl: "" }));
              }}
            />
          </div>
        </Form.Group>
        {contentType === "image" && (
          <Form.Group>
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={newContent.imageUrl}
              onChange={(e) =>
                setNewContent((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
            />
          </Form.Group>
        )}
        {contentType === "video" && (
          <Form.Group>
            <Form.Label>Video URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter video URL"
              value={newContent.videoUrl}
              onChange={(e) =>
                setNewContent((prev) => ({ ...prev, videoUrl: e.target.value }))
              }
            />
          </Form.Group>
        )}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={onAddContent}>
        Add Content
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AddContentModal;
