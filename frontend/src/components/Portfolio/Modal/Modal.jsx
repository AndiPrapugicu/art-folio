import PropTypes from "prop-types";
import "./Modal.css";

const Modal = ({ isOpen, onClose, imageUrl = "", title = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <img src={imageUrl} alt={title} className="modal-image" />
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
