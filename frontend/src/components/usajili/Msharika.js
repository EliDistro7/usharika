
'use client';
import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { ProgressBar, Form, InputGroup, Button } from "react-bootstrap";
import {addRegisterNotification} from '@/actions/admin'
import {uploadToCloudinary} from "@/actions/uploadToCloudinary";
import axios from "axios";
import { formatRoleName } from "@/actions/utils";
import Link from "next/link";
import { getDefaultRoles } from "@/actions/users";
import { Tabs, Tab } from "react-bootstrap";




const jumuiyas = ["Malawi", "Kanisani", "Golani"];

const Msharika= () => {
  const [dependents, setDependents] = useState([{ name: "", dob: "", relation: "" }]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [password, setPassword] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedJumuiya, setSelectedJumuiya] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSucces] = useState(false);
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "", // Maps to fullName in schema
    dob: "",
    phone: "",
    gender: "",
    maritalStatus: "",
    marriageType: "",
    occupation: "Mwanafunzi", // Default value
    jumuiya: "Malawi", // Default Jumuiya
    pledges: {
      ahadi: 0, // Maps to pledges.ahadi
      jengo: 0, // Maps to pledges.jengo
    },
    gender: "me", // Default gender
    password: "",
    confirmPassword: "",
    selectedRoles: [],
    dependents: [{ name: "", dob: "", relation: "" }],
    profilePicture: "",
    kipaimara:false,
    ubatizo:false,
  });
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
     // Determine marital status options based on gender
  const maritalStatusOptions =
  formData.gender === "me"
    ? [
        { value: "umeoa", label: "Umeoa" },
        { value: "hujaoa", label: "Hujaoa" },
      ]
    : formData.gender === "ke"
    ? [
        { value: "umeolewa", label: "Umeolewa" },
        { value: "hujaolewa", label: "Hujaolewa" },
      ]
    : [];

    useEffect( ()=>{
      const getDefaultUserRoles = async ()=>{
        try {
          const defaultRoles = await getDefaultRoles();
          //console.log('default roles:', defaultRoles)
          setUserRoles(defaultRoles);
          } catch(error){
            console.log(error)
          }
      }
      getDefaultUserRoles();
     
    }, [])

    // Handle Input Change
    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    };

    const handlePledgeChange = (e) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        pledges: {
          ...prevData.pledges,
          [id]: value, // Dynamically update ahadi or jengo
        },
      }));
    };

   

    function RoleSelector({ userRoles, formData, handleRoleChange }) {
      // Categorize roles
      const kiongoziRoles = userRoles.filter((role) => role.startsWith("kiongozi_"));
      const choirRoles = userRoles.filter((role) =>
        !role.toLowerCase().includes("kiongozi_kwaya") && role.toLowerCase().includes("kwaya")
      );
      const otherRoles = userRoles.filter(
        (role) =>
          !role.startsWith("kiongozi_") &&
          !role.toLowerCase().includes("choir") &&
          !role.toLowerCase().includes("kwaya")
      );
    
      // Helper function to render checkboxes
      const renderRoleCheckboxes = (roles) => {
        return roles.map((role) => (
          <div className="form-check" key={role}>
            <input
              type="checkbox"
              id={role}
              className="form-check-input"
              checked={formData.selectedRoles.includes(role)}
              onChange={() => handleRoleChange(role)}
            />
            <label className="form-check-label">{formatRoleName(role)}</label>
          </div>
        ));
      };
    
      return (
        <Tabs defaultActiveKey="kiongozi" id="role-tabs" className="mb-3">
          {/* Tab for Kiongozi Roles */}
          <Tab eventKey="kiongozi" title="Kiongozi">
            {kiongoziRoles.length > 0 ? (
              renderRoleCheckboxes(kiongoziRoles)
            ) : (
              <p className="text-muted">No Kiongozi roles available.</p>
            )}
          </Tab>
    
          {/* Tab for Choir Roles */}
          <Tab eventKey="choir" title="Kwaya">
            {choirRoles.length > 0 ? (
              renderRoleCheckboxes(choirRoles)
            ) : (
              <p className="text-muted">No Choir roles available.</p>
            )}
          </Tab>
    
          {/* Tab for Other Roles */}
          <Tab eventKey="others" title="Mwanakikundi">
            {otherRoles.length > 0 ? (
              renderRoleCheckboxes(otherRoles)
            ) : (
              <p className="text-muted">No other roles available.</p>
            )}
          </Tab>
        </Tabs>
      );
    }
    
   
    
    
  
    // Handle Date Change
    const handleDateChange = (e) => {
      setFormData((prevData) => ({
        ...prevData,
        dob: e.target.value,
      }));
    };
  
    // Handle File Upload
    const handleImageChange = async (e) => {
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
            profilePicture: result.secureUrl, // Store the secure URL
          }));
          console.log("Uploaded to Cloudinary:", result.secureUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  
    // Handle Select Change
    const handleSelectChange = (e) => {
      const { value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        selectedJumuiya: value,
      }));
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
  
    // Add Dependent
    const addDependent = () => {
      setFormData((prevData) => ({
        ...prevData,
        dependents: [...prevData.dependents, { name: "", dob: "", relation: "" }],
      }));
    };
  
    // Remove Dependent
    const removeDependent = (index) => {
      setFormData((prevData) => {
        const updatedDependents = prevData.dependents.filter(
          (dependent, i) => i !== index
        );
        return {
          ...prevData,
          dependents: updatedDependents,
        };
      });
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setErrorMessage("Password hazilingani!");
      return;
    }
  
  
  
    try {
      //console.log('formData', formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/registerYombo`,
        formData);
  
      //console.log("Response:", response.data);
      const res=await addRegisterNotification({name:response.data.user.name,type:"registeringNotification", userId:response.data.user._id});
      
      setSuccessMessage("Maombi yametumwa, utapokea uthibitisho kwenye simu yako hivi punde!");
      //console.log('addRegisterNotification', res);
      setSucces(true)
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.response.data.message);
    }
  };

    // Categorize roles
    const kiongoziRoles = userRoles.filter((role) => role.startsWith("kiongozi_"));
    const otherRoles = userRoles.filter((role) => !role.startsWith("kiongozi_"));

  const renderRoleCheckboxes = (roles) => {
    return roles.map((role) => (
      <div className="form-check" key={role}>
        <input
          type="checkbox"
          id={role}
          className="form-check-input"
          checked={formData.selectedRoles.includes(role)}
          onChange={() => handleRoleChange(role)}
        />
        <label className="form-check-label">{formatRoleName(role)}</label>
      </div>
    ));
  };



  return (
    <div className="container mt-5">
      <form className="p-4 rounded shadow bg-light" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4 text-primary fw-bold">Usajili wa Msharika</h2>

        {(errorMessage || successMessage) && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h5 className="modal-title">{errorMessage ? 'Haikufanikiwa, jaribu tena' : 'Hongera, umefanikiwa kujisajili!'}</h5>
         
          
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setErrorMessage('');
              setSuccessMessage('');
            }}
          ></button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div>
  <div className="alert alert-success" role="alert">
    {successMessage}
  </div>
  <div className="mt-3">
  <Link href="/auth" className="btn btn-primary">
    Login
  </Link>
