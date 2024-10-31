import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./PortfolioDetail.css";
import { useAuth } from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../utils/axiosConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = ({ onClick }) => (
  <div
    className="custom-arrow custom-prev-arrow"
    onClick={onClick}
    aria-label="Previous"
  >
    <div className="arrow-icon"></div>
  </div>
);

const NextArrow = ({ onClick }) => (
  <div
    className="custom-arrow custom-next-arrow"
    onClick={onClick}
    aria-label="Next"
  >
    <div className="arrow-icon"></div>
  </div>
);

PrevArrow.propTypes = {
  onClick: PropTypes.func,
};

NextArrow.propTypes = {
  onClick: PropTypes.func,
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    return `${API_URL}${imageUrl}`;
  }

  return `${API_URL}/uploads/${imageUrl}`;
};

const PortfolioDetail = ({ initialArtworks = [] }) => {
  const { category, username: urlUsername } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [userArtworks, setUserArtworks] = useState(initialArtworks);
  // const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isStatusFading, setIsStatusFading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    datePosted: "",
    category: category,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    console.log("PortfolioDetail mounted with params:", {
      category,
      urlUsername,
      isLoggedIn,
      user,
      initialArtworks,
    });
  }, []);

  const fetchUserArtworks = useCallback(async () => {
    try {
      console.log("fetchUserArtworks called with:", {
        category,
        urlUsername,
        isLoggedIn,
        user,
      });

      if (!category) {
        console.error("Categoria lipsește");
        return;
      }

      let url;
      if (urlUsername) {
        url = `/api/artworks/${urlUsername}/${encodeURIComponent(category)}`;
      } else if (isLoggedIn && user?.username) {
        url = `/api/artworks/user/${encodeURIComponent(category)}`;
      } else {
        console.error(
          "Context invalid - nu avem nici username nici user autentificat"
        );
        return;
      }

      console.log("Încercăm să preluăm artwork-urile de la:", url);

      const response = await axiosInstance.get(url);

      if (Array.isArray(response.data)) {
        console.log(
          `Am primit ${response.data.length} artwork-uri:`,
          response.data
        );
        setUserArtworks(response.data);
        localStorage.setItem(
          `artworks_${urlUsername || user?.username}_${category}`,
          JSON.stringify(response.data)
        );
      } else {
        console.error("Format răspuns neașteptat:", response.data);
      }
    } catch (error) {
      console.error("Eroare în fetchUserArtworks:", error.response || error);
      const cachedData = localStorage.getItem(
        `artworks_${urlUsername || user?.username}_${category}`
      );
      if (cachedData) {
        console.log("Folosim datele din cache");
        setUserArtworks(JSON.parse(cachedData));
      }
      handleError(error);
    }
  }, [category, urlUsername, user, isLoggedIn]);

  useEffect(() => {
    return () => {
      if (urlUsername || (user?.username && category)) {
        localStorage.removeItem(
          `artworks_${urlUsername || user?.username}_${category}`
        );
      }
    };
  }, [urlUsername, user, category]);

  useEffect(() => {
    console.log("PortfolioDetail mounting with:", {
      category,
      urlUsername,
      isLoggedIn,
      userUsername: user?.username,
    });

    if (!category) {
      console.error("Nu avem categorie");
      return;
    }

    const cachedData = localStorage.getItem(
      `artworks_${urlUsername || user?.username}_${category}`
    );

    if (cachedData) {
      console.log("Folosim date din cache inițial");
      setUserArtworks(JSON.parse(cachedData));
    }

    fetchUserArtworks();
  }, [category, urlUsername, user, isLoggedIn, fetchUserArtworks]);

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, category }));
  }, [category]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusMessage = (message) => {
    setIsStatusFading(false);
    setUploadStatus(message);

    setTimeout(() => {
      setIsStatusFading(true);
      setTimeout(() => {
        setUploadStatus("");
        setIsStatusFading(false);
      }, 300);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fileInput = e.target.querySelector('input[type="file"]');
      const file = fileInput.files[0];

      if (!file) {
        handleStatusMessage("Eroare: Nicio imagine încărcată.", true);
        return;
      }

      handleStatusMessage("Se încarcă...");

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("category", category);
      uploadFormData.append("datePosted", new Date().toISOString());
      uploadFormData.append("userId", user.id);

      for (let pair of uploadFormData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axiosInstance.post(
        "/artworks/upload",
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("Upload progress:", percentCompleted + "%");
          },
        }
      );

      console.log("Răspuns server:", response.data);

      if (response.data && response.data.imageUrl) {
        const newArtworkItem = {
          id: response.data.id,
          title: formData.title,
          imageUrl: response.data.imageUrl,
          description: formData.description,
          datePosted: new Date().toISOString(),
          category: category,
          artist: user.username,
          userId: user.id,
        };

        const updatedArtworks = [newArtworkItem, ...userArtworks];
        setUserArtworks(updatedArtworks);

        localStorage.setItem(
          `artworks_${user.id}_${category}`,
          JSON.stringify(updatedArtworks)
        );

        handleStatusMessage("Încărcare reușită!");
        setFormData({
          title: "",
          description: "",
          datePosted: "",
          category: category,
        });
        setShowUploadForm(false);
      }
    } catch (error) {
      console.error("Eroare completă:", error);
      console.error("Răspuns server:", error.response?.data);

      let errorMessage = "Eroare la încărcare.";
      if (error.response?.data?.message) {
        errorMessage += ` ${error.response.data.message}`;
      }
      handleStatusMessage(errorMessage, true);
    }
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
  };

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const response = await axiosInstance.delete(`/artworks/${artworkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setUserArtworks((prevArtworks) =>
          prevArtworks.filter((artwork) => artwork.id !== artworkId)
        );
        handleStatusMessage("Artwork șters cu succes!");
      }
    } catch (error) {
      console.error(
        "Eroare la ștergerea artwork-ului:",
        error.response || error
      );
      handleStatusMessage("Eroare la ștergere!", true);
    }
  };

  const handleHideArtwork = async (artworkId) => {
    try {
      console.log("Attempting to update visibility for artwork:", artworkId);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      const artwork = userArtworks.find((art) => art.id === artworkId);
      if (!artwork) {
        console.error("Artwork not found:", artworkId);
        return;
      }
      console.log("Current artwork state:", {
        id: artworkId,
        isVisible: artwork.isVisible,
        userId: artwork.userId,
      });
      const response = await axiosInstance.patch(
        `/artworks/${artworkId}/visibility`,
        {
          isVisible: !artwork.isVisible,
        }
      );
      console.log("Server response:", response.data);
      if (response.data) {
        setUserArtworks((prevArtworks) =>
          prevArtworks.map((art) =>
            art.id === artworkId ? { ...art, isVisible: !art.isVisible } : art
          )
        );
        const updatedArtworks = userArtworks.map((art) =>
          art.id === artworkId ? { ...art, isVisible: !art.isVisible } : art
        );
        localStorage.setItem(
          `artworks_${user.id}_${category}`,
          JSON.stringify(updatedArtworks)
        );
      }
    } catch (error) {
      console.error("Error updating artwork visibility:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
  };

  const handleError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          let refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            axiosInstance
              .post("/auth/refresh-token", { refreshToken })
              .then((response) => {
                let { token } = response.data;
                localStorage.setItem("token", token);
                window.location.reload();
              })
              .catch(() => {
                handleStatusMessage(
                  "Sesiune expirată. Vă rugăm să vă autentificați din nou.",
                  true
                );
              });
          } else {
            handleStatusMessage(
              "Sesiune expirată. Vă rugăm să vă autentificați din nou.",
              true
            );
          }
          break;
        }
        case 403:
          handleStatusMessage(
            "Nu aveți permisiunea de a efectua această acțiune.",
            true
          );
          break;
        case 404:
          handleStatusMessage("Artwork-ul nu a fost găsit.", true);
          break;
        default:
          handleStatusMessage(
            error.response?.data?.message || "A apărut o eroare neașteptată.",
            true
          );
      }
    } else {
      handleStatusMessage(
        "Nu s-a putut contacta serverul. Verificați conexiunea.",
        true
      );
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (userArtworks.length > 0) {
      console.log(
        "URLs imagini pentru categoria",
        category,
        ":",
        userArtworks.map((art) => ({
          title: art.title,
          imageUrl: art.imageUrl,
          category: art.category,
        }))
      );
    }
  }, [userArtworks, category]);

  const totalPages = Math.ceil(userArtworks.length / itemsPerPage);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return userArtworks.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="portfolio-detail">
      <h2 className="portfolio-title">
        {category} Artworks by {urlUsername || user?.username}
      </h2>

      {isLoggedIn && (
        <div className="user-controls">
          <p>Bine ați venit, {user?.username}!</p>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="upload-button"
          >
            {showUploadForm ? "Anulează" : "Upload Artwork"}
          </button>
        </div>
      )}

      {isLoggedIn && showUploadForm && (
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

          <button
            type="submit"
            disabled={
              !formData.title || !formData.description || !formData.datePosted
            }
            className="form-submit-button"
          >
            Upload Artwork
          </button>
        </form>
      )}

      {uploadStatus && (
        <p
          className={`upload-status ${
            uploadStatus.includes("Eroare") ? "error" : "success"
          } ${isStatusFading ? "fade-out" : ""}`}
        >
          {uploadStatus}
        </p>
      )}

      {userArtworks.length > 0 ? (
        <div className="portfolio-slider-container">
          <div className="desktop-view">
            <Slider {...settings}>
              {userArtworks.map((artwork) => (
                <div key={artwork.id} className="portfolio-slide">
                  <div className="portfolio-items">
                    <div className="portfolio-image-container">
                      <img
                        src={getImageUrl(artwork.imageUrl)}
                        alt={artwork.title || "Artwork"}
                        className={`portfolio-images ${
                          artwork.isVisible ? "" : "hidden-artwork"
                        }`}
                      />
                      {user && user.id === artwork.userId && (
                        <div className="artwork-controls">
                          <button
                            onClick={() => handleHideArtwork(artwork.id)}
                            className="control-button visibility-toggle"
                          >
                            {artwork.isVisible ? "Ascunde" : "Arată"}
                          </button>
                          <button
                            onClick={() => {
                              setArtworkToDelete(artwork);
                              setShowConfirmDialog(true);
                            }}
                            className="control-button delete"
                          >
                            Șterge
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="portfolio-details">
                      <h3 className="portfolio-item-title">
                        {artwork.title || "Untitled"}
                      </h3>
                      <p className="portfolio-item-description">
                        {artwork.description}
                      </p>
                      <div className="portfolio-item-metadata">
                        <p className="portfolio-item-info">
                          Artist: {artwork.artist || user.username}
                        </p>
                        <p className="portfolio-item-info">
                          Categoria: {artwork.category}
                        </p>
                        <p className="portfolio-item-info">
                          Data postării:{" "}
                          {new Date(artwork.datePosted).toLocaleDateString(
                            "ro-RO"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="mobile-view">
            <div className="portfolio-items">
              {getCurrentItems().map((artwork) => (
                <div key={artwork.id} className="portfolio-item">
                  <div className="portfolio-image-container">
                    <img
                      src={getImageUrl(artwork.imageUrl)}
                      alt={artwork.title || "Artwork"}
                      className={`portfolio-images ${
                        artwork.isVisible ? "" : "hidden-artwork"
                      }`}
                    />
                    {user && user.id === artwork.userId && (
                      <div className="artwork-controls">
                        <button
                          onClick={() => handleHideArtwork(artwork.id)}
                          className="control-button visibility-toggle"
                        >
                          {artwork.isVisible ? "Ascunde" : "Arată"}
                        </button>
                        <button
                          onClick={() => {
                            setArtworkToDelete(artwork);
                            setShowConfirmDialog(true);
                          }}
                          className="control-button delete"
                        >
                          Șterge
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="portfolio-details">
                    <h3 className="portfolio-item-title">
                      {artwork.title || "Untitled"}
                    </h3>
                    <p className="portfolio-item-description">
                      {artwork.description}
                    </p>
                    <div className="portfolio-item-metadata">
                      <p className="portfolio-item-info">
                        Artist: {artwork.artist || user.username}
                      </p>
                      <p className="portfolio-item-info">
                        Categoria: {artwork.category}
                      </p>
                      <p className="portfolio-item-info">
                        Data postării:{" "}
                        {new Date(artwork.datePosted).toLocaleDateString(
                          "ro-RO"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Anterior
              </button>

              <span className="page-info">
                Pagina {currentPage} din {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Următor
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-portfolio">
          <p>
            Nu aveți încă opere de artă în categoria {category}.
            {isLoggedIn &&
              " Folosiți butonul 'Upload Artwork' pentru a adăuga prima dvs. operă!"}
          </p>
        </div>
      )}

      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirmare ștergere</h3>
            <p>Sigur doriți să ștergeți "{artworkToDelete?.title}"?</p>
            <div className="confirm-dialog-buttons">
              <button
                onClick={() => {
                  handleDeleteArtwork(artworkToDelete.id);
                  setShowConfirmDialog(false);
                }}
                className="confirm-button delete"
              >
                Da, șterge
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="confirm-button cancel"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PortfolioDetail.propTypes = {
  initialArtworks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      datePosted: PropTypes.string,
      artist: PropTypes.string,
      category: PropTypes.string,
      userId: PropTypes.number,
    })
  ),
};

export default PortfolioDetail;
