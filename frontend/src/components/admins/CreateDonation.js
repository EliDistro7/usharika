'use client';

import React, { useState } from "react";
import { createDonation } from "@/actions/users";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { FaHandHoldingHeart, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";

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
      toast.success("Umefanikiwa kuunda mchango mpya!");
      setFormData({
        name: "",
        details: "",
        startingDate: "",
        deadline: "",
        total: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to create donation.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          className="mt-16"
          toastClassName="bg-white shadow-medium rounded-2xl"
        />

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4 animate-gentle-float">
            <FaHandHoldingHeart className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            Unda Mchango Mpya
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Anzisha mchango wa kikundi chako na uweke malengo ya kifedha
          </p>
        </div>

        {/* Main Form Card */}
        <div className="glass backdrop-blur-xl rounded-3xl shadow-strong overflow-hidden animate-slide-up">
          {/* Card Header */}
          <div className="bg-accent-gradient px-8 py-6">
            <div className="flex items-center space-x-3">
              <FaMoneyBillWave className="text-white text-2xl animate-pulse-soft" />
              <div>
                <h2 className="text-2xl font-display font-bold text-white text-shadow">
                  Fomu ya Mchango
                </h2>
                <p className="text-green-100 font-medium">
                  Jaza taarifa zote za lazima
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/90 backdrop-blur-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="group">
                <label 
                  htmlFor="name" 
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                >
                  <FaHandHoldingHeart className="text-green-500" />
                  <span>Jina la Mchango</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Mfano: Mchango wa Jengo la Kanisa"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-4 rounded-2xl border-2 border-border-light
                    focus:border-green-500 focus:ring-4 focus:ring-green-500/20
                    transition-all duration-300
                    bg-background-50 text-text-primary placeholder-text-tertiary
                    font-medium group-hover:border-border-medium
                  "
                />
              </div>

              {/* Details Input */}
              <div className="group">
                <label 
                  htmlFor="details" 
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                >
                  <FaInfoCircle className="text-primary-500" />
                  <span>Maelezo ya Mchango</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows="5"
                  placeholder="Eleza madhumuni ya mchango huu na jinsi fedha zitakazvyotumika..."
                  value={formData.details}
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-4 rounded-2xl border-2 border-border-light
                    focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20
                    transition-all duration-300 resize-none
                    bg-background-50 text-text-primary placeholder-text-tertiary
                    font-medium leading-relaxed group-hover:border-border-medium
                  "
                />
                <div className="text-xs text-text-tertiary mt-2">
                  {formData.details.length} herufi
                </div>
              </div>

              {/* Date Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starting Date */}
                <div className="group">
                  <label 
                    htmlFor="startingDate" 
                    className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                  >
                    <FaCalendarAlt className="text-yellow-500" />
                    <span>Tarehe ya Kuanza</span>
                  </label>
                  <input
                    id="startingDate"
                    type="date"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-4 py-4 rounded-2xl border-2 border-border-light
                      focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20
                      transition-all duration-300
                      bg-background-50 text-text-primary
                      font-medium group-hover:border-border-medium
                    "
                  />
                </div>

                {/* Deadline */}
                <div className="group">
                  <label 
                    htmlFor="deadline" 
                    className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                  >
                    <FaCalendarAlt className="text-error-500" />
                    <span>Tarehe ya Mwisho</span>
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-4 py-4 rounded-2xl border-2 border-border-light
                      focus:border-error-500 focus:ring-4 focus:ring-error-500/20
                      transition-all duration-300
                      bg-background-50 text-text-primary
                      font-medium group-hover:border-border-medium
                    "
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="group">
                <label 
                  htmlFor="total" 
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary mb-3"
                >
                  <FaMoneyBillWave className="text-green-600" />
                  <span>Kiasi Kinachotakiwa (TZS)</span>
                </label>
                <div className="relative">
                  <input
                    id="total"
                    type="number"
                    name="total"
                    placeholder="0"
                    value={formData.total}
                    onChange={handleChange}
                    required
                    min="1"
                    step="1000"
                    className="
                      w-full px-4 py-4 pr-32 rounded-2xl border-2 border-border-light
                      focus:border-green-500 focus:ring-4 focus:ring-green-500/20
                      transition-all duration-300
                      bg-background-50 text-text-primary placeholder-text-tertiary
                      font-medium text-right group-hover:border-border-medium
                    "
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-tertiary text-sm font-medium">
                    TZS
                  </div>
                </div>
                {formData.total && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 text-sm font-medium">
                      Lengo: {formatCurrency(formData.total)}
                    </p>
                  </div>
                )}
              </div>

              {/* Group Display */}
              <div className="bg-background-200 p-4 rounded-xl border border-border-light">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-text-primary">Kikundi: </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-2">
                    {formData.group || 'Haijabainishwa'}
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    btn-success px-8 py-4 rounded-2xl text-white font-bold text-sm
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center space-x-3 min-w-[160px] justify-center
                    shadow-green-lg hover:shadow-green-lg
                  "
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Inaunda...</span>
                    </>
                  ) : (
                    <>
                      <FaHandHoldingHeart className="text-lg" />
                      <span>Anzisha Mchango</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass backdrop-blur-sm rounded-2xl p-6 text-center shadow-medium">
            <div className="text-2xl mb-3">📅</div>
            <h3 className="font-bold text-text-primary mb-2">Mpangilio wa Tarehe</h3>
            <p className="text-text-secondary text-sm">
              Chagua tarehe za kuanza na kumalizika kwa mchango
            </p>
          </div>

          <div className="glass backdrop-blur-sm rounded-2xl p-6 text-center shadow-medium">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-bold text-text-primary mb-2">Lengo la Kifedha</h3>
            <p className="text-text-secondary text-sm">
              Weka kiasi kinachotakiwa ili kufikia lengo lako
            </p>
          </div>

          <div className="glass backdrop-blur-sm rounded-2xl p-6 text-center shadow-medium">
            <div className="text-2xl mb-3">📝</div>
            <h3 className="font-bold text-text-primary mb-2">Maelezo Kamili</h3>
            <p className="text-text-secondary text-sm">
              Eleza kwa ufupi madhumuni ya mchango huu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;