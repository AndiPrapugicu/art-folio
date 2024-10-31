import PropTypes from "prop-types";
import "./PortfolioItem.css";

const PortfolioItem = ({ artwork }) => {
  return (
    <div className="portfolio-items">
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className="portfolio-images"
      />
      <div className="portfolio-details">
        <h3 className="portfolio-titles">{artwork.title}</h3>
        <p className="portfolio-description">{artwork.description}</p>
        <p className="portfolio-date">
          Data postării:{" "}
          {artwork.datePosted.split("T")[0].split("-").reverse().join(".")}
        </p>
        <p className="portfolio-artist">Artist: {artwork.artist}</p>
      </div>
    </div>
  );
};

// Prop validation
PortfolioItem.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    datePosted: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
  }).isRequired,
};

export default PortfolioItem;
