import { useNavigate } from "react-router-dom";
import "./PortfolioList.css";
import conceptArtImage from "../../../assets/images/concept-art.jpg";
import illustrationImage from "../../../assets/images/illustration.jpg";
import pleinAirImage from "../../..//assets/images/plein-air.jpg";
import sketchbookImage from "../../../assets/images/sketchbook.jpg";

const PortfolioList = () => {
  const navigate = useNavigate(); // Use useNavigate

  const handleClick = (category) => {
    navigate(`/portfolio/${category}`); // Update this line
  };
  return (
    <div className="portfolio-list">
      <h1 className="portfolio-title">Portfolio</h1>
      <div className="portfolio-grid">
        <div
          className="portfolio-item"
          onClick={() => handleClick("Concept Art")}
        >
          <img
            src={conceptArtImage}
            alt="Concept Art"
            className="portfolio-image"
          />
          <h2>Concept Art</h2>
        </div>
        <div
          className="portfolio-item"
          onClick={() => handleClick("Illustration")}
        >
          <img
            src={illustrationImage}
            alt="Illustration"
            className="portfolio-image"
          />
          <h2>Illustration</h2>
        </div>
        <div
          className="portfolio-item"
          onClick={() => handleClick("Plein Air")}
        >
          <img
            src={pleinAirImage}
            alt="Plein Air"
            className="portfolio-image"
          />
          <h2>Plein Air</h2>
        </div>
        <div
          className="portfolio-item"
          onClick={() => handleClick("Sketchbook")}
        >
          <img
            src={sketchbookImage}
            alt="Sketchbook"
            className="portfolio-image"
          />
          <h2>Sketchbook</h2>
        </div>
      </div>
    </div>
  );
};

export default PortfolioList;
