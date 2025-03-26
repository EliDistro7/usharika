'use client';

import React, { useState, useEffect } from "react";
import { FaHandHoldingHeart, FaChurch, FaGraduationCap, FaCoins } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
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
  weight: ["700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Color scheme
const colors = {
  black: "#1a1a1a",         // Bold black
  purple: "#9370DB",        // Lighter purple (softer than #6a0dad)
  yellow: "#FFD700",        // Gold yellow
  lightPurple: "#E6E6FA",   // Very light purple for backgrounds
  white: "#ffffff",         // Pure white
  gray: "#666666"           // Medium gray for secondary text
};

const paymentOptions = [
  { id: "mpesa", name: "MPESA", number: "255-123-456-789" },
  { id: "tigopesa", name: "TIGOPESA", number: "255-987-654-321" },
  { id: "airtel", name: "AIRTEL MONEY", number: "255-567-890-123" },
  { id: "halopesa", name: "HALOPESA", number: "255-456-789-012" },
  { id: "bank", name: "Bank Account", number: "Bank XYZ, Acc: 123456789" },
];

const donationOptions = [
  { 
    id: 1, 
    title: "Maboresho ya Kanisa", 
    description: "Tuungane mkono wapendwa kuboresha kanisa letu", 
    icon: <FaChurch size={28} style={{ color: colors.purple }} /> 
  },
  { 
    id: 2, 
    title: "Sadaka ya Mabenchi", 
    description: "Tunaomba washarika mmalizie ahadi zenu za kuongeza mabenchi kwenye kanisa letu", 
    icon: <FaGraduationCap size={28} style={{ color: colors.yellow }} /> 
  },
  { 
    id: 3, 
    title: "Diakonia", 
    description: "Wiki tutatembelea kitu cha mwane kuwaona watoto, shiriki nasi baraka hizi kwa sadaka yako ya hali na mali", 
    icon: <FaHandHoldingHeart size={28} style={{ color: colors.purple }} /> 
  },
  { 
    id: 4, 
    title: "Kulipa Deni", 
    description: "Tuungane pamoja ili kumaliza deni letu la kanisa kabla ya mwaka huu kuisha.", 
    icon: <FaCoins size={28} style={{ color: colors.yellow }} /> 
  },
];

const InputField = ({ label, type, placeholder, value, onChange, required }) => (
  <div className="mb-4">
    <label className={`form-label fw-bold ${cormorant.className}`} style={{ 
      fontSize: "1.2rem", 
      color: colors.black,
      marginBottom: "8px"
    }}>
      {label}
    </label>
    <input
      type={type}
      className={`form-control ${cormorant.className}`}
      style={{ 
        fontSize: "1.1rem",
        padding: "12px",
        border: `2px solid ${colors.black}`,
        borderRadius: "8px"
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        if (user) {
          setUsername(user.name || null)
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

    if (!selectedOption || !amount || (!isPledge && !paymentMethod)) {
      setError("All fields are required.");
      toast.error("Please fill all required fields!");
      return;
    }

    if (isPledge && (!username || !phoneNumber)) {
      setError("Please provide your name and phone number for the pledge.");
      toast.error("Name and phone number are required for pledges!");
      return;
    }

    const message = isPledge
      ? `Asante ${username} kwa ahadi yako ya TZS ${amount} kwa ajili ya ${selectedOption.title}!`
      : `Unalipia TZS ${amount} kwa ajili ya ${selectedOption.title} kwa njia ya ${paymentMethod}.`;

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
    }
  };

  return (
    <div className={`px-4 py-5 ${playfair.className}`} style={{ backgroundColor: colors.lightPurple }}>
      <h2 className={`text-center mb-5 animate__animated animate__fadeIn ${cinzel.className}`} 
          style={{ 
            fontSize: "2.8rem", 
            color: colors.black,
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}>
        Ungana Nasi Kwa Njia ya Sadaka
      </h2>
  
      {!username && (
        <div className="text-center mb-5">
          <p className={`${cormorant.className}`} style={{ 
            fontSize: "1.3rem", 
            color: colors.gray,
            lineHeight: "1.6"
          }}>
            Tafadhali{" "}
            <Link href="/auth" className="fw-bold" style={{ 
              color: colors.purple,
              textDecoration: "underline"
            }}>
              Ingia kwenye akaunti yako
            </Link>{" "}
            ili uweze kuweka ahadi.
          </p>
        </div>
      )}
  
      <Row className="g-4 justify-content-center">
        {donationOptions.map((option) => (
          <Col key={option.id} xs={12} md={6} lg={4}>
            <Card
              onClick={() => setSelectedOption(option)}
              className={`cursor-pointer animate__animated ${
                selectedOption?.id === option.id
                  ? "animate__pulse border-3"
                  : "border-2"
              }`}
              style={{
                transition: "all 0.3s ease",
                transform: selectedOption?.id === option.id ? "scale(1.02)" : "scale(1)",
                borderColor: selectedOption?.id === option.id ? colors.purple : colors.black,
                backgroundColor: colors.white,
                minHeight: "220px",
                borderRadius: "12px"
              }}
            >
              <Card.Body className="d-flex align-items-center p-4">
                <div className="me-4">{option.icon}</div>
                <div>
                  <h4 className={`fw-bold ${playfair.className}`} style={{ 
                    color: colors.black, 
                    fontSize: "1.5rem",
                    marginBottom: "12px"
                  }}>
                    {option.title}
                  </h4>
                  <p className={`${cormorant.className}`} style={{ 
                    fontSize: "1.2rem",
                    color: colors.gray,
                    lineHeight: "1.5"
                  }}>
                    {option.description}
                  </p>
                </div>
              </Card.Body>
            </Card>
  
            {selectedOption?.id === option.id && (
              <Card className="mt-4 p-4" style={{ 
                backgroundColor: colors.white,
                border: `3px solid ${colors.purple}`,
                borderRadius: "12px"
              }}>
                <h4 className={`fw-bold mb-4 ${playfair.className}`} style={{ 
                  color: colors.purple, 
                  fontSize: "1.8rem",
                  textAlign: "center"
                }}>
                  {selectedOption.title}
                </h4>
  
                <div className="d-flex gap-3 mb-4">
                  <Button
                    onClick={() => setIsPledge(true)}
                    className="rounded-pill px-4 py-2 fw-bold"
                    style={{ 
                      backgroundColor: isPledge ? colors.purple : colors.white,
                      border: `2px solid ${colors.purple}`,
                      color: isPledge ? colors.white : colors.purple,
                      fontSize: "1.2rem",
                      flex: 1
                    }}
                  >
                    Weka Ahadi
                  </Button>
                  <Button
                    onClick={() => setIsPledge(false)}
                    className="rounded-pill px-4 py-2 fw-bold"
                    style={{ 
                      backgroundColor: !isPledge ? colors.purple : colors.white,
                      border: `2px solid ${colors.purple}`,
                      color: !isPledge ? colors.white : colors.purple,
                      fontSize: "1.2rem",
                      flex: 1
                    }}
                  >
                    Lipa Sasa
                  </Button>
                </div>
  
                <Form>
                  {isPledge && (
                    <>
                      <InputField
                        label="Jina Lako"
                        type="text"
                        placeholder="Ingiza jina lako"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <InputField
                        label="Namba ya Simu"
                        type="tel"
                        placeholder="Ingiza namba ya simu"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </>
                  )}
  
                  <InputField
                    label="Kiasi (TZS)"
                    type="number"
                    placeholder="Ingiza kiasi (e.g., 50,000)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
  
                  {!isPledge && (
                    <Form.Group className="mb-4">
                      <Form.Label className={`fw-bold ${cormorant.className}`} style={{ 
                        fontSize: "1.2rem", 
                        color: colors.black,
                        marginBottom: "8px"
                      }}>
                        Njia ya Malipo
                      </Form.Label>
                      <Form.Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        style={{ 
                          fontSize: "1.1rem",
                          padding: "12px",
                          border: `2px solid ${colors.black}`,
                          borderRadius: "8px"
                        }}
                      >
                        <option value="" disabled>
                          Chagua Njia ya Malipo
                        </option>
                        {paymentOptions.map((method) => (
                          <option key={method.id} value={method.name}>
                            {method.name} ({method.number})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                </Form>
  
                {error && (
                  <div className={`mt-3 ${cormorant.className}`} style={{ 
                    fontSize: "1.2rem",
                    color: "#e74c3c",
                    textAlign: "center"
                  }}>
                    {error}
                  </div>
                )}
  
                <Button
                  onClick={handleSubmit}
                  className="mt-4 w-100 rounded-pill py-3 fw-bold"
                  style={{ 
                    backgroundColor: colors.yellow,
                    border: "none",
                    color: colors.black,
                    fontSize: "1.3rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isPledge ? "Weka Ahadi" : "Lipa Sasa"}
                </Button>
              </Card>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Pledge;