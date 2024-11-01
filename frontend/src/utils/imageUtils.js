const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-image.jpg";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads")) {
    return `${API_URL}${imagePath}`;
  }

  return `${API_URL}/uploads/${imagePath}`;
};
