import PropTypes from "prop-types";
import PortfolioItem from "./PortfolioItem/PortfolioItem";
import "./UserArtGallery.css";
import { Link } from "react-router-dom";

const UserArtGallery = ({ artworks }) => {
  return (
    <div className="user-art-gallery">
      <h2>User Art Gallery</h2>
      <div className="art-gallery-grid">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <Link to={`/artwork/${artwork.id}`} key={artwork.id}>
              <PortfolioItem artwork={artwork} />
            </Link>
          ))
        ) : (
          <p className="no-artworks">Nu există opere de artă de afișat.</p>
        )}
      </div>
    </div>
  );
};

// Prop validation
UserArtGallery.propTypes = {
  artworks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      datePosted: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UserArtGallery;
