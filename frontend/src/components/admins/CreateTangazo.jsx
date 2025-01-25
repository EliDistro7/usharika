'use client';

import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { pushMatangazoNotification } from "@/actions/users";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/admins/Sidebar"; // Import the new Sidebar
import { getLoggedInUserId } from "@/hooks/useUser";
import NotificationList from "./NotificationList";
import CustomNavbar from "./CustomNavbar";

const CreateTangazo = () => {
  const [formData, setFormData] = useState({
    group: Cookies.get("role"),
    message: "",
    userId: getLoggedInUserId(),
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
      toast.success("Notification sent successfully!");
      setFormData({ group: Cookies.get("role"), message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="container mt-0 px-0">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Tabs */}
        <Tabs defaultActiveKey="create" id="tangazo-tabs" className="mb-3">
          {/* Create Tangazo Tab */}
          <Tab eventKey="create" title="Unda Tangazo">
            <div className="card shadow-sm">
              <div className="card-header text-white">
                <h4 className="mb-0">Unda Tangazo</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Message Input */}
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Ujumbe
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      placeholder="Andika tangazo"
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
                      style={{
                        backgroundColor: "#6f42c1",
                        borderColor: "#6f42c1",
                      }}
                      disabled={loading}
                    >
                      {loading ? "Inatuma..." : "Tuma"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Tab>

          {/* Notifications List Tab */}
          <Tab eventKey="list" title="List ya Matangazo">
            <NotificationList />
          </Tab>
        </Tabs>
      </div>
    </>
  
    
  );
};

export default CreateTangazo;
