import React, { useState } from "react";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
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
        //console.log("Upload result: ", result);
        setNewContent((prev) => ({ ...prev, [mediaKey]: result.secureUrl }));
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setUploadProgress(0); // Reset progress after upload
      }
    }
  };

  const handleAddContent = () => {
    const mediaUrl =
      contentType === "image" ? newContent.imageUrl : newContent.videoUrl;

    if (mediaUrl) {
      onAddContent(mediaUrl); // Pass only the media URL to the parent
      onClose(); // Close the modal
    } else {
      alert("Ingiza file la media u-upload au ingiza anuani sahihi ya URL.");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ongeza maudhui</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingiza title"
              value={newContent.title}
              onChange={(e) =>
                setNewContent((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Maelezo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={newContent.description}
              onChange={(e) =>
                setNewContent((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Aina ya Media</Form.Label>
            <div className="d-flex justify-content-between">
              <Form.Check
                type="radio"
                label="Image"
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
              />
              <Form.Check
                type="radio"
                label="Video"
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
              />
            </div>
          </Form.Group>
          <Form.Group>
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
          {contentType === "image" && (
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={newContent.imageUrl}
                onChange={(e) =>
                  setNewContent((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
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
                  setNewContent((prev) => ({
                    ...prev,
                    videoUrl: e.target.value,
                  }))
                }
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Funga
        </Button>
        <Button variant="primary" onClick={handleAddContent}>
          Wasilisha
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddContentModal;
