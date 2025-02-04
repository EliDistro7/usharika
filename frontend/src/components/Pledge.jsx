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
import { Merriweather } from "next/font/google";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"], // Include regular and bold weights
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
});


const paymentOptions = [
  { id: "mpesa", name: "MPESA", number: "255-123-456-789" },
  { id: "tigopesa", name: "TIGOPESA", number: "255-987-654-321" },
  { id: "airtel", name: "AIRTEL MONEY", number: "255-567-890-123" },
  { id: "halopesa", name: "HALOPESA", number: "255-456-789-012" },
  { id: "bank", name: "Bank Account", number: "Bank XYZ, Acc: 123456789" },
];

const donationOptions = [
  { id: 1, title: "Maboresho ya Kanisa", description: "Tuungane mkono wapendwa kuboresha kanisa letu", icon: <FaChurch className="fs-1 text-primary" /> },
  { id: 2, title: "Sadaka ya Mabenchi", description: "Tunaomba washarika mmalizie ahadi zenu za kuongeza mabenchi kwenye kanisa letu", icon: <FaGraduationCap className="fs-1 text-success" /> },
  { id: 3, title: "Diakonia", description: "Wiki tutatembelea kitu cha mwane kuwaona watoto, shiriki nasi baraka hizi kwa sadaka yako ya hali na mali", icon: <FaHandHoldingHeart className="fs-1 text-danger" /> },
  { id: 4, title: "Kulipa Deni", description: "Tuungane pamoja ili kumaliza deni letu la kanisa kabla ya mwaka huu kuisha.", icon: <FaCoins className="fs-1 text-warning" /> },
];

const InputField = ({ label, type, placeholder, value, onChange, required }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">{label}</label>
    <input
      type={type}
      className="form-control shadow-sm border-0"
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
        const user = await getUser(); // Fetch user data
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
    <div className={`px-4 py-5 ${merriweather.className}`} >
      <h2 className="text-center fw-bold text-purple mb-4 animate__animated animate__fadeIn">
        Ungana nasi kwa njia ya Sadaka
      </h2>
  
      {/* Login prompt */}
      {!username && (
        <div className="text-center mb-4">
          <p className="text-muted">
            Tafadhali{" "}
            <Link href="/auth" className="text-purple fw-bold">
              log in kwenye akaunti yako
            </Link>{" "}
            ili uweze kuweka ahadi.
          </p>
        </div>
      )}
  
      <Row className="g-4">
        {donationOptions.map((option) => (
          <Col key={option.id} xs={12} md={6} lg={4}>
            <Card
              onClick={() => setSelectedOption(option)}
              className={`cursor-pointer shadow-lg animate__animated ${
                selectedOption?.id === option.id
                  ? "animate__pulse border-purple bg-light-purple"
                  : "border-light"
              }`}
              style={{
                transition: "transform 0.3s ease",
                transform: selectedOption?.id === option.id ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="text-purple">{option.icon}</div>
                <div className="ms-3">
                  <h4 className="fw-bold text-purple">{option.title}</h4>
                  <p className="text-muted">{option.description}</p>
                </div>
              </Card.Body>
            </Card>
  
            {selectedOption?.id === option.id && (
              <Card className="mt-3 p-4 bg-white border-purple shadow">
                <h4 className="fw-bold mb-4 text-purple">{selectedOption.title}</h4>
  
                <div className="d-flex gap-3 mb-4">
                  <Button
                    variant={isPledge ? "purple" : "outline-purple"}
                    onClick={() => setIsPledge(true)}
                    className="rounded-pill px-4 fw-bold text-white"
                  >
                    Weka ahadi
                  </Button>
                  <Button
                    variant={!isPledge ? "purple" : "outline-purple"}
                    onClick={() => setIsPledge(false)}
                    className="rounded-pill px-4 fw-bold"
                  >
                    Lipa sasa
                  </Button>
                </div>
  
                <Form>
                  {isPledge && (
                    <>
                      <InputField
                        label="Jina lako"
                        type="text"
                        placeholder="Ingiza jina lako"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <InputField
                        label="Namba ya simu"
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
                    placeholder="Ingiza kiasi (e.g., 50)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
  
                  {!isPledge && (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-purple">Njia ya Malipo</Form.Label>
                      <Form.Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="border-purple"
                      >
                        <option value="" disabled>
                          Chagua njia ya Malipo
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
  
                {error && <div className="text-danger mt-3">{error}</div>}
  
                <Button
                  onClick={handleSubmit}
                  variant="purple"
                  className="mt-4 w-100 rounded-pill py-2 fw-bold text-white"
                >
                  {isPledge ? "Weka ahadi" : "Lipa sasa"}
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
