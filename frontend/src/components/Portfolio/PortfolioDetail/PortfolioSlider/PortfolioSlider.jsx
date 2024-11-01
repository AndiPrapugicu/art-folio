import { useState } from "react";
import Slider from "react-slick";
import PropTypes from "prop-types";
import "./PortfolioSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UploadForm from "../UploadForm/UploadForm";
import { formatDate } from "../../../../utils/dateUtils";

const PrevArrow = ({ onClick, disabled }) => (
  <div
    className={`custom-arrow custom-prev-arrow ${disabled ? "disabled" : ""}`}
    onClick={disabled ? null : onClick}
    aria-label="Previous"
    style={{ visibility: disabled ? "hidden" : "visible" }}
  >
    <div className="arrow-icon"></div>
  </div>
);

PrevArrow.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

const NextArrow = ({ onClick, disabled }) => (
  <div
    className={`custom-arrow custom-next-arrow ${disabled ? "disabled" : ""}`}
    onClick={disabled ? null : onClick}
    aria-label="Next"
    style={{ visibility: disabled ? "hidden" : "visible" }}
  >
    <div className="arrow-icon"></div>
  </div>
);

NextArrow.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

const PortfolioSlider = ({
  artworks,
  onHide = () => {},
  onDelete = () => {},
  onSubmit,
  user = null,
  category,
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    message: "",
    isError: false,
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, artworks.length),
    slidesToScroll: 1,
    prevArrow:
      artworks.length > 3 ? <PrevArrow disabled={currentSlide === 0} /> : null,
    nextArrow:
      artworks.length > 3 ? (
        <NextArrow disabled={currentSlide >= artworks.length - 3} />
      ) : null,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, artworks.length),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const handleStatusMessage = (message, isError = false) => {
    setUploadStatus({
      message,
      isError,
    });
    setTimeout(() => {
      setUploadStatus("");
    }, 3000);
  };

  const handleHideArtwork = (artworkId) => {
    if (onHide) {
      onHide(artworkId);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (!artworkId) {
      console.error("ID-ul artwork-ului lipsește");
      handleStatusMessage("Eroare la ștergerea artwork-ului: ID invalid", true);
      return;
    }

    if (onDelete) {
      onDelete(artworkId);
    }
  };

  return (
    <div className="portfolio-slider-container">
      {uploadStatus && (
        <div
          className={`upload-status ${
            uploadStatus.isError ? "error" : "success"
          }`}
        >
          {uploadStatus.message}
        </div>
      )}

      {showUploadForm && (
        <UploadForm
          onSubmit={onSubmit}
          category={category}
          onClose={() => setShowUploadForm(false)}
        />
      )}

      <Slider {...settings}>
        {artworks.map((artwork) => (
          <div key={artwork.id} className="portfolio-slide">
            <div className="portfolio-objects">
              <div className="portfolio-image-container">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className={`portfolio-images ${
                    !artwork.isVisible ? "hidden" : ""
                  }`}
                />
              </div>
              <div className="portfolio-details">
                <h3 className="portfolio-item-title">{artwork.title}</h3>
                <p className="portfolio-item-description">
                  {artwork.description}
                </p>
                <div className="portfolio-item-metadata">
                  <p>Artist: {artwork.artist}</p>
                  <p>Categoria: {artwork.category}</p>
                  <p>Data postării: {formatDate(artwork.datePosted)}</p>
                </div>
              </div>

              {user && user.id === artwork.userId && artwork.id && (
                <div className="artwork-actions">
                  <button
                    onClick={() => handleHideArtwork(artwork.id)}
                    className="hide-button"
                  >
                    {artwork.isVisible ? "Ascunde" : "Arată"}
                  </button>
                  <button
                    onClick={() => handleDeleteArtwork(artwork.id)}
                    className="delete-button"
                  >
                    Șterge
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

PortfolioSlider.propTypes = {
  artworks: PropTypes.array.isRequired,
  onHide: PropTypes.func,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object,
  category: PropTypes.string.isRequired,
};

export default PortfolioSlider;
