'use client';

import React, { useState, useEffect } from "react";
import { FaHandHoldingHeart, FaChurch, FaGraduationCap, FaCoins } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "@/hooks/useUser";
import { addPledge } from "@/actions/pledge";

const paymentOptions = [
  { id: "mpesa", name: "MPESA", number: "255-123-456-789" },
  { id: "tigopesa", name: "TIGOPESA", number: "255-987-654-321" },
  { id: "airtel", name: "AIRTEL MONEY", number: "255-567-890-123" },
  { id: "halopesa", name: "HALOPESA", number: "255-456-789-012" },
  { id: "bank", name: "Bank Account", number: "Bank XYZ, Acc: 123456789" },
];

const donationOptions = [
  { id: 1, title: "Maboresho ya kanisa", description: "Tuungane mkono wapendwa kuboresha kanisa letu", icon: <FaChurch className="fs-1 text-primary" /> },
  { id: 2, title: "Sadaka ya Mabenchi", description: "Tunaomba washarika mmalizie ahadi zenu za kuongeza mabenchi kwenye kanisa letu", icon: <FaGraduationCap className="fs-1 text-success" /> },
  { id: 3, title: "Diakonia", description: "Wiki tutatembelea kitu cha mwane kuwaona watoto, shiriki nasi baraka hizi kwa sadaka yako ya hali na mali", icon: <FaHandHoldingHeart className="fs-1 text-danger" /> },
  { id: 4, title: "Kulipa Deni", description: "Tuungane pamoja ili kumaliza deni letu la kanisa kabla ya mwaka huu kuisha.", icon: <FaCoins className="fs-1 text-warning" /> },
];

const InputField = ({ label, type, placeholder, value, onChange, required }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">{label}</label>
    <input
      type={type}
      className="form-control"
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
          setUsername(user.name || "");
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
        // Prepare payload for the pledge
        const payload = {
          name: username,
          pledgeName: selectedOption.title,
          pledgeAmount: parseFloat(amount),
        };
  
        // Call the addPledge function
        await addPledge(payload);
        toast.success(message);
      } else {
        toast.success(message); // For immediate payments
      }
  
      // Reset fields
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
    <div className="container-fluid videobg py-5">
      <h2 className="text-center fw-bold mb-4">Ungana nasi kwa njia ya Sadaka</h2>

      <div className="row g-4">
        {donationOptions.map((option) => (
          <div key={option.id} className="w-100">
            <div
              onClick={() => setSelectedOption(option)}
              className={`cursor-pointer p-3 rounded d-flex align-items-center ${
                selectedOption?.id === option.id ? "border-primary bg-light" : "border-secondary"
              }`}
            >
              {option.icon}
              <div className="ms-3">
                <h4 className="fw-bold">{option.title}</h4>
                <p className="text-black">{option.description}</p>
              </div>
            </div>

            {selectedOption?.id === option.id && (
              <div className="mt-3 p-4 rounded border">
                <h4 className="fw-bold mb-4">{selectedOption.title}</h4>

                <div className="d-flex gap-3 mb-4">
                  <button
                    className={`btn ${isPledge ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setIsPledge(true)}
                  >
                    Weka ahadi
                  </button>
                  <button
                    className={`btn ${!isPledge ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setIsPledge(false)}
                  >
                    Lipa sasa
                  </button>
                </div>

                <form>
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
                    <div className="mb-3">
                      <label className="form-label fw-bold">Njia ya Malipo</label>
                      <select
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Chagua njia ya Malipo
                        </option>
                        {paymentOptions.map((method) => (
                          <option key={method.id} value={method.name}>
                            {method.name} ({method.number})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form>

                {error && <div className="text-danger mt-3">{error}</div>}

                <button onClick={handleSubmit} className="btn btn-primary mt-4">
                  {isPledge ? "Weka ahadi" : "Lipa sasa"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Pledge;
