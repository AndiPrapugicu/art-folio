import PropTypes from "prop-types";
import "./Modal.css";

const Modal = ({ isOpen, onClose, imageUrl = "", title = "" }) => {
  if (!isOpen) return null;

  // Definim URL-ul backend-ului
  const API_URL = "http://localhost:3000";

  // Construim URL-ul complet pentru imagine
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${API_URL}${imageUrl}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <img src={fullImageUrl} alt={title} className="modal-image" />
      </div>
    </div>
  );
};

// Prop validation
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
};

export default Modal;
