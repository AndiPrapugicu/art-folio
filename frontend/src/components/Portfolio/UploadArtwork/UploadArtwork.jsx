import { useState } from "react";
import { Input, Button, Textarea } from "../../common";
import axiosInstance from "../../../utils/axiosConfig";
import "./UploadArtwork.css";

const UploadArtwork = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Titlul este obligatoriu";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrierea este obligatorie";
    }

    if (!formData.image) {
      newErrors.image = "Imaginea este obligatorie";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.image);

    try {
      await axiosInstance.post("/api/artworks", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({
        title: "",
        description: "",
        image: null,
      });
      alert("Artwork încărcat cu succes!");
    } catch (error) {
      console.error("Eroare la încărcarea artwork-ului:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Eroare la încărcare. Încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-artwork-container">
      <form onSubmit={handleSubmit} className="upload-artwork-form">
        <h2>Încarcă Artwork Nou</h2>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          label="Titlu"
          placeholder="Introduceți titlul artwork-ului"
          required
          error={errors.title}
          disabled={isLoading}
        />

        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label="Descriere"
          placeholder="Descrieți artwork-ul"
          required
          error={errors.description}
          disabled={isLoading}
          rows={4}
          maxLength={500}
        />

        <Input
          type="file"
          name="image"
          onChange={handleChange}
          label="Imagine"
          accept="image/*"
          required
          error={errors.image}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          isLoading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? "Se încarcă..." : "Încarcă Artwork"}
        </Button>
      </form>
    </div>
  );
};

export default UploadArtwork;
