import { useNavigate } from "react-router-dom";
import "./Home.css";
import artImage from "../../components/UI/ImageGallery/images/arta.jpg";
import UserArtGallery from "../../components/Portfolio/UserArtGallery";
import { useEffect, useState } from "react";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/artworks");
        const processedArtworks = response.data.map((artwork) => ({
          ...artwork,
          imageUrl: getImageUrl(artwork.imageUrl),
        }));
        setArtworks(processedArtworks);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  const getCurrentPageArtworks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return artworks.slice(startIndex, endIndex);
  };

  const handlePublishClick = () => {
    navigate("/portfolio");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document
      .querySelector(".art-gallery-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="home-container">
        <div className="home-left">
          <h1>Welcome to ArtFolio</h1>
          <p>Your digital art portfolio</p>
          <p>
            Showcase your artwork in a professional manner and connect with art
            lovers around the globe.
          </p>
          <button className="publish-button" onClick={handlePublishClick}>
            Publish your first art
          </button>
        </div>
        <div className="home-right">
          <img src={artImage} alt="Art Showcase" className="art-image" />
        </div>
      </div>
      <div className="art-gallery-section">
        <UserArtGallery artworks={getCurrentPageArtworks()} />
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`pagination-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
