import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DocumentView = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/document/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (response.ok) setDocument(data);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  if (!document) return <p>Loading document...</p>;

  return (
    <div className="document-view">
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{document.name}</h2>
      <p><strong>Date:</strong> {document.dateCompleted}</p>
      <p><strong>Year:</strong> {document.year}</p>
      <p><strong>Time:</strong> {document.timeCompleted}</p>
      <p><strong>Content:</strong> {document.content}</p>
    </div>
  );
};

export default DocumentView;
