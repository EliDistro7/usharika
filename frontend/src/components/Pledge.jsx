'use client';

import React, { useState, useEffect } from "react";
import { Heart, Church, GraduationCap, Coins, CheckCircle, CreditCard, X, User, Phone, DollarSign } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock functions - replace with your actual implementations
const getUser = async () => {
  // Mock user data
  return { name: "John Doe", phone: "+255123456789" };
};

const addPledge = async (payload) => {
  // Mock pledge submission
  console.log("Pledge submitted:", payload);
  return Promise.resolve();
};

const paymentOptions = [
  { id: "mpesa", name: "MPESA", number: "255-123-456-789", icon: "💳" },
  { id: "tigopesa", name: "TIGOPESA", number: "255-987-654-321", icon: "📱" },
  { id: "airtel", name: "AIRTEL MONEY", number: "255-567-890-123", icon: "💰" },
  { id: "halopesa", name: "HALOPESA", number: "255-456-789-012", icon: "🏦" },
  { id: "bank", name: "Bank Account", number: "Bank XYZ, Acc: 123456789", icon: "🏛️" },
];

const donationOptions = [
  { 
    id: 1, 
    title: "Maboresho ya Kanisa", 
    description: "Tuungane mkono wapendwa kuboresha kanisa letu", 
    icon: Church,
    target: "40,000,000"
  },
  { 
    id: 2, 
    title: "Sadaka ya Mabenchi", 
    description: "Tunaomba washarika mmalizie ahadi zenu za kuongeza mabenchi kwenye kanisa letu", 
    icon: GraduationCap,
    target: "25,000,000"
  },
  { 
    id: 3, 
    title: "Diakonia", 
    description: "Wiki tutatembelea kitu cha mwane kuwaona watoto, shiriki nasi baraka hizi kwa sadaka yako ya hali na mali", 
    icon: Heart,
    target: "6,000,000"
  },
  { 
    id: 4, 
    title: "Kulipa Deni", 
    description: "Tuungane pamoja ili kumaliza deni letu la kanisa kabla ya mwaka huu kuisha.", 
    icon: Coins,
    target: "30,000,000"
  },
];

const InputField = ({ label, type, placeholder, value, onChange, required, icon: Icon }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-text-primary mb-2">
      {label} {required && <span className="text-primary-600">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-background-50 border-2 border-border-light rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary transition-all duration-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 focus:outline-none ${
          Icon ? 'pl-12' : ''
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  </div>
);

const Pledge = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPledge, setIsPledge] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        if (user) {
          setUsername(user.name || "")
          setPhoneNumber(user.phone || "");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleCardClick = (option) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setAmount("");
    setPaymentMethod("");
    setIsPledge(true);
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    if (!selectedOption || !amount || (!isPledge && !paymentMethod)) {
      setError("All fields are required.");
      toast.error("Please fill all required fields!");
      setIsLoading(false);
      return;
    }

    if (isPledge && (!username || !phoneNumber)) {
      setError("Please provide your name and phone number for the pledge.");
      toast.error("Name and phone number are required for pledges!");
      setIsLoading(false);
      return;
    }

    const message = isPledge
      ? `Asante ${username} kwa ahadi yako ya TZS ${Number(amount).toLocaleString()} kwa ajili ya ${selectedOption.title}!`
      : `Unalipia TZS ${Number(amount).toLocaleString()} kwa ajili ya ${selectedOption.title} kwa njia ya ${paymentMethod}.`;

    try {
      if (isPledge) {
        const payload = {
          name: username,
          pledgeName: selectedOption.title,
          pledgeAmount: parseFloat(amount),
        };
        await addPledge(payload);
        toast.success(message);
      } else {
        toast.success(message);
      }

      handleCloseModal();
      setSelectedOption(null);
      setUsername("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error while submitting pledge:", error.message || error);
      toast.error("Failed to submit your pledge. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-full mb-6 shadow-primary animate-pulse-soft">
            <Heart size={32} className="text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-6 leading-tight">
            UNGANA NASI KWA NJIA YA SADAKA
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Tuungane mkono ili kuendeleza kazi za kiMungu na kuboresha mazingira yetu ya ibada
          </p>
        </div>

        {/* Auth Notice */}
        {!username && (
          <div className="text-center mb-12">
            <div className=" glass border border-border-light rounded-3xl p-8 max-w-lg mx-auto shadow-soft">
              <div className="mb-4">
                <CheckCircle size={40} className="text-primary-600 mx-auto" />
              </div>
              <p className="text-lg text-text-primary leading-relaxed">
                Tafadhali{" "}
                <a href="/auth" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  ingia kwenye akaunti yako
                </a>{" "}
                ili uweze kuweka ahadi.
              </p>
            </div>
          </div>
        )}

        {/* Donation Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {donationOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => handleCardClick(option)}
                className="group bg-white/90 glass border border-border-light rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:shadow-primary-lg hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={28} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-primary-700 transition-colors">
                        {option.title}
                      </h3>
                      <span className="ml-3 px-3 py-1 bg-yellow-gradient text-sm font-semibold rounded-full">
                        Target: {option.target}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="bg-primary-gradient p-8 text-white relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                  {selectedOption && <selectedOption.icon size={28} />}
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  {selectedOption?.title}
                </h2>
                <p className="opacity-90">Chagua aina ya mchango wako</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Toggle Buttons */}
              <div className="flex bg-background-200 rounded-2xl p-1 mb-8">
                <button
                  onClick={() => setIsPledge(true)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all ${
                    isPledge 
                      ? 'bg-primary-600 text-white shadow-primary' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <CheckCircle size={18} className="mr-2" />
                  Weka Ahadi
                </button>
                <button
                  onClick={() => setIsPledge(false)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all ${
                    !isPledge 
                      ? 'bg-primary-600 text-white shadow-primary' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <CreditCard size={18} className="mr-2" />
                  Lipa Sasa
                </button>
              </div>

              {/* Form */}
              <div>
                {isPledge && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <InputField
                      label="Jina Lako"
                      type="text"
                      placeholder="Ingiza jina lako kamili"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      icon={User}
                    />
                    <InputField
                      label="Namba ya Simu"
                      type="tel"
                      placeholder="+255 xxx xxx xxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      icon={Phone}
                    />
                  </div>
                )}

                <InputField
                  label="Kiasi"
                  type="number"
                  placeholder="Ingiza kiasi kwa TZS (mfano: 50000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  icon={DollarSign}
                />

                {!isPledge && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Njia ya Malipo <span className="text-primary-600">*</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                      className="w-full bg-background-50 border-2 border-border-light rounded-xl px-4 py-3 text-text-primary transition-all duration-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 focus:outline-none"
                    >
                      <option value="" disabled>
                        Chagua njia ya malipo
                      </option>
                      {paymentOptions.map((method) => (
                        <option key={method.id} value={method.name}>
                          {method.icon} {method.name} - {method.number}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {error && (
                  <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl mb-6">
                    <strong>Hitilafu:</strong> {error}
                  </div>
                )}

                {/* Amount Preview */}
                {amount && (
                  <div className="text-center mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                    <h4 className="text-lg font-semibold text-primary-700">
                      Jumla: {formatCurrency(Number(amount))}
                    </h4>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full btn-primary py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Inawasilisha...
                    </div>
                  ) : (
                    <>
                      {isPledge ? "Weka Ahadi Yangu" : "Lipa Sasa"}
                      {amount && (
                        <span className="ml-2 opacity-75">
                          ({formatCurrency(Number(amount))})
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer 
        position="top-right"
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

export default Pledge;