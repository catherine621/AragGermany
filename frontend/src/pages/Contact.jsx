import React from "react";
import "../css/contact.css";
import womanImage from "../assets/woman-briefcase.png";
import phoneImage from "../assets/phone.png";

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Heading Section */}
      <h2>Contact Us</h2>
      <p>Some contact information on how to reach out</p>

      <div className="contact-content">
        {/* Left Image - Properly Scaled */}
        <div className="contact-image-left">
          <img src={womanImage} alt="Woman with briefcase" />
        </div>

        {/* Contact Form - Centered */}
        <form className="contact-form">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Query" required></textarea>
          <button type="submit">Send Message</button>
        </form>

        {/* Right Image - Phone */}
        <div className="contact-image-right">
          <img src={phoneImage} alt="Phone illustration" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
