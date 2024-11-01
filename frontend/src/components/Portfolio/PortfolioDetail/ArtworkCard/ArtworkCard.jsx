import PropTypes from "prop-types";
import { getImageUrl } from "../../../../utils/imageUtils";
import { formatDate } from "../../../../utils/dateUtils";

const ArtworkCard = ({ artwork, onHide, onDelete, isOwner, user }) => {
  return (
    <div className="portfolio-item">
      <div className="portfolio-image-container">
        <img
          src={getImageUrl(artwork.imageUrl)}
          alt={artwork.title || "Artwork"}
          className={`portfolio-images ${
            artwork.isVisible ? "" : "hidden-artwork"
          }`}
        />
        {isOwner && user.id === artwork.userId && (
          <div className="artwork-controls">
            <button
              onClick={() => onHide(artwork.id)}
              className="control-button visibility-toggle"
            >
              {artwork.isVisible ? "Ascunde" : "Arată"}
            </button>
            <button
              onClick={() => onDelete(artwork)}
              className="control-button delete"
            >
              Șterge
            </button>
          </div>
        )}
      </div>
      <div className="portfolio-details">
        <h3 className="portfolio-item-title">{artwork.title || "Untitled"}</h3>
        <p className="portfolio-item-description">{artwork.description}</p>
        <div className="portfolio-item-metadata">
          <p className="portfolio-item-info">
            Artist: {artwork.artist || user?.username}
          </p>
          <p className="portfolio-item-info">Categoria: {artwork.category}</p>
          <p className="portfolio-item-info">
            Data postării: {formatDate(artwork.datePosted)}
          </p>
        </div>
      </div>
    </div>
  );
};

ArtworkCard.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    datePosted: PropTypes.string,
    artist: PropTypes.string,
    category: PropTypes.string,
    userId: PropTypes.number,
    isVisible: PropTypes.bool,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default ArtworkCard;
