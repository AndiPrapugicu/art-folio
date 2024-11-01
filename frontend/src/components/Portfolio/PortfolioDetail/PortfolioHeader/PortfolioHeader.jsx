import PropTypes from "prop-types";
import Button from "../../../Button/Button";
// import "./PortfolioHeader.css";

export const PortfolioHeader = ({
  category,
  username,
  isLoggedIn,
  showUploadForm,
  onToggleUpload,
}) => (
  <div className="portfolio-header">
    <h2 className="portfolio-title">
      {category} Artworks by {username}
    </h2>

    {isLoggedIn && (
      <div className="user-controls">
        <p>Bine ați venit, {username}!</p>
        <Button onClick={onToggleUpload} variant="secondary" size="medium">
          {showUploadForm ? "Anulează" : "Upload Artwork"}
        </Button>
      </div>
    )}
  </div>
);

PortfolioHeader.propTypes = {
  category: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  showUploadForm: PropTypes.bool.isRequired,
  onToggleUpload: PropTypes.func.isRequired,
};

export default PortfolioHeader;
