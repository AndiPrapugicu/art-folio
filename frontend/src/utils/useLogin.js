import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Vă rugăm să completați toate câmpurile");
      }

      const result = await login(formData);

      if (!result?.token || !result?.user) {
        throw new Error("Răspuns invalid de la server");
      }

      navigate("/portfolio");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "A apărut o eroare la autentificare"
      );
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
