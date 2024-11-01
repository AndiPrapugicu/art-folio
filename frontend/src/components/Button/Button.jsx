import PropTypes from "prop-types";
import "./Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  onClick,
  className = "",
}) => {
  const baseClass = "btn";
  const classes = [
    baseClass,
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "edit",
    "outline",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
