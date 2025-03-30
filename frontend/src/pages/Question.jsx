import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/question.css";

function Question({ formData, setFormData }) {
  // Initialize local state with formData or an empty object if undefined
  const [localData, setLocalData] = useState(formData || {});
  const navigate = useNavigate();

  // Handle changes in the select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission and conditional navigation
  const handleSubmit = () => {
    setFormData(localData);

    // Redirect based on the user's selections
    if (localData.married === "married" && localData.migrant === "migrant") {
      navigate("/taxform2");
    } else if (localData.married === "married" && localData.migrant === "non-migrant") {
      navigate("/taxform4");
    } else if (localData.married === "single" && localData.migrant === "migrant") {
      navigate("/taxform1");
    } else if (localData.married === "single" && localData.migrant === "non-migrant") {
      navigate("/taxform3");
    } else {
      alert("Please select both options!");
    }
  };

  return (
    <div className="question-container">
      <h2>Fill Out the Information</h2>

      <label>Marital Status:</label>
      <select
        name="married"
        onChange={handleChange}
        value={localData.married || ""}
      >
        <option value="">Select</option>
        <option value="married">Married</option>
        <option value="single">Single</option>
      </select>

      <label>Migration Status:</label>
      <select
        name="migrant"
        onChange={handleChange}
        value={localData.migrant || ""}
      >
        <option value="">Select</option>
        <option value="migrant">Immigrant</option>
        <option value="non-migrant">Non-Immigrant</option>
      </select>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Question;
