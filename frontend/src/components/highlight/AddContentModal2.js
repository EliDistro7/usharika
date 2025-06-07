import React, { useState } from "react";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import { uploadToCloudinary } from "@/actions/uploadToCloudinary";
import { Upload, Image, Video, FileText, Sparkles } from "lucide-react";

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

  const customStyles = {
    modal: {
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
      borderRadius: '20px',
      border: 'none',
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)',
    },
    header: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      color: 'white',
      borderRadius: '20px 20px 0 0',
      border: 'none',
      padding: '20px 30px',
    },
    body: {
      padding: '30px',
      background: 'transparent',
    },
    footer: {
      background: 'rgba(248, 249, 255, 0.8)',
      borderTop: '1px solid rgba(124, 58, 237, 0.1)',
      borderRadius: '0 0 20px 20px',
      padding: '20px 30px',
    },
    formGroup: {
      marginBottom: '25px',
    },
    label: {
      color: '#4c1d95',
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    input: {
      borderRadius: '12px',
      border: '2px solid #e0e7ff',
      padding: '12px 16px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      ':focus': {
        borderColor: '#7c3aed',
        boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)',
        background: 'white',
      }
    },
    radioGroup: {
      display: 'flex',
      gap: '20px',
      marginTop: '10px',
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      borderRadius: '12px',
      border: '2px solid #e0e7ff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.6)',
      flex: 1,
    },
    radioActive: {
      borderColor: '#7c3aed',
      background: 'rgba(124, 58, 237, 0.1)',
      color: '#4c1d95',
    },
    uploadArea: {
      border: '2px dashed #a855f7',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      background: 'rgba(168, 85, 247, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    button: {
      borderRadius: '12px',
      padding: '12px 24px',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      border: 'none',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
    },
    secondaryButton: {
      background: 'rgba(124, 58, 237, 0.1)',
      color: '#7c3aed',
      border: '2px solid #e0e7ff',
    },
    errorAlert: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '15px',
      color: '#dc2626',
      marginBottom: '20px',
    },
    progressBar: {
      background: 'rgba(124, 58, 237, 0.1)',
      borderRadius: '10px',
      height: '8px',
      overflow: 'hidden',
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose}
      centered
      size="lg"
      contentClassName="border-0"
    >
      <div style={customStyles.modal}>
        <Modal.Header closeButton style={customStyles.header}>
          <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} />
            Add New Content
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={customStyles.body}>
          {error && (
            <div style={customStyles.errorAlert}>
              {error}
            </div>
          )}

          {/* Dropdown for selecting a highlight */}
          <Form.Group style={customStyles.formGroup}>
            <Form.Label style={customStyles.label}>
              <FileText size={16} />
              Select Highlight
            </Form.Label>
            <Form.Control
              as="select"
              value={newContent.highlightId || ""}
              onChange={(e) => onContentChange("highlightId", e.target.value)}
              style={customStyles.input}
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
          <Form.Group style={customStyles.formGroup}>
            <Form.Label style={customStyles.label}>
              <FileText size={16} />
              Jina la Chapter (Tab)
            </Form.Label>
            <Form.Control
              as="select"
              value={newContent.groupName}
              onChange={(e) => onContentChange("groupName", e.target.value)}
              disabled={!newContent.highlightId}
              style={customStyles.input}
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
          <Form.Group style={customStyles.formGroup}>
            <Form.Label style={customStyles.label}>
              <Sparkles size={16} />
              Jina la Chapter Mpya
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a new group name"
              value={newContent.newGroupName || ""}
              onChange={(e) => onContentChange("newGroupName", e.target.value)}
              style={customStyles.input}
            />
          </Form.Group>

          {/* Description */}
          <Form.Group style={customStyles.formGroup}>
            <Form.Label style={customStyles.label}>
              <FileText size={16} />
              Maelezo
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newContent.description}
              onChange={(e) => onContentChange("description", e.target.value)}
              style={customStyles.input}
              placeholder="Andika maelezo hapa..."
            />
          </Form.Group>

          {/* Media Type Selection */}
          <Form.Group style={customStyles.formGroup}>
            <Form.Label style={customStyles.label}>
              <Image size={16} />
              Aina ya Media
            </Form.Label>
            <div style={customStyles.radioGroup}>
              <div 
                style={{
                  ...customStyles.radioOption,
                  ...(newContent.mediaType === "image" ? customStyles.radioActive : {})
                }}
                onClick={() => onContentChange("mediaType", "image")}
              >
                <Image size={18} />
                <span>Image</span>
                <Form.Check
                  type="radio"
                  name="mediaType"
                  checked={newContent.mediaType === "image"}
                  onChange={() => onContentChange("mediaType", "image")}
                  style={{ marginLeft: 'auto' }}
                />
              </div>
              <div 
                style={{
                  ...customStyles.radioOption,
                  ...(newContent.mediaType === "video" ? customStyles.radioActive : {})
                }}
                onClick={() => onContentChange("mediaType", "video")}
              >
                <Video size={18} />
                <span>Video</span>
                <Form.Check
                  type="radio"
                  name="mediaType"
                  checked={newContent.mediaType === "video"}
                  onChange={() => onContentChange("mediaType", "video")}
                  style={{ marginLeft: 'auto' }}
                />
              </div>
            </div>
          </Form.Group>

          {/* File Upload Section */}
          <Form.Group style={customStyles.formGroup}>
            <Form.Label style={customStyles.label}>
              <Upload size={16} />
              Upload Media
            </Form.Label>
            <div style={customStyles.uploadArea}>
              <Upload size={24} color="#a855f7" style={{ marginBottom: '10px' }} />
              <div style={{ color: '#7c3aed', marginBottom: '10px' }}>
                Click to upload or drag and drop
              </div>
              <Form.Control 
                type="file" 
                onChange={handleFileUpload}
                style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
              />
            </div>
            {uploadProgress > 0 && (
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: '#7c3aed' }}>Uploading...</span>
                  <span style={{ fontSize: '12px', color: '#7c3aed' }}>{uploadProgress}%</span>
                </div>
                <div style={customStyles.progressBar}>
                  <div 
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)',
                      transition: 'width 0.3s ease',
                      borderRadius: '10px'
                    }}
                  />
                </div>
              </div>
            )}
          </Form.Group>

          {/* Display the uploaded media URL */}
          {newContent.mediaType === "image" && (
            <Form.Group style={customStyles.formGroup}>
              <Form.Label style={customStyles.label}>
                <Image size={16} />
                URL ya picha
              </Form.Label>
              <Form.Control
                type="text"
                value={newContent.imageUrl}
                onChange={(e) => onContentChange("imageUrl", e.target.value)}
                style={customStyles.input}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          )}
          {newContent.mediaType === "video" && (
            <Form.Group style={customStyles.formGroup}>
              <Form.Label style={customStyles.label}>
                <Video size={16} />
                URL ya video
              </Form.Label>
              <Form.Control
                type="text"
                value={newContent.videoUrl}
                onChange={(e) => onContentChange("videoUrl", e.target.value)}
                style={customStyles.input}
                placeholder="https://example.com/video.mp4"
              />
            </Form.Group>
          )}
        </Modal.Body>
        
        <Modal.Footer style={customStyles.footer}>
          <Button 
            variant="secondary" 
            onClick={onClose}
            style={{...customStyles.button, ...customStyles.secondaryButton}}
          >
            Ondoa
          </Button>
          <Button 
            variant="primary" 
            onClick={onAdd}
            style={{...customStyles.button, ...customStyles.primaryButton}}
          >
            Ongeza kwenye Chapter
          </Button>
          <Button 
            variant="primary" 
            onClick={onAddNewTab}
            style={{...customStyles.button, ...customStyles.primaryButton, marginLeft: '10px'}}
          >
            Ongeza chapter mpya
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddContentModal;