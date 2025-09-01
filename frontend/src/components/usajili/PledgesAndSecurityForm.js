'use client';
import React from "react";
import { DollarSign, Heart, Building, Shield, Lock, CheckCircle, Eye, EyeOff, Users, AlertTriangle } from 'lucide-react';
import RoleSelector from "./roles-selector/index";

const PledgesAndSecurityForm = ({ 
  formData, 
  handlePledgeChange, 
  handleInputChange, 
  handleRoleChange,
  handleLeadershipPositionsChange,
  userRoles,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  return (
    <div className="space-y-8">
      {/* Financial Commitments Section */}
      <div className="bg-white/95 backdrop-blur-lg border border-border-light rounded-3xl shadow-primary-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-full mb-4">
            Tsh
          </div>
          <h2 className="text-4xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
            Sadaka za Ahadi
          </h2>
          <p className="text-text-secondary text-lg">Ingiza taarifa za michango yako</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ahadi */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-gradient rounded-full mr-3">
                <Heart size={20} className="text-white" />
              </div>
              <label htmlFor="ahadi" className="text-text-primary font-bold">
                Ahadi <span className="text-error-600">*</span>
              </label>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-600">
               Tsh
              </div>
              <input
                type="number"
                id="ahadi"
                name="ahadi"
                placeholder="Kiasi cha Ahadi"
                value={formData.ahadi || ''}
                onChange={handlePledgeChange}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
            </div>
          </div>

          {/* Jengo */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-gradient rounded-full mr-3">
                <Building size={20} className="text-white" />
              </div>
              <label htmlFor="jengo" className="text-text-primary font-bold">
                Jengo <span className="text-error-600">*</span>
              </label>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-600">
               Tsh
              </div>
              <input
                type="number"
                id="jengo"
                name="jengo"
                placeholder="Kiasi cha Jengo"
                value={formData.jengo || ''}
                onChange={handlePledgeChange}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Security Section */}
      <div className="bg-white/95 backdrop-blur-lg border border-border-light rounded-3xl shadow-primary-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-full mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
            Usalama wa Akaunti
          </h2>
          <p className="text-text-secondary text-lg">Tengeneza nenosiri salama la akaunti yako</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <label htmlFor="password" className="block text-text-primary font-bold mb-3">
              <Lock size={18} className="inline mr-2 text-primary-600" />
              Nenosiri <span className="text-error-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Ingiza nenosiri salama"
                required
                value={formData.password || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-3 mt-3">
              <div className="flex items-center">
                <AlertTriangle size={16} className="text-warning-600 mr-2 flex-shrink-0" />
                <small className="text-warning-700 font-medium">Tunza nenosiri lako salama</small>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <label htmlFor="confirmPassword" className="block text-text-primary font-bold mb-3">
              <CheckCircle size={18} className="inline mr-2 text-primary-600" />
              Thibitisha Nenosiri <span className="text-error-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Rudia nenosiri"
                required
                value={formData.confirmPassword || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border-2 border-primary-300 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {formData.password && formData.confirmPassword && (
              <div className={`rounded-xl p-3 mt-3 ${
                formData.password === formData.confirmPassword 
                  ? 'bg-gradient-to-r from-success-50 to-success-100 border border-success-200' 
                  : 'bg-gradient-to-r from-error-50 to-error-100 border border-error-200'
              }`}>
                <div className="flex items-center">
                  <CheckCircle 
                    size={16} 
                    className={`mr-2 flex-shrink-0 ${
                      formData.password === formData.confirmPassword 
                        ? 'text-success-600' 
                        : 'text-error-600'
                    }`} 
                  />
                  <small className={`font-medium ${
                    formData.password === formData.confirmPassword 
                      ? 'text-success-700' 
                      : 'text-error-700'
                  }`}>
                    {formData.password === formData.confirmPassword 
                      ? 'Nenosiri zinapatana' 
                      : 'Nenosiri hazipatani'}
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="bg-white/95 backdrop-blur-lg border border-border-light rounded-3xl shadow-primary-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-full mb-4">
            <Users size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
            Vikundi na Nafasi za Uongozi
          </h2>
          <p className="text-text-secondary text-lg mb-6">Chagua vikundi unavyoshiriki na nafasi za kiuongozi</p>
          
          <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-4">
            <div className="flex items-center justify-center">
              <AlertTriangle size={20} className="text-warning-600 mr-2 flex-shrink-0" />
              <small className="text-warning-700 font-medium text-center">
                Hakikisha unaingiza vikundi vyote unavyoshiriki au nafasi za kiuongozi
              </small>
            </div>
          </div>
        </div>

        {/* Role Selector Component */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <RoleSelector
            userRoles={userRoles}
            formData={formData}
            handleRoleChange={handleRoleChange}
            handleLeadershipPositionsChange={handleLeadershipPositionsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PledgesAndSecurityForm;