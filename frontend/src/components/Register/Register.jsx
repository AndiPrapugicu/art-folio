// src/components/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "./Register.css";

const Register = () => {
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
      console.log(
        "📝 [Register] Încercare înregistrare pentru:",
        formData.email
      );

      const response = await axiosInstance.post("/api/auth/register", formData);
      console.log("✅ [Register] Înregistrare reușită:", response.data);

      // Redirecționăm către login
      navigate("/login");
    } catch (error) {
      console.error("❌ [Register] Eroare la înregistrare:", error);
      setError(error.response?.data?.message || "Eroare la înregistrare");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="register-container">
      <h2>Înregistrare</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Parolă:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="register-button" disabled={isLoading}>
          {isLoading ? "Se procesează..." : "Înregistrare"}
        </button>

        <div className="login-link">
          Ai deja cont? <a href="/login">Autentifică-te aici</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
