import { useState } from "react";
import PropTypes from "prop-types";

const UploadForm = ({ onSubmit, category, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    datePosted: "",
    category: category,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    onSubmit(formData, file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="upload-form"
      encType="multipart/form-data"
    >
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Titlu"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descriere"
          required
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <input
          type="date"
          name="datePosted"
          value={formData.datePosted}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="form-file-input"
        />
      </div>

      <div className="form-buttons">
        <button
          type="submit"
          disabled={
            !formData.title || !formData.description || !formData.datePosted
          }
          className="form-submit-button"
        >
          Upload Artwork
        </button>
        <button type="button" onClick={onClose} className="form-cancel-button">
          Anulează
        </button>
      </div>
    </form>
  );
};

UploadForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadForm;
