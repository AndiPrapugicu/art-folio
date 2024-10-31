import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { getArtworks } from "../../../apiService"; // Funcția API centralizată
import "./ArtWork.css";

const ArtworkDetails = ({ openModal }) => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const artworks = await getArtworks(); // Obține toate lucrările de artă
        const foundArtwork = artworks.find(
          (artwork) => artwork.id === parseInt(id)
        ); // Găsește lucrarea specifică după ID

        if (foundArtwork) {
          setArtwork(foundArtwork);
        } else {
          setError("Artwork not found");
        }
      } catch (err) {
        setError("Failed to fetch artwork details");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <div className="artwork-details">
      <div className="artwork-image-container">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="artwork-image"
          onClick={() => openModal(artwork)}
        />
      </div>
      <div className="artwork-details-container">
        <div className="artwork-text">
          <h2 className="artwork-title">{artwork.title}</h2>
          <p className="artwork-description">{artwork.description}</p>
          <p className="artwork-date">Posted on: {artwork.datePosted}</p>
          <p className="artwork-artist">Artist: {artwork.artist}</p>
          <p className="artwork-concept">Concept: {artwork.concept}</p>
        </div>
      </div>
    </div>
  );
};

// Prop validation
ArtworkDetails.propTypes = {
  openModal: PropTypes.func.isRequired,
};

export default ArtworkDetails;
