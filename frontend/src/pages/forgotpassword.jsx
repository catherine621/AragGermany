import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/forgotpassword.css";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Password successfully reset!");
      // Redirect or handle password reset logic here
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Create New Password</h2>
      <p className="forgot-password-subtitle">
        Enter your new password if you forgot it.
      </p>

      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>

        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            👁️
          </span>
        </div>

        <button type="submit" className="continue-button">Continue</button>
      </form>


    </div>
  );
};

export default ForgotPassword;
