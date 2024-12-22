'use client';

import React, { useState } from "react";
import { pushMatangazoNotification } from "@/actions/users"; // Import the helper function
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const CreateTangazo = () => {
  const [formData, setFormData] = useState({
    group: Cookies.get('role'),
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pushMatangazoNotification(formData);
      toast.success("Notification sent successfully!"); // Success toast
      setFormData({ group: Cookies.get('role'), message: "" }); // Clear the form
    } catch (err) {
      toast.error(err.message || "Failed to send notification."); // Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Container */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0 text-white">Unda Tangazo</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Message Input */}
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                placeholder="Enter your message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTangazo;