</div>
</div>
)}



        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setErrorMessage('');
              setSuccessMessage('');
            }}
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Basic Information */}
        <div className="mb-4">
          <h3 className="text-secondary fw-bold">Taarifa ya Msharika</h3>
          <div className="form-group">
            <label htmlFor="photo" className="fw-bold">Picha</label>
            <input
              type="file"
              accept="image/*"
              id="photo"
              className="form-control-file"
              onChange={handleImageChange}
            />
            {formData.previewUrl && (
              <div className="mt-3">
                <img
                  src={formData.previewUrl}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
               {uploadProgress > 0 && (
              <ProgressBar
                animated
                now={uploadProgress}
                label={`${uploadProgress}%`}
                className="mt-2"
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="fw-bold">Jina *</label>
            <input
              type="text"
              id="name"
              className="form-control"
              onChange={handleInputChange}
              value={formData.name}
              placeholder="Jina la Msharika"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label htmlFor="dob" className="fw-bold">Tarehe ya Kuzaliwa</label>
            <input
              type="date"
              id="dob"
              className="form-control"
              onChange={handleDateChange}
              value={formData.dob}
            />
          </div>

        {/* Gender Dropdown */}
     <div className="mb-3">
  {/* Gender Selection */}
  <label htmlFor="gender" className="form-label fw-bold">
    Jinsia
  </label>
  <select
    id="gender"
    className="form-select"
    value={formData.gender}
    onChange={handleInputChange}
    name="gender"
  >
    <option value="">Chagua Jinsia...</option>
    <option value="me">Me</option>
    <option value="ke">Ke</option>
  </select>
</div>

      {/* Ubatizo Checkbox */}
      <div className="form-check mb-3">
      <label htmlFor="ubatizo" className="form-check-label">
          Umepata Ubatizo ?
        </label>
        <input
          type="checkbox"
          className="form-check-input"
          id="ubatizo"
          name="ubatizo"
          checked={formData.ubatizo}
          onChange={handleInputChange}
        />
        
      </div>

      {/* Kipaimara Checkbox */}
 <div className="form-check mb-3">
 <label htmlFor="kipaimara" className="form-check-label">
          Umepata Kipaimara ?
        </label>
        <input
          type="checkbox"
          className="form-check-input"
          id="kipaimara"
          name="kipaimara"
          checked={formData.kipaimara}
          onChange={handleInputChange}
        />
       
      </div>

{/* Marital Status Dropdown (Shown after gender is selected) */}
{formData.gender && (
  <div className="mb-3">
    <label htmlFor="maritalStatus" className="form-label fw-bold">
      Ndoa
    </label>
    <select
      id="maritalStatus"
      className="form-select"
      value={formData.maritalStatus}
      onChange={handleInputChange}
      name="maritalStatus"
    >
      <option value="">Chagua...</option>
      {formData.gender === "me" ? (
        <>
          <option value="umeoa">Umeoa</option>
          <option value="hujaoa">Hujaoa</option>
        </>
      ) : (
        <>
          <option value="umeolewa">Umeolewa</option>
          <option value="hujaolewa">Hujaolewa</option>
        </>
      )}
    </select>
  </div>
)}

{/* Marriage Type Dropdown (Only visible if married is selected) */}
{(formData.maritalStatus === "umeoa" ||
  formData.maritalStatus === "umeolewa") && (
  <div className="mb-3">
    <label htmlFor="marriageType" className="form-label fw-bold">
      Aina ya ndoa
    </label>
    <select
      id="marriageType"
      className="form-select"
      value={formData.marriageType}
      onChange={handleInputChange}
      name="marriageType"
    >
      <option value="">Chagua aina ya ndoa...</option>
      <option value="Ndoa ya Kikristo">Ndoa ya Kikristo</option>
      <option value="Ndoa ya Kiserikali">Ndoa ya Kiserikali</option>
      <option value="Nyingineyo">Nyingineyo</option>
    </select>
  </div>
)}


          <div className="form-group">
            <label htmlFor="phone" className="fw-bold">Namba ya Simu *</label>
            <input
              type="tel"
              id="phone"
              className="form-control"
              placeholder="+255 XXX XXX XXX"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation" className="fw-bold">Kazi/Occupation *</label>
            <input
              type="text"
              id="occupation"
              className="form-control"
              placeholder="Kazi ya Msharika"
              onChange={handleInputChange}
              required
            />
          </div>
          <span className='text-danger text-sm'>Kama ni mwanafunzi ingiza "mwanafunzi"</span>
        </div>

        {/* Community Select */}
        <div className="form-group">
          <label htmlFor="community" className="fw-bold">Jumuiya unayosali au unayotarajia kusali*</label>
          <select
            id="jumuiya"
            className="form-control"
            value={formData.jumuiya}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Chagua Jumuiya</option>
            {jumuiyas.map((jumuiya) => (
              <option key={jumuiya} value={jumuiya}>{jumuiya}</option>
            ))}
          </select>
        </div>

        {/* Financial Commitments */}
        <div className="mb-4">
          <h3 className="text-secondary fw-bold">Sadaka za ahadi</h3>
          <div className="form-group">
            <label htmlFor="pledgeAhadi" className="fw-bold">Ahadi *</label>
            <input
              type="number"
              id="ahadi"
              className="form-control"
              placeholder="Kiasi cha Ahadi"
              onChange={handlePledgeChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jengo" className="fw-bold">Jengo *</label>
            <input
              type="number"
              id="jengo"
              className="form-control"
              placeholder="Kiasi cha Jengo"
              onChange={handlePledgeChange}
              required
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="mb-4">
      <h3 className="text-secondary fw-bold">Nenosiri</h3>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password" className="fw-bold">
          Password *
        </Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Ingiza password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </InputGroup>
        <Form.Text className="text-danger text-xs">
          Tunza password yako
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="confirmPassword" className="fw-bold">
          Thibitisha Password yako *
        </Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </Form.Group>
    </div>

        {/* User Roles */}
        <div className="mb-4">
          <h3 className="text-secondary fw-bold">Vikundi unavyoshiriki au una nafasi unazohudumu kanisani</h3>
          <span className='text-danger text-xs'>hakikisha unaingiza vikundi vyote unavyoshiriki au nafasi za kiuongozi</span>
          {RoleSelector({ userRoles, formData, handleRoleChange })}
        </div>

        {/* Dependents Section */}
        <div className="mb-4">
          <h3 className="text-secondary fw-bold">Wategemezi</h3>
          {formData.dependents.map((dependent, index) => (
            <div className="dependent" key={index}>
              <div className="form-group">
                <label htmlFor={`dependentName${index}`} className="fw-bold">Jina la Mtegemezi</label>
                <input
                  type="text"
                  id={`dependentName${index}`}
                  className="form-control"
                  placeholder="Jina la Mtegemezi"
                  value={dependent.name}
                  onChange={(e) =>
                    setFormData((prevData) => {
                      const updatedDependents = prevData.dependents.map((d, i) =>
                        i === index ? { ...d, name: e.target.value } : d
                      );
                      return { ...prevData, dependents: updatedDependents };
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={`dependentRelation${index}`} className="fw-bold">Uhusiano na Msharika</label>
                <input
                  type="text"
                  id={`dependentRelation${index}`}
                  className="form-control"
                  placeholder="Uhusiano"
                  value={dependent.relation}
                  onChange={(e) =>
                    setFormData((prevData) => {
                      const updatedDependents = prevData.dependents.map((d, i) =>
                        i === index ? { ...d, relation: e.target.value } : d
                      );
                      return { ...prevData, dependents: updatedDependents };
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={`dependentDob${index}`} className="fw-bold">Tarehe ya kuzaliwa</label>
                <input
                  type="date"
                  id={`dependentDob${index}`}
                  className="form-control"
                  value={dependent.dob}
                  onChange={(e) =>
                    setFormData((prevData) => {
                      const updatedDependents = prevData.dependents.map((d, i) =>
                        i === index ? { ...d, dob: e.target.value } : d
                      );
                      return { ...prevData, dependents: updatedDependents };
                    })
                  }
                />
              </div>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeDependent(index)}
              >
                <FaMinusCircle />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addDependent}>
            <FaPlusCircle /> Ongeza Mtegemezi
          </button>
        </div>

        <button type="submit" className="btn btn-success w-100">Jisajili</button>
      </form>
    </div>
  );
};

export default Msharika;






