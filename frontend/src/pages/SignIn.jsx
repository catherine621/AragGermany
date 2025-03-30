import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/SignIn.css";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "", // ✅ Corrected field name
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      
      if (response.status === 201) {
        alert("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        throw new Error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Failed to register. Try again.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Let's Register Account</h2>
        <p>Hello user, you have a great journey ahead!</p>

        <input type="text" name="username" placeholder="Name" onChange={handleChange} /> {/* ✅ Corrected field name */}
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <button className="signin-btn" onClick={handleSubmit}>Sign Up</button>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
