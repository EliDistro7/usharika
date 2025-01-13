
'use client';

import React, { useState, useEffect } from "react";
import { 
  createFutureEvent, 
  getAllFutureEvents, 
  updateFutureEventById, 
  deleteFutureEventById, 
  deleteAllFutureEvents 
} from "@/actions/future-event";
import { Button, Modal, Form, Table, Spinner } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";

const FutureEventsPage = () => {
  const [futureEvents, setFutureEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "",
    date: "",
    subtitle: "",
    buttons: [],
    extraDetails: "",
    groupAuthor: { name: Cookies.get('role') },
  });

  // Fetch all future events on load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getAllFutureEvents();
      console.log('events data', response.data)
      setFutureEvents(response.data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (currentEvent) {
        // Update an existing event
        await updateFutureEventById(currentEvent._id, formData);
      } else {
        // Create a new event
        console.log("sent form data to server", formData);
        await createFutureEvent(formData);
      }
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteFutureEventById(id);
        fetchEvents();
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all events?")) {
      try {
        await deleteAllFutureEvents();
        fetchEvents();
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData(event);
    setShowModal(true);
  };

  const handleShowModal = () => {
    setCurrentEvent(null);
    setFormData({
      title: "",
      image: "",
      category: "",
      date: "",
      subtitle: "",
      buttons: [],
      extraDetails: "",
      groupAuthor: { name: Cookies.get('role') },
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Future Events</h2>
        <div>
          <Button className="me-2" variant="danger" onClick={handleDeleteAll}>
            Delete All
          </Button>
          <Button variant="success" onClick={handleShowModal}>
            <FaPlus className="me-2" /> Add Event
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Group Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {futureEvents.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1}</td>
                <td>{event.title}</td>
                <td>{event.category}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.groupAuthor?.name || "N/A"}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(event)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(event._id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for Adding/Editing Events */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEvent ? "Edit Event" : "Add Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
              />
            </Form.Group>
           
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {currentEvent ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FutureEventsPage;
