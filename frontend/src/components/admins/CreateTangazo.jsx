'use client';

import React, { useState } from "react";
import { pushMatangazoNotification } from "@/actions/users";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getLoggedInUserId } from "@/hooks/useUser";
import NotificationList from "./NotificationList";
import CustomNavbar from "./CustomNavbar";

const CreateTangazo = () => {
  const [activeTab, setActiveTab] = useState("create");
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
      toast.success("Tangazo limetumwa kikamilifu!");
      setFormData({ group: Cookies.get("role"), message: "", userId: getLoggedInUserId() });
    } catch (err) {
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 font-medium text-sm rounded-t-xl transition-all duration-300 relative
        ${isActive 
          ? 'bg-primary-700 text-white shadow-primary' 
          : 'bg-background-300 text-text-secondary hover:bg-background-400 hover:text-text-primary'
        }
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
      `}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-t-full"></div>
      )}
    </button>
  );

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-300">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            className="mt-16"
            toastClassName="bg-white shadow-medium rounded-2xl"
          />

          {/* Custom Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-background-200 p-1 rounded-2xl shadow-soft">
              <TabButton
                id="create"
                label="Unda Tangazo"
                isActive={activeTab === "create"}
                onClick={() => setActiveTab("create")}
              />
              <TabButton
                id="list"
                label="List ya Matangazo"
                isActive={activeTab === "list"}
                onClick={() => setActiveTab("list")}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "create" && (
              <div className="glass backdrop-blur-xl rounded-3xl shadow-strong overflow-hidden">
                {/* Header */}
                <div className="bg-primary-gradient px-8 py-6">
                  <h2 className="text-2xl font-display font-bold text-white text-shadow">
                    Unda Tangazo Jipya
                  </h2>
                  <p className="text-primary-100 mt-2 font-medium">
                    Andika ujumbe wako wa tangazo hapa chini
                  </p>
                </div>

                {/* Form */}
                <div className="bg-white/90 backdrop-blur-sm p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Message Input */}
                    <div className="group">
                      <label 
                        htmlFor="message" 
                        className="block text-sm font-semibold text-text-primary mb-3"
                      >
                        Ujumbe wa Tangazo
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          className="
                            w-full px-4 py-4 rounded-2xl border-2 border-border-light 
                            focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20
                            transition-all duration-300 resize-none
                            bg-background-50 text-text-primary placeholder-text-tertiary
                            font-medium leading-relaxed
                            group-hover:border-border-medium
                          "
                          placeholder="Andika tangazo lako hapa..."
                          rows="6"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                        <div className="absolute bottom-4 right-4 text-text-tertiary text-xs">
                          {formData.message.length} herufi
                        </div>
                      </div>
                    </div>

                    {/* Group Info */}
                    <div className="bg-background-200 p-4 rounded-xl border border-border-light">
                      <p className="text-sm text-text-secondary">
                        <span className="font-semibold text-text-primary">Kikundi: </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-2">
                          {formData.group || 'Haijabainishwa'}
                        </span>
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading || !formData.message.trim()}
                        className="
                          btn-primary px-8 py-4 rounded-2xl text-white font-bold text-sm
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                          flex items-center space-x-3 min-w-[140px] justify-center
                          shadow-primary-lg hover:shadow-primary-lg
                        "
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Inatuma...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Tuma Tangazo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "list" && (
              <div className="glass backdrop-blur-xl rounded-3xl shadow-strong overflow-hidden">
                {/* Header */}
                <div className="bg-secondary-gradient px-8 py-6">
                  <h2 className="text-2xl font-display font-bold text-white text-shadow">
                    Orodha ya Matangazo
                  </h2>
                  <p className="text-yellow-100 mt-2 font-medium">
                    Matangazo yote yaliyotumwa
                  </p>
                </div>

                {/* Content */}
                <div className="bg-white/90 backdrop-blur-sm">
                  <NotificationList />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTangazo;