'use client';

import React, { useState, useEffect } from "react";
import { FaHandHoldingHeart, FaChurch, FaGraduationCap, FaCoins, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { Card, Button, Form, Row, Col, Container, Badge } from "react-bootstrap";
import { getUser } from "@/hooks/useUser";
import { addPledge } from "@/actions/pledge";
import Link from 'next/link';
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";

// Font declarations
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Modern Purple-Indigo Color Scheme
const colors = {
  primary: "#6366f1",        // Indigo-500
  primaryDark: "#4f46e5",    // Indigo-600
  secondary: "#8b5cf6",      // Violet-500
  secondaryDark: "#7c3aed",  // Violet-600
  accent: "#f59e0b",         // Amber-500
  success: "#10b981",        // Emerald-500
  background: "#f8fafc",     // Slate-50
  surface: "#ffffff",        // White
  surfaceElevated: "#f1f5f9", // Slate-100
  text: "#1e293b",          // Slate-800
  textSecondary: "#64748b",  // Slate-500
  border: "#e2e8f0",        // Slate-200
  borderFocus: "#6366f1",   // Indigo-500
  gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  gradientCard: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
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
    icon: <FaChurch size={32} />,
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    target: "2,000,000"
  },
  { 
    id: 2, 
    title: "Sadaka ya Mabenchi", 
    description: "Tunaomba washarika mmalizie ahadi zenu za kuongeza mabenchi kwenye kanisa letu", 
    icon: <FaGraduationCap size={32} />,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    target: "500,000"
  },
  { 
    id: 3, 
    title: "Diakonia", 
    description: "Wiki tutatembelea kitu cha mwane kuwaona watoto, shiriki nasi baraka hizi kwa sadaka yako ya hali na mali", 
    icon: <FaHandHoldingHeart size={32} />,
    gradient: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)",
    target: "300,000"
  },
  { 
    id: 4, 
    title: "Kulipa Deni", 
    description: "Tuungane pamoja ili kumaliza deni letu la kanisa kabla ya mwaka huu kuisha.", 
    icon: <FaCoins size={32} />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
    target: "1,500,000"
  },
];

