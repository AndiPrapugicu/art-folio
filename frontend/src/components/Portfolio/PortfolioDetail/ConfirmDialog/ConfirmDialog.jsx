import PropTypes from "prop-types";

const ConfirmDialog = ({ artwork, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3>Confirmare ștergere</h3>
        <p>Sigur doriți să ștergeți "{artwork?.title}"?</p>
        <div className="confirm-dialog-buttons">
          <button onClick={onConfirm} className="confirm-button delete">
            Da, șterge
          </button>
          <button onClick={onCancel} className="confirm-button cancel">
            Anulează
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  artwork: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;
