'use client';
import React, { useState, useEffect } from "react";
import { addRegisterNotification } from '@/actions/admin';
import axios from "axios";
import { getDefaultRoles } from "@/actions/users";
import PersonalInfoForm from "./PersonalInfoForm";
import PledgesAndSecurityForm from "./PledgesAndSecurityForm";
import DependentsForm from "./DependentsForm";
import SuccessErrorModal from "./SuccessErrorModal";

const Msharika = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    gender: "",
    maritalStatus: "",
    marriageType: "",
    occupation: "Mwanafunzi",
    jumuiya: "Malawi",
    pledges: {
      ahadi: 0,
      jengo: 0,
    },
    password: "",
    confirmPassword: "",
    selectedRoles: [],
    leadershipPositions: [],
    dependents: [{ name: "", dob: "", relation: "" }],
    profilePicture: "",
    kipaimara: false,
    ubatizo: false,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const getDefaultUserRoles = async () => {
      try {
        const defaultRoles = await getDefaultRoles();
        console.log('default roles:', defaultRoles);
        setUserRoles(defaultRoles);
      } catch (error) {
        console.log(error);
      }
    };
    getDefaultUserRoles();
  }, []);

  const handleLeadershipPositionsChange = (updatedLeadershipPositions) => {
    setFormData((prev) => ({
      ...prev,
      leadershipPositions: updatedLeadershipPositions,
    }));
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePledgeChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      pledges: {
        ...prevData.pledges,
        [id]: value,
      },
    }));
  };

  // Handle Date Change
  const handleDateChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      dob: e.target.value,
    }));
  };

  // Handle File Upload
  const handleImageChange = async (e) => {
    const { uploadToCloudinary } = await import("@/actions/uploadToCloudinary");
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        previewUrl: URL.createObjectURL(file),
      }));

      try {
        const result = await uploadToCloudinary(file, setUploadProgress);
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: result.secureUrl,
        }));
        console.log("Uploaded to Cloudinary:", result.secureUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Handle Role Change
  const handleRoleChange = (role) => {
    setFormData((prevData) => {
      const isSelected = prevData.selectedRoles.includes(role);
      const updatedRoles = isSelected
        ? prevData.selectedRoles.filter((r) => r !== role)
        : [...prevData.selectedRoles, role];
      return {
        ...prevData,
        selectedRoles: updatedRoles,
      };
    });
  };

  const handleDependentsChange = (updatedDependents) => {
    setFormData((prevData) => ({
      ...prevData,
      dependents: updatedDependents,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password hazilingani!");
      return;
    }

    try {
      console.log('formData', formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/registerYombo`,
        formData
      );

      const res = await addRegisterNotification({
        name: response.data.user.name,
        type: "registeringNotification",
        userId: response.data.user._id
      });

      setSuccessMessage("Maombi yametumwa, utapokea uthibitisho kwenye simu yako hivi punde!");
      setSuccess(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const closeModal = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className=" mt-0 px-0">
      <form className="p-4 px-0 rounded" onSubmit={handleSubmit}>
       

        {/* Success/Error Modal */}
        <SuccessErrorModal
          errorMessage={errorMessage}
          successMessage={successMessage}
          onClose={closeModal}
        />

        {/* Personal Information Form */}
        <PersonalInfoForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleImageChange={handleImageChange}
          uploadProgress={uploadProgress}
        />

        {/* Pledges and Security Form */}
        <PledgesAndSecurityForm
          formData={formData}
          handlePledgeChange={handlePledgeChange}
          handleInputChange={handleInputChange}
          handleRoleChange={handleRoleChange}
          handleLeadershipPositionsChange={handleLeadershipPositionsChange}
          userRoles={userRoles}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />

        {/* Dependents Form */}
        <DependentsForm
          dependents={formData.dependents}
          onDependentsChange={handleDependentsChange}
        />

      <button 
  type="submit" 
  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg"
>
  <span className="flex items-center justify-center gap-2">
    Jisajili
    <svg 
      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7l5 5m0 0l-5 5m5-5H6" 
      />
    </svg>
  </span>
</button>
      </form>
    </div>
  );
};

export default Msharika;