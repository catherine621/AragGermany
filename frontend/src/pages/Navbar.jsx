// src/components/Navbar.jsx
import React from "react";
import logo from "../assets/logo.png"; // Adjust the path as needed
import '../css/page-1.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="ARAG Logo" />
            </div>
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/resource">Resource</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/login"><button className="login-btn">Log In</button></a></li>
                <li><a href="/signin"><button className="get-started-btn">Get Started</button></a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
