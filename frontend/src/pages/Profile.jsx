import React, { useState } from "react";
import "../css/profile.css";
import profilePic from "../assets/person.png";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate(); // ✅ Declare navigate inside the component

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    country: "",
    maritalStatus: "",
    spouseName: "",
    childrenCount: "",
    address: "",
    passportNumber: "",
    companyName: "",
    phoneNumber: "",
    email: "",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    dateOfBirth: "",
  });

  const [message, setMessage] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        country: "",
        maritalStatus: "",
        spouseName: "",
        childrenCount: "",
        address: "",
        passportNumber: "",
        companyName: "",
        phoneNumber: "",
        email: "",
        agentName: "",
        agentPhone: "",
        agentEmail: "",
        dateOfBirth: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2 className="o">Welcome, User</h2>
        <div className="profile-card">
          <img src={profilePic} alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <h3>{formData.firstName} {formData.lastName}</h3>
            <p>{formData.email}</p>
          </div>
        </div>

        {/* Form Section */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="maritalStatus" placeholder="Marital Status" value={formData.maritalStatus} onChange={handleChange} />
            <input type="text" name="spouseName" placeholder="Spouse Name" value={formData.spouseName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="text" name="childrenCount" placeholder="No. of Children" value={formData.childrenCount} onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="passportNumber" placeholder="Passport Number" value={formData.passportNumber} onChange={handleChange} />
            <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="agentName" placeholder="Agent Name" value={formData.agentName} onChange={handleChange} />
            <input type="tel" name="agentPhone" placeholder="Agent Phone" value={formData.agentPhone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="email" name="agentEmail" placeholder="Agent Email" value={formData.agentEmail} onChange={handleChange} />
            <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn">Save Profile</button>
        </form>

        {message && <p className="response-message">{message}</p>}
        <button className="create-new-button" onClick={() => {console.log("Button clicked! Navigating..."); navigate("/letter");}}>
   Attach letter
    </button>
        
      </div>
    </div>
    
  );
};

export default Profile;
