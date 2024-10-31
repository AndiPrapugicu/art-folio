const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-image.jpg";

  // Dacă URL-ul este deja complet
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Dacă începe cu /uploads, adăugăm doar API_URL
  if (imagePath.startsWith("/uploads")) {
    return `${API_URL}${imagePath}`;
  }

  // Pentru compatibilitate cu URL-uri vechi
  return `${API_URL}/uploads/${imagePath}`;
};
