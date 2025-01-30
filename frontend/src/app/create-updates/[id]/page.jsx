
'use client';


import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  createUpdate,
  getAllUpdates,
  updateUpdate,
  deleteUpdate,
} from "@/actions/updates";

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [formData, setFormData] = useState({ content: "", group: "" });

  // Fetch all updates on load
  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const updatesData = await getAllUpdates();
      //console.log('update data', updatesData);
      setUpdates(updatesData); // Assuming `data` contains the list
    } catch (error) {
      console.log(error)
      console.error("Error fetching updates:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (update = null) => {
    if (update) {
      setEditMode(true);
      setSelectedUpdate(update);
      setFormData({ content: update.content, group: update.group });
    } else {
      setEditMode(false);
      setFormData({ content: "", group: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUpdate(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update existing update
        await updateUpdate({
          id: selectedUpdate._id,
          ...formData,
        });
      } else {
        // Create new update
        await createUpdate(formData);
      }
      fetchUpdates();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving update:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Je, unataka kufuta update hii?")) {
      try {
        await deleteUpdate(id);
        fetchUpdates();
      } catch (error) {
        console.error("Error deleting update:", error.message);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Updates</h2>
          <Button
            className="mb-3"
            variant="primary"
            onClick={() => handleShowModal()}
          >
            <FaPlus /> Ongeza Update
          </Button>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Maudhui</th>
                  <th>Kutoka kwa</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {updates.map((update, index) => (
                  <tr key={update._id}>
                    <td>{index + 1}</td>
                    <td>{update.content}</td>
                    <td>{update.group}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => handleShowModal(update)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(update._id)}
                      >
                        <FaTrash /> Futa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Modal for Adding/Editing Updates */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Update" : "Ongeza Update"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                type="text"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Ingiza update..."
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kikundi</Form.Label>
              <Form.Control
                type="text"
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                placeholder="Jina la kikundi..."
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? "Update" : "Unda"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UpdatesPage;
