import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import
import "../css/login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Stored Token:", localStorage.getItem("token"));
    console.log("Stored User ID:", localStorage.getItem("user_id"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", data);

      if (response.ok && data.token) {
        // Store token
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);

        // Decode the token to extract user ID
        try {
          const decoded = jwtDecode(data.token);
          console.log("Decoded Token:", decoded);

          if (decoded._id) {
            localStorage.setItem("user_id", decoded._id); // Store user ID
            console.log("Stored User ID:", decoded._id);
          } else {
            console.error("User ID not found in token");
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
        }

        // Redirect to dashboard
        window.location.href = "/Resource";
      } else {
        console.error("Login failed:", data.message);
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    console.log("User logged out. Local storage cleared.");
    window.location.reload(); // Refresh to apply changes
  };
  

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    console.log("Login Response:", data); // Debugging
  
    if (response.ok) {
      localStorage.setItem("token", data.token);  // Save token
      localStorage.setItem("user_id", data.user_id);  // Save user_id
      console.log("User ID saved:", data.user_id);
  }
     else {
      console.error("Login failed:", data.error);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Let's Sign You In</h2>
        <p className="login-subtitle">Welcome Back, You Have Been Missed</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email, phone & username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              style={{ background: "none", border: "none", cursor: "pointer" }}
>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" className="login-button">Log In</button>
        </form>

        <p className="register-text">
          Don't have an account? <Link to="/signin">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
