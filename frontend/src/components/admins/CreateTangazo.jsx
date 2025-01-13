'use client';

import React, { useState } from "react";
import { pushMatangazoNotification } from "@/actions/users";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomNavbar from "@/components/admins/CustomNavbar";

const CreateTangazo = () => {
  const [formData, setFormData] = useState({
    group: Cookies.get('role'),
    message: "",
  });

  const [loading, setLoading] = useState(false);
  //const [activeTab, setActiveTab] = useState("home");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pushMatangazoNotification(formData);
      toast.success("Notification sent successfully!");
      setFormData({ group: Cookies.get('role'), message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-0 px-0">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Navbar */}
     <CustomNavbar />
      {/* Card */}
      <div className="card shadow-sm">
        <div className="card-header text-white" >
          <h4 className="mb-0">Unda Tangazo</h4>
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
                style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }}
                disabled={loading}
              >
                {loading ? "Inatuma..." : "Tuma"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTangazo;
