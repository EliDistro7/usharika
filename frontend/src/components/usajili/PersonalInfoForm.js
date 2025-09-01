'use client';
import React from "react";
import { User, Camera, Calendar, Heart, Phone, Briefcase, Save, Upload, Check, Info } from 'lucide-react';

const PersonalInfoForm = ({ 
  formData, 
  handleInputChange, 
  handleDateChange, 
  handleImageChange, 
  uploadProgress 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background-100 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg border border-border-light rounded-3xl shadow-primary-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-full mb-4">
              <User size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
              Taarifa ya Msharika
            </h2>
            <p className="text-text-secondary text-lg">Jaza taarifa zako</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              <Camera size={20} className="inline mr-2 text-primary-600" />
              Chagua Picha
            </label>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="photo"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleImageChange}
              />
              <div className="border-2 border-dashed border-primary-400 rounded-2xl p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 min-h-32 cursor-pointer hover:border-primary-500 transition-colors duration-200">
                <Upload size={32} className="text-primary-500 mb-2 mx-auto" />
                <p className="text-text-secondary">Bofya hapa au drag picha yako hapa</p>
              </div>
            </div>

            {/* Image Preview */}
            {formData.previewUrl && (
              <div className="text-center mt-4">
                <div className="relative inline-block">
                  <img
                    src={formData.previewUrl}
                    alt="Onyesho la Picha"
                    className="w-48 h-48 object-cover rounded-2xl shadow-medium border-4 border-primary-400"
                  />
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-success-500 text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-background-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary-gradient transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-text-tertiary text-sm mt-1">Inapakia... {uploadProgress}%</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Name */}
            <div className="lg:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2">
                <User size={18} className="inline mr-2 text-primary-600" />
                Jina <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleInputChange}
                value={formData.name || ''}
                placeholder="Jina la Msharika"
                required
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-text-primary mb-2">
                <Calendar size={18} className="inline mr-2 text-primary-600" />
                Tarehe ya Kuzaliwa
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                onChange={handleDateChange}
                value={formData.dob || ''}
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-text-primary mb-2">
                <Heart size={18} className="inline mr-2 text-primary-600" />
                Jinsia
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              >
                <option value="">Chagua Jinsia...</option>
                <option value="me">Me</option>
                <option value="ke">Ke</option>
              </select>
            </div>
          </div>

          {/* Baptism and Confirmation Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ubatizo"
                  name="ubatizo"
                  checked={formData.ubatizo || false}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 bg-white border-2 border-primary-300 rounded focus:ring-primary-500 focus:ring-2 mr-3"
                />
                <label htmlFor="ubatizo" className="flex-grow font-semibold text-text-primary cursor-pointer">
                  <span className="text-primary-600 mr-2">✝</span>
                  Umepata Ubatizo?
                </label>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="kipaimara"
                  name="kipaimara"
                  checked={formData.kipaimara || false}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 bg-white border-2 border-primary-300 rounded focus:ring-primary-500 focus:ring-2 mr-3"
                />
                <label htmlFor="kipaimara" className="flex-grow font-semibold text-text-primary cursor-pointer">
                  <span className="text-primary-600 mr-2">🙏</span>
                  Umepata Kipaimara?
                </label>
              </div>
            </div>
          </div>

          {/* Marital Status */}
          {formData.gender && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-semibold text-text-primary mb-2">
                  <Heart size={18} className="inline mr-2 text-primary-600" />
                  Ndoa
                </label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
                >
                  <option value="">Chagua...</option>
                  {formData.gender === "me" ? (
                    <>
                      <option value="umeoa">Umeoa</option>
                      <option value="hujaoa">Hujaoa</option>
                    </>
                  ) : (
                    <>
                      <option value="umeolewa">Umeolewa</option>
                      <option value="hujaolewa">Hujaolewa</option>
                    </>
                  )}
                </select>
              </div>

              {/* Marriage Type */}
              {(formData.maritalStatus === "umeoa" || formData.maritalStatus === "umeolewa") && (
                <div>
                  <label htmlFor="marriageType" className="block text-sm font-semibold text-text-primary mb-2">
                    <span className="inline-block mr-2 text-primary-600">💍</span>
                    Aina ya Ndoa
                  </label>
                  <select
                    id="marriageType"
                    name="marriageType"
                    value={formData.marriageType || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
                  >
                    <option value="">Chagua aina ya ndoa...</option>
                    <option value="Ndoa ya Kikristo">Ndoa ya Kikristo</option>
                    <option value="Ndoa ya Kiserikali">Ndoa ya Kiserikali</option>
                    <option value="Nyingineyo">Nyingineyo</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-text-primary mb-2">
                <Phone size={18} className="inline mr-2 text-primary-600" />
                Namba ya Simu <span className="text-error-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+255 XXX XXX XXX"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-sm font-semibold text-text-primary mb-2">
                <Briefcase size={18} className="inline mr-2 text-primary-600" />
                Kazi/Occupation <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                placeholder="Kazi ya Msharika"
                value={formData.occupation || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-blue-700 font-medium text-sm">
                Kama ni mwanafunzi ingiza "mwanafunzi"
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button 
              type="submit" 
              className="bg-primary-gradient text-white font-bold py-4 px-8 rounded-full shadow-primary transition-all duration-300 hover:shadow-primary-lg hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <Save size={20} />
              Hifadhi Taarifa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;