import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 [Login] Început proces autentificare");

    setError("");
    setIsLoading(true);

    try {
      console.log("📝 [Login] Date formular:", {
        email: formData.email,
        passwordLength: formData.password.length,
        hasLoginFunction: !!login,
      });

      if (!formData.email || !formData.password) {
        throw new Error("Vă rugăm să completați toate câmpurile");
      }

      console.log("🔄 [Login] Apelare funcție login");
      const result = await login(formData);

      console.log("✅ [Login] Răspuns autentificare:", {
        success: !!result,
        hasToken: !!result?.token,
        hasUser: !!result?.user,
      });

      if (!result || !result.token || !result.user) {
        throw new Error("Răspuns invalid de la server");
      }

      console.log("🚗 [Login] Navigare către portfolio");
      navigate("/portfolio");
    } catch (error) {
      console.error("❌ [Login] Eroare la autentificare:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      setError(
        error.response?.data?.message ||
          error.message ||
          "A apărut o eroare la autentificare. Vă rugăm să încercați din nou."
      );
    } finally {
      console.log("🏁 [Login] Finalizare proces autentificare");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("✏️ [Login] Actualizare câmp:", name);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

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
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? "Se procesează..." : "Autentificare"}
        </button>

        <div className="register-link">
          Nu aveți cont? <a href="/register">Înregistrați-vă aici</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