const InputField = ({ label, type, placeholder, value, onChange, required, icon }) => (
  <div className="mb-4">
    <label className={`form-label fw-semibold ${cormorant.className}`} style={{ 
      fontSize: "1.1rem", 
      color: colors.text,
      marginBottom: "8px"
    }}>
      {label} {required && <span style={{ color: colors.secondary }}>*</span>}
    </label>
    <div className="position-relative">
      {icon && (
        <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: colors.textSecondary }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        className={`form-control ${cormorant.className} ${icon ? 'ps-5' : ''}`}
        style={{ 
          fontSize: "1rem",
          padding: "16px 20px",
          border: `2px solid ${colors.border}`,
          borderRadius: "12px",
          transition: "all 0.3s ease",
          backgroundColor: colors.surface,
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={(e) => {
          e.target.style.borderColor = colors.borderFocus;
          e.target.style.boxShadow = `0 0 0 3px rgba(99, 102, 241, 0.1)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border;
          e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
        }}
      />
    </div>
  </div>
);

const Pledge = () => {
  const [selectedOption, setSelectedOption] = useState(null);
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
      ? `Asante ${username} kwa ahadi yako ya TZS ${amount.toLocaleString()} kwa ajili ya ${selectedOption.title}!`
      : `Unalipia TZS ${amount.toLocaleString()} kwa ajili ya ${selectedOption.title} kwa njia ya ${paymentMethod}.`;

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

      setSelectedOption(null);
      setAmount("");
      setUsername("");
      setPhoneNumber("");
      setPaymentMethod("");
      setIsPledge(true);
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
    <div style={{ 
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.surfaceElevated} 100%)`,
      minHeight: "100vh",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <Container fluid="lg">
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="d-inline-block p-3 rounded-circle mb-4" style={{
            background: colors.gradient,
            animation: "pulse 2s infinite"
          }}>
            <FaHandHoldingHeart size={40} color="white" />
          </div>
          
          <h1 className={`mb-4 animate__animated animate__fadeInUp ${cinzel.className}`} 
              style={{ 
                fontSize: "clamp(2rem, 5vw, 3.5rem)", 
                background: colors.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: "900",
                letterSpacing: "2px",
                lineHeight: "1.2"
              }}>
            UNGANA NASI KWA NJIA YA SADAKA
          </h1>
          
          <p className={`lead mx-auto ${playfair.className}`} style={{ 
            fontSize: "1.4rem", 
            color: colors.textSecondary,
            maxWidth: "600px",
            lineHeight: "1.6"
          }}>
            Tuungane mkono ili kuendeleza kazi za kimungu na kuboresha mazingira yetu ya ibada
          </p>
        </div>

        {/* Auth Notice */}
        {!username && (
          <div className="text-center mb-5">
            <Card className="border-0 shadow-sm mx-auto" style={{ 
              maxWidth: "500px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
              borderRadius: "16px"
            }}>
              <Card.Body className="p-4">
                <div className="mb-3">
                  <FaCheckCircle size={32} style={{ color: colors.secondary }} />
                </div>
                <p className={`mb-3 ${playfair.className}`} style={{ 
                  fontSize: "1.2rem", 
                  color: colors.text,
                  lineHeight: "1.6"
                }}>
                  Tafadhali{" "}
                  <Link href="/auth" className="fw-bold text-decoration-none" style={{ 
                    color: colors.primary
                  }}>
                    ingia kwenye akaunti yako
                  </Link>{" "}
                  ili uweze kuweka ahadi.
                </p>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Donation Options Grid */}
        <Row className="g-4 mb-5">
          {donationOptions.map((option, index) => (
            <Col key={option.id} xs={12} md={6} lg={6}>
              <Card
                onClick={() => setSelectedOption(option)}
                className={`h-100 border-0 cursor-pointer animate__animated animate__fadeInUp ${
                  selectedOption?.id === option.id ? "shadow-lg" : "shadow-sm"
                }`}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: selectedOption?.id === option.id ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                  borderRadius: "20px",
                  background: selectedOption?.id === option.id ? option.gradient : colors.surface,
                  color: selectedOption?.id === option.id ? "white" : colors.text,
                  cursor: "pointer",
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  if (selectedOption?.id !== option.id) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOption?.id !== option.id) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                  }
                }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start">
                    <div className={`me-4 p-3 rounded-circle ${selectedOption?.id === option.id ? 'bg-white' : ''}`} style={{
                      background: selectedOption?.id === option.id ? "rgba(255,255,255,0.2)" : colors.gradientCard,
                      color: selectedOption?.id === option.id ? colors.primary : "inherit",
                      backdropFilter: "blur(10px)"
                    }}>
                      {option.icon}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className={`fw-bold ${playfair.className}`} style={{ 
                          fontSize: "1.4rem",
                          marginBottom: "8px",
                          lineHeight: "1.3"
                        }}>
                          {option.title}
                        </h4>
                        <Badge 
                          className="ms-2" 
                          style={{ 
                            backgroundColor: selectedOption?.id === option.id ? "rgba(255,255,255,0.2)" : colors.secondary,
                            fontSize: "0.75rem",
                            padding: "4px 8px"
                          }}
                        >
                          Target: {formatCurrency(option.target)}
                        </Badge>
                      </div>
                      <p className={`mb-0 ${cormorant.className}`} style={{ 
                        fontSize: "1.1rem",
                        lineHeight: "1.5",
                        opacity: selectedOption?.id === option.id ? 0.95 : 0.8
                      }}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Expanded Form */}
              {selectedOption?.id === option.id && (
                <Card className="mt-4 border-0 shadow-lg animate__animated animate__fadeInUp" style={{ 
                  borderRadius: "20px",
                  background: colors.surface,
                  overflow: "hidden"
                }}>
                  {/* Header */}
                  <div style={{
                    background: selectedOption.gradient,
                    padding: "1.5rem",
                    color: "white"
                  }}>
                    <h3 className={`fw-bold mb-2 ${playfair.className}`} style={{ 
                      fontSize: "1.6rem",
                      textAlign: "center"
                    }}>
                      {selectedOption.title}
                    </h3>
                    <p className="text-center mb-0 opacity-90">
                      Chagua aina ya mchango wako
                    </p>
                  </div>

                  <Card.Body className="p-4">
                    {/* Toggle Buttons */}
                    <div className="d-flex gap-2 mb-4 p-1" style={{
                      backgroundColor: colors.surfaceElevated,
                      borderRadius: "12px"
                    }}>
                      <Button
                        onClick={() => setIsPledge(true)}
                        className="flex-fill border-0 fw-semibold"
                        style={{ 
                          backgroundColor: isPledge ? colors.primary : "transparent",
                          color: isPledge ? "white" : colors.textSecondary,
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <FaCheckCircle className="me-2" />
                        Weka Ahadi
                      </Button>
                      <Button
                        onClick={() => setIsPledge(false)}
                        className="flex-fill border-0 fw-semibold"
                        style={{ 
                          backgroundColor: !isPledge ? colors.primary : "transparent",
                          color: !isPledge ? "white" : colors.textSecondary,
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <FaCreditCard className="me-2" />
                        Lipa Sasa
                      </Button>
                    </div>

                    <Form>
                      {isPledge && (
                        <Row>
                          <Col md={6}>
                            <InputField
                              label="Jina Lako"
                              type="text"
                              placeholder="Ingiza jina lako kamili"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </Col>
                          <Col md={6}>
                            <InputField
                              label="Namba ya Simu"
                              type="tel"
                              placeholder="+255 xxx xxx xxx"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                            />
                          </Col>
                        </Row>
                      )}

                      <InputField
                        label="Kiasi"
                        type="number"
                        placeholder="Ingiza kiasi kwa TZS (mfano: 50000)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />

                      {!isPledge && (
                        <Form.Group className="mb-4">
                          <Form.Label className={`fw-semibold ${cormorant.className}`} style={{ 
                            fontSize: "1.1rem", 
                            color: colors.text,
                            marginBottom: "8px"
                          }}>
                            Njia ya Malipo <span style={{ color: colors.secondary }}>*</span>
                          </Form.Label>
                          <Form.Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                            style={{ 
                              fontSize: "1rem",
                              padding: "16px 20px",
                              border: `2px solid ${colors.border}`,
                              borderRadius: "12px",
                              backgroundColor: colors.surface,
                              transition: "all 0.3s ease"
                            }}
                          >
                            <option value="" disabled>
                              Chagua njia ya malipo
                            </option>
                            {paymentOptions.map((method) => (
                              <option key={method.id} value={method.name}>
                                {method.icon} {method.name} - {method.number}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}
                    </Form>

                    {error && (
                      <div className="alert alert-danger border-0 rounded-3 mb-4" style={{ 
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#dc2626",
                        fontSize: "1rem"
                      }}>
                        <strong>Hitilafu:</strong> {error}
                      </div>
                    )}

                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-100 border-0 fw-bold text-white position-relative overflow-hidden"
                      style={{ 
                        background: colors.gradient,
                        borderRadius: "12px",
                        padding: "16px",
                        fontSize: "1.2rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 8px 25px rgba(99, 102, 241, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Inawasilisha...
                        </>
                      ) : (
                        <>
                          {isPledge ? "Weka Ahadi Yangu" : "Lipa Sasa"}
                          {amount && (
                            <span className="ms-2 opacity-75">
                              ({formatCurrency(amount)})
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </Col>
          ))}
        </Row>
      </Container>
      
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
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .form-control:focus {
          outline: none !important;
        }
        
        .btn:focus {
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default Pledge;