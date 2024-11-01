import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../utils/axiosConfig";
import { getImageUrl } from "../utils/imageUtils";

export const usePortfolioDetail = (initialArtworks = []) => {
  const navigate = useNavigate();
  const { category, username: urlUsername } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [userArtworks, setUserArtworks] = useState(initialArtworks);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isStatusFading, setIsStatusFading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const processArtworks = useCallback((artworks) => {
    return artworks.map((artwork) => ({
      ...artwork,
      imageUrl: getImageUrl(artwork.imageUrl),
    }));
  }, []);

  const handleStatusMessage = useCallback((message, isError = false) => {
    setIsStatusFading(false);
    setUploadStatus(message);

    setTimeout(() => {
      setIsStatusFading(true);
      setTimeout(() => {
        setUploadStatus("");
        setIsStatusFading(false);
      }, 300);
    }, 3000);
  }, []);

  const handleError = useCallback(
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401: {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              axiosInstance
                .post("/auth/refresh-token", { refreshToken })
                .then((response) => {
                  localStorage.setItem("token", response.data.token);
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
    },
    [handleStatusMessage]
  );

  const fetchUserArtworks = useCallback(async () => {
    try {
      if (!category) {
        throw new Error("Categoria lipsește");
      }

      let url;
      if (urlUsername) {
        url = `/api/artworks/${urlUsername}/${encodeURIComponent(category)}`;
      } else if (isLoggedIn && user?.username) {
        url = `/api/artworks/user/${encodeURIComponent(category)}`;
      } else {
        throw new Error(
          "Context invalid - nu avem nici username nici user autentificat"
        );
      }

      const response = await axiosInstance.get(url);

      if (Array.isArray(response.data)) {
        const processedArtworks = processArtworks(response.data);
        setUserArtworks(processedArtworks);
        localStorage.setItem(
          `artworks_${urlUsername || user?.username}_${category}`,
          JSON.stringify(processedArtworks)
        );
      }
    } catch (error) {
      const cachedData = localStorage.getItem(
        `artworks_${urlUsername || user?.username}_${category}`
      );
      if (cachedData) {
        const processedCachedArtworks = processArtworks(JSON.parse(cachedData));
        setUserArtworks(processedCachedArtworks);
      }
      handleError(error);
    }
  }, [category, urlUsername, user, isLoggedIn, processArtworks, handleError]);

  const handleSubmit = async (formData, file) => {
    try {
      handleStatusMessage("Se încarcă...");

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("category", category);
      uploadFormData.append("datePosted", new Date().toISOString());
      uploadFormData.append("userId", user.id);

      const response = await axiosInstance.post(
        "/artworks/upload",
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.imageUrl) {
        const newArtworkItem = {
          id: response.data.id,
          title: formData.title,
          imageUrl: getImageUrl(response.data.imageUrl),
          description: formData.description,
          datePosted: new Date().toISOString(),
          category: category,
          artist: user.username,
          userId: user.id,
        };

        setUserArtworks((prev) => [newArtworkItem, ...prev]);
        handleStatusMessage("Încărcare reușită!");
        setShowUploadForm(false);

        setTimeout(() => {
          navigate(0);
        }, 1000);
      }
    } catch (error) {
      let errorMessage = "Eroare la încărcare.";
      if (error.response?.data?.message) {
        errorMessage += ` ${error.response.data.message}`;
      }
      handleStatusMessage(errorMessage, true);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const response = await axiosInstance.delete(`/artworks/${artworkId}`);
      if (response.status === 200) {
        setUserArtworks((prev) =>
          prev.filter((artwork) => artwork.id !== artworkId)
        );
        handleStatusMessage("Artwork șters cu succes!");
      }
    } catch (error) {
      handleStatusMessage("Eroare la ștergere!", true);
    }
  };

  const handleHideArtwork = async (artworkId) => {
    try {
      const artwork = userArtworks.find((art) => art.id === artworkId);
      if (!artwork) return;

      const response = await axiosInstance.patch(
        `/artworks/${artworkId}/visibility`,
        {
          isVisible: !artwork.isVisible,
        }
      );

      if (response.data) {
        setUserArtworks((prev) =>
          prev.map((art) =>
            art.id === artworkId ? { ...art, isVisible: !art.isVisible } : art
          )
        );
      }
    } catch (error) {
      let errorMessage = "Eroare la actualizarea vizibilității!";
      if (error.response?.data?.message) {
        errorMessage += ` ${error.response.data.message}`;
      }
      handleStatusMessage(errorMessage, true);
    }
  };

  useEffect(() => {
    if (!category) return;

    const cachedData = localStorage.getItem(
      `artworks_${urlUsername || user?.username}_${category}`
    );

    if (cachedData) {
      setUserArtworks(JSON.parse(cachedData));
    }

    fetchUserArtworks();
  }, [category, urlUsername, user, isLoggedIn, fetchUserArtworks]);

  return {
    category,
    urlUsername,
    isLoggedIn,
    user,
    userArtworks,
    showUploadForm,
    uploadStatus,
    isStatusFading,
    showConfirmDialog,
    artworkToDelete,
    currentPage,
    itemsPerPage,
    setShowUploadForm,
    setShowConfirmDialog,
    setArtworkToDelete,
    setCurrentPage,
    handleSubmit,
    handleDeleteArtwork,
    handleHideArtwork,
    handleStatusMessage,
  };
};

export default usePortfolioDetail;
