import React, { useState, useEffect } from "react";
import { Heart, Church, GraduationCap, Coins, CheckCircle, CreditCard, X, User, Phone, DollarSign, Sparkles } from "lucide-react";

// Mock functions - replace with your actual implementations
const getUser = async () => {
  return { name: "John Doe", phone: "+255123456789" };
};

const addPledge = async (payload) => {
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
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-purple-600">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-purple-50 border-2 border-purple-100 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none ${
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
          setUsername(user.name || "");
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
      setIsLoading(false);
      return;
    }

    if (isPledge && (!username || !phoneNumber)) {
      setError("Please provide your name and phone number for the pledge.");
      setIsLoading(false);
      return;
    }

    try {
      if (isPledge) {
        const payload = {
          name: username,
          pledgeName: selectedOption.title,
          pledgeAmount: parseFloat(amount),
        };
        await addPledge(payload);
      }
      handleCloseModal();
      setSelectedOption(null);
      setUsername("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error while submitting pledge:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero Section with Feature Image */}
      <div className="relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Floating Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-purple-100">
                <Sparkles size={18} className="text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Baraka za Pamoja</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    UNGANA NASI
                  </span>
                  <br />
                  <span className="text-gray-800">
                    Kwa Njia ya Sadaka
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Tuungane mkono ili kuendeleza kazi ya Mungu na kuboresha mazingira yetu ya ibada. Kila sadaka huleta mabadiliko makubwa.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-600 mt-1">Miradi Mikuu</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">300+</div>
                  <div className="text-sm text-gray-600 mt-1">Wachangiaji</div>
                </div>
              </div>

              {/* CTA Scroll Indicator - Hidden on mobile */}
              <div className="hidden lg:flex items-center space-x-3 pt-4">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-purple-300 to-transparent"></div>
                <span className="text-sm text-gray-500">Tazama miradi yetu</span>
              </div>
            </div>

            {/* Right Image with Modern Design */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Main Image Container with Glass Effect */}
                <div className="relative rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-2xl group">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-500/20 z-10 group-hover:from-purple-600/30 group-hover:to-pink-500/30 transition-all duration-500"></div>
                  
                  {/* Image */}
                  <img
                    src="/img/sadaka.jpg"
                    alt="Church Community"
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Bottom Gradient Card */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm z-20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                        <Heart size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Pamoja Tunaweza</h3>
                        <p className="text-purple-200 text-sm">Kujenga kanisa la Mungu</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Accent Cards */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl z-20 hidden sm:block">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <Church size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">TZS 101M+</div>
                        <div className="text-xs text-gray-500">Lengo Letu</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400 rounded-full filter blur-3xl opacity-30"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-400 rounded-full filter blur-3xl opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Auth Notice */}
        {!username && (
          <div className="text-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl p-8 max-w-lg mx-auto shadow-lg">
              <div className="mb-4">
                <CheckCircle size={40} className="text-purple-600 mx-auto" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Tafadhali{" "}
                <a href="/auth" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors underline decoration-2 underline-offset-2">
                  ingia kwenye akaunti yako
                </a>{" "}
                ili uweze kuweka ahadi.
              </p>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Chagua Mradi Unaopenda
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kila mchango wako unasaidia kujenga jamii yetu na kuendeleza kazi za kiMungu
          </p>
        </div>

        {/* Donation Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {donationOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => handleCardClick(option)}
                className="group bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl p-6 lg:p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-purple-300"
                style={{ 
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <IconComponent size={28} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {option.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900 text-sm font-semibold rounded-full shadow-sm">
                        Target: TZS {option.target}
                      </span>
                      <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                        Changamkia →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-8 text-white relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                  {selectedOption && <selectedOption.icon size={28} />}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedOption?.title}
                </h2>
                <p className="opacity-90">Chagua aina ya mchango wako</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Toggle Buttons */}
              <div className="flex bg-purple-50 rounded-2xl p-1 mb-8">
                <button
                  onClick={() => setIsPledge(true)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all ${
                    isPledge 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <CheckCircle size={18} className="mr-2" />
                  Weka Ahadi
                </button>
                <button
                  onClick={() => setIsPledge(false)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all ${
                    !isPledge 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Njia ya Malipo <span className="text-purple-600">*</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                      className="w-full bg-purple-50 border-2 border-purple-100 rounded-xl px-4 py-3 text-gray-800 transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
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
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    <strong>Hitilafu:</strong> {error}
                  </div>
                )}

                {amount && (
                  <div className="text-center mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <h4 className="text-lg font-semibold text-purple-700">
                      Jumla: {formatCurrency(Number(amount))}
                    </h4>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Pledge;