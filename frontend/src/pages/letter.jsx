import React, { useState } from "react";
import "./letter.css";

const LetterTranslation = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [salutation, setSalutation] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [closing, setClosing] = useState("");
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    // Prevent translation if fields are empty
    if (!from || !to || !date || !salutation || !subject || !body || !closing) {
      alert("Please fill in all fields before translating.");
      return;
    }

    try {
      setLoading(true); // Show loading state

      const formData = new FormData();
      formData.append("from", from);
      formData.append("to", to);
      formData.append("date", date);
      formData.append("salutation", salutation);
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("closing", closing);

      if (signature) {
        formData.append("signature", signature);
      }

      const response = await fetch("http://127.0.0.1:5000/translate", { 
        method: "POST",
        body: formData // Sending as FormData to include file
      });

      if (!response.ok) {
        throw new Error("Translation failed!");
      }

      // Create a downloadable link for the PDF file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "translated_letter.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error("Translation error:", error);
      alert("An error occurred while translating. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleSignatureUpload = (event) => {
    setSignature(event.target.files[0]);
  };

  return (
    <div className="letter-container">
      <h1 className="letter-heading">Letter Translation</h1>
      
      <label>FROM (Sender's Address):</label>
      <textarea value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your Address" />
      
      <label>TO (Recipient’s Address):</label>
      <textarea value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient’s Address" />
      
      <label>DATE [Day, Month, Year]:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      
      <label>Salutation:</label>
      <input type="text" value={salutation} onChange={(e) => setSalutation(e.target.value)} placeholder="Dear [Recipient’s Name]," />
      
      <label>Subject Line:</label>
      <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Letter Subject" />
      
      <label>Body of the Letter:</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter the body of the letter here..." />
      
      <label>Closing:</label>
      <input type="text" value={closing} onChange={(e) => setClosing(e.target.value)} placeholder="Sincerely, Regards, etc." />
      
      <label>Signature (Upload):</label>
      <input type="file" accept="image/*" onChange={handleSignatureUpload} />
      
      <button className="translate-btn" onClick={handleTranslate} disabled={loading}>
        {loading ? "Translating..." : "Translate & Download PDF"}
      </button>
    </div>
  );
};

export default LetterTranslation;
