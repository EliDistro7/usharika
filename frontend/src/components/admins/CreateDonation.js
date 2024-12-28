'use client';

import React, { useState } from "react";
import { createDonation } from "@/actions/users"; // Import the helper function
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import Cookies from "js-cookie";
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
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Container */}
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Unda Mchango</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Donation Name
              </label>
              <input
                id="name"
                name="name"
                className="form-control"
                placeholder="Jina la mchango"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Details Input */}
            <div className="mb-3">
              <label htmlFor="details" className="form-label">
                Maelezo
              </label>
              <textarea
                id="details"
                name="details"
                className="form-control"
                placeholder="Maelezo ya mchango"
                rows="4"
                value={formData.details}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Starting Date Input */}
            <div className="mb-3">
              <label htmlFor="startingDate" className="form-label">
                Tarehe ya kuanza kuchanga
              </label>
              <input
                type="date"
                id="startingDate"
                name="startingDate"
                className="form-control"
                value={formData.startingDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Deadline Input */}
            <div className="mb-3">
              <label htmlFor="deadline" className="form-label">
                Tarehe ya Mwisho
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            {/* Total Input */}
            <div className="mb-3">
              <label htmlFor="total" className="form-label">
                Kiasi kinachotakiwa
              </label>
              <input
                type="number"
                id="total"
                name="total"
                className="form-control"
                placeholder="Kiasi "
                value={formData.total}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Inaunda..." : "Ingiza"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
