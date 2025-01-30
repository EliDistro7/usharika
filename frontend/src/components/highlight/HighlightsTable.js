import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Highlights from "../Highlights";
import CustomModal from "./Modal";
const HighlightsTable = ({ highlights, onEdit, onDelete, onAddContent }) => {
  const [previewHighlight, setPreviewHighlight] = useState(null);

  const handleClosePreview = () => setPreviewHighlight(null);

  return (
    <>
      <Table striped bordered hover className="mb-4">
        <thead className="bg-primary text-white">
          <tr>
            <th>#</th>
            <th>Jina</th>
            <th>Idadi ya maudhui</th>
            <th>Muda ilipoundwa</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {highlights.length > 0 ? (
            highlights.map((highlight, index) => (
              <tr key={highlight._id}>
                <td>{index + 1}</td>
                <td>{highlight.name}</td>
                <td>{highlight.content.length}</td>
                <td>{new Date(highlight.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => onEdit(highlight)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => setPreviewHighlight(highlight)}
                  >
                    <FaEye /> Preview
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(highlight._id)}
                  >
                    <FaTrash /> futa
                  </Button>
                  <Button
                    variant="primary"
                    className="ms-2"
                    onClick={() => onAddContent(highlight)}
                  >
                    <FaPlus /> Ongeza maudhui
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No recent highlights found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Preview Modal */}
    {/* Custom Preview Modal */}
    <CustomModal show={!!previewHighlight} onClose={handleClosePreview}>
        <Highlights data={previewHighlight} />
      </CustomModal>
    </>
  );
};

export default HighlightsTable;
