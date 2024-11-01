import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

export const useRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password || !formData.username) {
        throw new Error("Vă rugăm să completați toate câmpurile");
      }

      await axiosInstance.post("/api/auth/register", formData);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Eroare la înregistrare");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    error,
    isLoading,
    handleSubmit,
    handleChange,
  };
};
