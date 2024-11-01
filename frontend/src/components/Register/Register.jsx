import { Link } from "react-router-dom";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useRegister } from "../../utils/useRegister";
import "./Register.css";

const Register = () => {
  const { formData, error, isLoading, handleSubmit, handleChange } =
    useRegister();
  const isFormValid = formData.email && formData.password && formData.username;

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <h2>Înregistrare</h2>

        {error && <div className="error-message">{error}</div>}

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          required
          disabled={isLoading}
          autoComplete="email"
          placeholder="Introduceți adresa de email"
          error={error && !formData.email && "Câmpul este obligatoriu"}
        />

        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          label="Username"
          required
          disabled={isLoading}
          autoComplete="username"
          placeholder="Alegeți un nume de utilizator"
          error={error && !formData.username && "Câmpul este obligatoriu"}
        />

        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Parolă"
          required
          disabled={isLoading}
          autoComplete="new-password"
          placeholder="Alegeți o parolă"
          error={error && !formData.password && "Câmpul este obligatoriu"}
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isLoading || !isFormValid}
          isLoading={isLoading}
          fullWidth
        >
          {isLoading ? "Se procesează..." : "Înregistrare"}
        </Button>

        <div className="login-link">
          Ai deja cont?{" "}
          <Link to="/login" className="login-link-button">
            Autentifică-te aici
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
