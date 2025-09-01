'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff, User, Lock, Phone, X, KeyRound } from 'lucide-react';
import { loginUser, getCookie } from '@/hooks/useUser'; // Adjust the path based on your file structure

const InputField = ({ 
  label, 
  type, 
  id, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  icon: Icon, 
  error, 
  showToggle, 
  onToggle,
  showPasswordText 
}) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-sm font-semibold text-text-primary mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className={`w-full bg-background-50 border-2 rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary transition-all duration-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 focus:outline-none ${
          Icon ? 'pl-12' : ''
        } ${showToggle ? 'pr-12' : ''} ${
          error ? 'border-error-500' : 'border-border-light'
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors border border-border-light rounded-lg px-3 py-1 text-xs font-medium hover:bg-background-200"
        >
          {showPasswordText ? 'Ficha' : 'Onyesha'}
        </button>
      )}
    </div>
  </div>
);

const Form = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNambaModal, setShowNambaModal] = useState(false);
  const [nambaYaAhadi, setNambaYaAhadi] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodePrompt, setShowCodePrompt] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNambaSubmit = () => {
    if (!nambaYaAhadi) {
      toast.error('Tafadhali jaza namba ya ahadi.');
      return;
    }

    setShowNambaModal(false);
    toast.success('Tumetuma code kwenye namba yako.');
    setShowCodePrompt(true); // Show the code prompt after sending
  };

  const handleCodeSubmit = () => {
    if (!verificationCode) {
      toast.error('Tafadhali jaza msimbo uliopewa.');
      return;
    }

    toast.success('code imethibitishwa. Tafadhali badilisha password yako.');
    setShowCodePrompt(false); // Hide code prompt after successful verification
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const user = await loginUser({
        name: formData.name,
        password: formData.password,
      });
      toast.success('Umeingia kwa mafanikio!');
   
      setTimeout(() => {
        router.push(`/akaunti/${getCookie()}`);
      }, 1200);
    } catch (err) {
      toast.error(err.message || 'Imeshindikana kuingia. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gradient flex flex-col justify-center items-center px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
          Fungua akaunti yako
        </h1>
        <p className="text-lg text-text-secondary">Ingia kuendelea</p>
      </header>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white/90 glass border border-border-light rounded-3xl p-8 shadow-medium animate-slide-up">
        <h2 className="text-2xl font-display font-bold text-center text-text-primary mb-8">
          Akaunti
        </h2>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl mb-6 text-center">
            {message}
          </div>
        )}

        <div className="space-y-6">
          <InputField
            label="Jina"
            type="text"
            id="name"
            name="name"
            placeholder="Ingiza jina lako"
            value={formData.name}
            onChange={handleChange}
            required
            icon={User}
            error={error}
          />

          <InputField
            label="Nenosiri"
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Ingiza nenosiri lako"
            value={formData.password}
            onChange={handleChange}
            required
            icon={Lock}
            error={error}
            showToggle
            onToggle={() => setShowPassword((prev) => !prev)}
            showPasswordText={showPassword}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Inapakia...
              </div>
            ) : (
              'Ingia'
            )}
          </button>

          <button
            onClick={() => setShowNambaModal(true)}
            className="w-full text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
          >
            Umesahau password?
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            Hauna akaunti?{' '}
            <Link 
              href="/usajili" 
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Unda akaunti
            </Link>
          </p>
        </div>
      </div>

      {/* Namba Modal */}
      {showNambaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-strong max-w-md w-full animate-scale-in">
            <div className="bg-primary-gradient p-6 text-white relative">
              <button
                onClick={() => setShowNambaModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center">
                <Phone size={24} className="mr-3" />
                <h3 className="text-xl font-display font-bold">Ingiza Namba ya Ahadi</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Namba ya Ahadi
                </label>
                <input
                  type="text"
                  value={nambaYaAhadi}
                  onChange={(e) => setNambaYaAhadi(e.target.value)}
                  placeholder="Ingiza namba ya ahadi yako"
                  className="w-full bg-background-50 border-2 border-border-light rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary transition-all duration-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 focus:outline-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNambaModal(false)}
                  className="flex-1 bg-background-300 text-text-secondary py-3 px-4 rounded-xl font-semibold hover:bg-background-400 transition-colors"
                >
                  Funga
                </button>
                <button
                  onClick={handleNambaSubmit}
                  className="flex-1 btn-primary py-3 px-4 rounded-xl font-semibold"
                >
                  Tuma Msimbo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Verification Modal */}
      {showCodePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-strong max-w-md w-full animate-scale-in">
            <div className="bg-secondary-gradient p-6 text-white relative">
              <button
                onClick={() => setShowCodePrompt(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center">
                <KeyRound size={24} className="mr-3" />
                <h3 className="text-xl font-display font-bold">Ingiza Msimbo</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Msimbo Uliopewa
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Ingiza msimbo hapa"
                  className="w-full bg-background-50 border-2 border-border-light rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary transition-all duration-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 focus:outline-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCodePrompt(false)}
                  className="flex-1 bg-background-300 text-text-secondary py-3 px-4 rounded-xl font-semibold hover:bg-background-400 transition-colors"
                >
                  Funga
                </button>
                <button
                  onClick={handleCodeSubmit}
                  className="flex-1 btn-success py-3 px-4 rounded-xl font-semibold"
                >
                  Thibitisha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-center" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Form;