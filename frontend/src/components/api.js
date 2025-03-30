const API_BASE_URL = "http://localhost:5000/api/resources";

// Upload File API
export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// Get User-Specific Files API
export const getUserFiles = async (token) => {
  const response = await fetch(`${API_BASE_URL}/user-files`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
