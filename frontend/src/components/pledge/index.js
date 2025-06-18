'use client';

import React, { useState, useEffect } from "react";
import { FaHandHoldingHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { Row, Col, Container } from "react-bootstrap";
import { getUser } from "@/hooks/useUser";
import { addPledge } from "@/actions/pledge";

// Import our separated components and constants
import { colors, donationOptions, cinzel, playfair } from './constants';
import { DonationCard, AuthNotice, PledgeModal } from './components';

const Pledge = () => {
  // State Management
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPledge, setIsPledge] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data on component mount
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

  // Event Handlers
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

    // Validation
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
            Tuungane mkono ili kuendeleza kazi za kiMungu na kuboresha mazingira yetu ya ibada
          </p>
        </div>

        {/* Auth Notice */}
        <AuthNotice username={username} />

        {/* Donation Options Grid */}
        <Row className="g-4 mb-5">
          {donationOptions.map((option, index) => (
            <Col key={option.id} xs={12} md={6} lg={6}>
              <DonationCard 
                option={option} 
                index={index} 
                onCardClick={handleCardClick}
              />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Pledge Modal */}
      <PledgeModal
        showModal={showModal}
        selectedOption={selectedOption}
        onCloseModal={handleCloseModal}
        isPledge={isPledge}
        setIsPledge={setIsPledge}
        amount={amount}
        setAmount={setAmount}
        username={username}
        setUsername={setUsername}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        error={error}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      
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
        
        .modal-backdrop {
          background-color: ${colors.modalOverlay} !important;
        }
        
        .form-control::placeholder {
          color: ${colors.textSecondary} !important;
          opacity: 0.7;
        }
        
        .form-select {
          color: ${colors.text} !important;
        }
        
        .form-select option {
          color: ${colors.text} !important;
          background-color: ${colors.surface} !important;
        }
      `}</style>
    </div>
  );
};

export default Pledge;