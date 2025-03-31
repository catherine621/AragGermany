import React, { useState, useEffect } from "react";
import "../css/TaxForm.css";

const TaxForm2 = () => {
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);

  // Fetch user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      console.error("No user ID found in localStorage.");
    } else {
      console.log("Retrieved user ID from localStorage:", storedUserId);
      setUserId(storedUserId);
    }
  }, []);

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Error: User ID is missing!");
      return;
    }

    const payload = {
      user_id: userId, 
      ...formData
    };

    console.log("🔵 Sending payload:", payload);

    try {
      const response = await fetch("http://127.0.0.1:5002/process_tax_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to process tax form");
      }

      // ✅ Convert the response to a blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "filled_tax_form.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("✅ Tax form processed successfully! Check your Downloads folder.");

    } catch (error) {
      console.error("🚨 Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      
      {[  
        { label: "4. Tax Number", name: "4." },
        { label: "5. To the tax office", name: "5." },
        { label: "6. If you change your place of residence: previous tax office", name: "6." },
      ].map(({ label, name, type = "text", options }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          {type === "select" ? (
            <select name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)}>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input type={type} name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)} />
          )}
        </div>
      ))}
      <h3>General Information</h3>
      <h2>Taxable person</h2>
      <h2>Only in case of joint assessment: husband or person A (spouse A / life partner A according to the LPartG)</h2>
      {[
        { label: "7. Telephone inquiries during the day at", name: "7." },
        { label: "8i. Identification number (ID number)", name: "8i." },
        { label: "8ii. Birth date", name: "8ii.", type: "date" },
        { label: "9. Name", name: "9." },
        { label: "10. First name", name: "10." },
        { label: "11i. Title, academic degree", name: "11i." },
        { label: "11ii. Religion Key", name: "11ii.", type: "select", options: [
          { value: "EV", label: "Evangelical (EV)" },
          { value: "RK", label: "Roman Catholic (RK)" },
          { value: "VD", label: "Not subject to church tax (VD)" }
        ]},
        { label: "12. Street (current address)", name: "12." },
        { label: "13i. House number", name: "13i." },
        { label: "13ii. House number suffix", name: "13ii." },
        { label: "13iii. Address supplement", name: "13iii." },
        { label: "14i. Postal code (domestic)", name: "14i." },
        { label: "14ii. Zip code (abroad)", name: "14ii." },
        { label: "15. Place of residence", name: "15." },
        { label: "16. State (if address abroad)", name: "16." },
        { label: "17. Practiced profession", name: "17." },
        { label: "18i. Married / Civil partnership established since", name: "18i.", type: "date" },
        { label: "18ii. Widowed since", name: "18ii.", type: "date" },
        { label: "18iii. Divorced / Civil partnership annulled since", name: "18iii.", type: "date" },
        { label: "18iv. Permanently separated since", name: "18iv.", type: "date" },
      ].map(({ label, name, type = "text", options }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          {type === "select" ? (
            <select name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)}>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input type={type} name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)} />
          )}
        </div>
      ))}
      <h2>Only in the case of joint taxation:Wife or person B (spouse B /life parner B according to the LPartG</h2>
        {[
        { label: "19. ID number", name: "23." },
        { label: "20. Name", name: "24i." },
        { label: "21. First Name", name: "24ii." },
        { label: "22i. Title, academic degree", name: "24iii." },
        { label: "22ii. Religion Key", name: "11ii.", type: "select", options: [
          { value: "EV", label: "Evangelical (EV)" },
          { value: "RK", label: "Roman Catholic (RK)" },
          { value: "VD", label: "Not subject to church tax (VD)" }
        ]},
        
      ].map(({ label, name, type = "text", options }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          {type === "select" ? (
            <select name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)}>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input type={type} name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)} />
          )}
        </div>
      ))}









      <h2>Please only fill in lines 23 to 27 if the address details differ from lines 12 to 16.</h2>
      {[
        { label: "23. Street", name: "23." },
        { label: "24i. House Number", name: "24i." },
        { label: "24ii. House Number Suffix", name: "24ii." },
        { label: "24iii. Address Supplement", name: "24iii." },
        { label: "25i. Zip code(domestic)", name: "25i." },
        { label: "25ii. Zip code(abroad)", name: "25ii." },
        { label: "26. Place of residence", name: "26." },
        { label: "27. State(if address abroad)", name: "27." },
        { label: "28. Practiced profession", name: "28." },
      ].map(({ label, name, type = "text", options }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          {type === "select" ? (
            <select name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)}>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input type={type} name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)} />
          )}
        </div>
      ))}

      <h2>Bank Details - Please always specify</h2>

      {[
        { label: "31. IBAN (domestic financial institution)", name: "31." },
        { label: "32. IBAN (foreign financial institution)", name: "32." },
        { label: "33. BIC to line 32", name: "33." },
        { label: "34. Name (in case of assignment, please submit official assignment form)", name: "34." },
      ].map(({ label, name, type = "text", options }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          {type === "select" ? (
            <select name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)}>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input type={type} name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)} />
          )}
        </div>
      ))}
        
      <h2>The tax assesment should not be sent to me/us, but:</h2>
      <h3>Only fill if tax office does not have the corresponding notification authorization</h3>
      {[
        
        { label: "35. Migration - Name", name: "35." },
        { label: "36. Migration - First Name", name: "36." },
        { label: "37. Migration - Street", name: "37." },
        { label: "38i. Migration - House number", name: "38i." },
        { label: "38ii. Migration - House number suffix", name: "38ii." },
        { label: "38iii. Migration - Mailbox", name: "38iii." },
        { label: "39i. Migration - Zip code (domestic)", name: "39i." },
        { label: "39ii. Migration - Zip code (abroad)", name: "39ii." },
        { label: "40. Migration - Place of residence", name: "40." },
        { label: "41. Migration - State (if address abroad)", name: "41." }
      ].map(({ label, name }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          <input type="text" name={name} value={formData[name] || ""} onChange={(e) => handleChange(e, name)} />
        </div>
      ))}
      
      <button className="submit-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TaxForm2;
