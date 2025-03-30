import React, { useState, useEffect } from "react";
import "../css/resource.css";

const TaxForms = () => {
  const [taxForms, setTaxForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaxForms = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const response = await fetch(`http://127.0.0.1:5002/get_tax_forms/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTaxForms(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxForms();
  }, []);

  const handleDownload = async (fileId, filename) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID not found!");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5002/download_tax_form/${fileId}?userId=${userId}`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  if (loading) return <div className="loading">Loading tax forms...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="tax-forms-container">
      <h2>Your Tax Forms</h2>
      {taxForms.length === 0 ? (
        <p>No tax forms available</p>
      ) : (
        <ul className="forms-list">
          {taxForms.map((form) => (
            <li key={form.file_id}>
              <button onClick={() => handleDownload(form.file_id, form.filename)}>
                {form.filename}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaxForms;
