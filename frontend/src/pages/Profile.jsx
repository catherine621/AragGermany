import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profile.css";
import logo from "../assets/logo.png"; // Logo from assets
import profilePicPlaceholder from "../assets/person.png"; // Profile picture from assets

const Profile = () => {
  const navigate = useNavigate();
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

  const [profilePic, setProfilePic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) throw new Error("Unauthorized. Please log in.");
        if (res.status === 404) throw new Error("Profile not found. Please fill in the details.");

        const data = await res.json();
        const { _id, userId, __v, ...filteredData } = data;
        setFormData(filteredData);
        setProfilePic(data.profilePic || profilePicPlaceholder);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError(error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setError("Only image files (JPG, PNG, JPEG) are allowed.");
      return;
    }
    setSelectedFile(file);
    setProfilePic(URL.createObjectURL(file));
  };

  return (
    <div className="profile-container">
      <header>
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <div className="profile-content">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <h2>Profile Details</h2>
        <form>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
        <Link to="/edit-profile">Edit Profile</Link>
      </div>
    </div>
  );
};

export default Profile;
