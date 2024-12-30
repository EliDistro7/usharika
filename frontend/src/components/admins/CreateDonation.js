'use client';

import React, { useState } from "react";
import { createDonation } from "@/actions/users"; // Import the helper function
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import Cookies from "js-cookie";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const CreateDonation = () => {
  const [formData, setFormData] = useState({
    name: "",
    group: Cookies.get('role'),
    details: "",
    startingDate: "",
    deadline: "",
    total: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field is 'total', convert the value to a number
    if (name === 'total') {
      setFormData({ ...formData, [name]: value ? parseFloat(value) : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDonation(formData);
      toast.success("Umefanikiwa kuunda mchango mpya!"); // Success toast
      setFormData({
        name: "",
        details: "",
        startingDate: "",
        deadline: "",
        total: "",
      }); // Clear the form
    } catch (err) {
      toast.error(err.message || "Failed to create donation."); // Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Container */}
      <Card className="shadow-sm">
        <Card.Header className="bg-success text-white">
          <Card.Title as="h4" className="mb-0 text-white">Unda Mchango</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Name Input */}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Donation Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Jina la mchango"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Details Input */}
            <Form.Group className="mb-3" controlId="details">
              <Form.Label>Maelezo</Form.Label>
              <Form.Control
                as="textarea"
                name="details"
                rows={4}
                placeholder="Maelezo ya mchango"
                value={formData.details}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Starting Date Input */}
            <Form.Group className="mb-3" controlId="startingDate">
              <Form.Label>Tarehe ya kuanza kuchanga</Form.Label>
              <Form.Control
                type="date"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Deadline Input */}
            <Form.Group className="mb-3" controlId="deadline">
              <Form.Label>Tarehe ya Mwisho</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Total Input */}
            <Form.Group className="mb-3" controlId="total">
              <Form.Label>Kiasi kinachotakiwa</Form.Label>
              <Form.Control
                type="number"
                name="total"
                placeholder="Kiasi"
                value={formData.total}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Inaunda...
                  </>
                ) : (
                  "Ingiza"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateDonation;
