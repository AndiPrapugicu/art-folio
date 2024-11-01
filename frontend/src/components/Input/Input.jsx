import PropTypes from "prop-types";
import "./Input.css";

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  label = "",
  error = "",
  disabled = false,
  required = false,
  className = "",
  id,
  name,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  icon,
  onIconClick,
  size = "medium",
  variant = "default",
}) => {
  const baseClassName = `input-component input-${size} input-${variant} ${
    error ? "input-error" : ""
  } ${icon ? "input-with-icon" : ""} ${className}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-field-wrapper">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={baseClassName}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
        />

        {icon && (
          <span
            className="input-icon"
            onClick={onIconClick}
            role={onIconClick ? "button" : "presentation"}
          >
            {icon}
          </span>
        )}
      </div>

      {error && <div className="input-error-message">{error}</div>}

      {maxLength && (
        <div className="input-counter">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "tel",
    "url",
    "search",
    "date",
    "file",
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  icon: PropTypes.node,
  onIconClick: PropTypes.func,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["default", "outline", "filled"]),
};

export default Input;
