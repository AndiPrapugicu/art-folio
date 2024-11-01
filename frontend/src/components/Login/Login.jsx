import { Link } from "react-router-dom";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useLogin } from "../../utils/useLogin";
import "./Login.css";

const Login = () => {
  const { formData, error, isLoading, handleSubmit, handleChange } = useLogin();
  const isFormValid = formData.email && formData.password;

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            required
            disabled={isLoading}
            autoComplete="current-password"
            placeholder="Introduceți parola"
            error={error && !formData.password && "Câmpul este obligatoriu"}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isLoading || !isFormValid}
          isLoading={isLoading}
          fullWidth
        >
          {isLoading ? "Se procesează..." : "Autentificare"}
        </Button>

        <div className="register-prompt">
          Nu aveți cont? <Link to="/register">Înregistrați-vă aici</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
