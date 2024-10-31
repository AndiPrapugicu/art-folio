import axios from "axios";

const API_URL = "http://localhost:3000/api/"; // Adăugați '/api' la URL

export const addArtwork = async (artwork) => {
  try {
    const response = await axios.post(`${API_URL}/add`, artwork, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding artwork:", error);
    throw error;
  }
};

export const getArtworks = async () => {
  const response = await axios.get(`${API_URL}artworks`);
  return response.data;
};

export const createArtwork = async (artwork) => {
  const response = await axios.post(`${API_URL}artworks`, artwork);
  return response.data;
};

export const updateArtwork = async (id, artwork) => {
  const response = await axios.put(`${API_URL}artworks/${id}`, artwork);
  return response.data;
};

export const deleteArtwork = async (id) => {
  await axios.delete(`${API_URL}artworks/${id}`);
};

// Pentru încărcarea de fișiere, folosiți ruta 'upload'
export const uploadArtwork = async (formData) => {
  const response = await axios.post(`${API_URL}artworks/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
