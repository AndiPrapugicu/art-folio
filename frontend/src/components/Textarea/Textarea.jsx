import PropTypes from "prop-types";
import "./Textarea.css";

const Textarea = ({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  disabled = false,
  required = false,
  className = "",
  label = "",
  error = "",
  maxLength,
  name,
  id,
}) => {
  const baseClassName = `textarea-component ${className} ${
    error ? "textarea-error" : ""
  }`;

  return (
    <div className="textarea-wrapper">
      {label && (
        <label htmlFor={id} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={baseClassName}
      />

      {maxLength && (
        <div className="textarea-counter">
          {value.length}/{maxLength}
        </div>
      )}

      {error && <div className="textarea-error-message">{error}</div>}
    </div>
  );
};

Textarea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string,
  id: PropTypes.string,
};

export default Textarea;
