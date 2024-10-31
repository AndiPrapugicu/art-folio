import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import "./ProfileNews.css";

const ProfileNews = () => {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: null,
  });
  const [selectedNews, setSelectedNews] = useState(null);

  const API_URL = "http://localhost:3000"; // Ajustează portul în funcție de configurația ta

  useEffect(() => {
    fetchNews();
  }, [user]);

  const fetchNews = async () => {
    try {
      const response = await axiosInstance.get(`/news/${user?.username}`);
      setNews(response.data);
    } catch (error) {
      console.error("Eroare la încărcarea știrilor:", error);
    }
  };

  const handleAddNews = () => {
    setIsAddingNews(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      // Max 5MB
      setNewArticle({ ...newArticle, image: file });
    } else {
      alert("Imaginea este prea mare. Mărimea maximă permisă este de 5MB.");
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", newArticle.title);
      formData.append("excerpt", newArticle.excerpt);
      formData.append("content", newArticle.content);
      if (newArticle.image) {
        formData.append("image", newArticle.image);
      }

      console.log("Sending formData:", Object.fromEntries(formData)); // Pentru debugging

      const response = await axiosInstance.post("/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data); // Pentru debugging

      await fetchNews();
      setIsAddingNews(false);
      setNewArticle({
        title: "",
        excerpt: "",
        content: "",
        image: null,
      });
    } catch (error) {
      console.error("Eroare la adăugarea știrii:", error);
      alert("Nu s-a putut adăuga știrea. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm("Sigur doriți să ștergeți această știre?")) {
      try {
        await axiosInstance.delete(`/news/${newsId}`);
        await fetchNews();
      } catch (error) {
        console.error("Eroare la ștergerea știrii:", error);
        alert("Nu s-a putut șterge știrea. Vă rugăm încercați din nou.");
      }
    }
  };

  const handleReadMore = (news) => {
    setSelectedNews(news);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-name">
          <h1>{user?.username || "Artist Name"}</h1>
        </div>

        <nav className="profile-nav">
          <Link to={`/profile/${user?.username}/news`}>NEWS</Link>
          <Link to={`/profile/${user?.username}`}>ABOUT</Link>
          <Link to={`/profile/${user?.username}/contact`}>CONTACT</Link>
          <Link to={`/profile/${user?.username}/shop`}>SHOP</Link>
          <Link to="https://www.instagram.com/the.manlyman_/">INSTAGRAM</Link>
        </nav>
      </div>

      <div className="profile-content">
        <div className="news-page">
          <div className="news-container">
            <div className="news-header">
              <h2>Latest News</h2>
              <button className="add-news-btn" onClick={handleAddNews}>
                Add News
              </button>
            </div>

            {isAddingNews && (
              <div className="add-news-form">
                <form onSubmit={handleNewsSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newArticle.title}
                      onChange={(e) =>
                        setNewArticle({ ...newArticle, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Excerpt</label>
                    <textarea
                      value={newArticle.excerpt}
                      onChange={(e) =>
                        setNewArticle({
                          ...newArticle,
                          excerpt: e.target.value,
                        })
                      }
                      required
                      maxLength={200}
                    />
                    <small>Max 200 characters</small>
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={newArticle.content}
                      onChange={(e) =>
                        setNewArticle({
                          ...newArticle,
                          content: e.target.value,
                        })
                      }
                      required
                      className="content-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add News"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNews(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="news-grid">
              {news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className="news-card">
                    {item.imageUrl && (
                      <img
                        src={`${API_URL}${item.imageUrl}`}
                        alt={item.title}
                      />
                    )}
                    <div className="news-content">
                      <h3>{item.title}</h3>
                      <p className="news-date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p className="news-excerpt">{item.excerpt}</p>
                      <div className="news-actions">
                        <button
                          className="read-more-btn"
                          onClick={() => handleReadMore(item)}
                        >
                          Read More
                        </button>
                        <button
                          className="delete-news-btn"
                          onClick={() => handleDeleteNews(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-news">No news available yet.</p>
              )}
            </div>

            {/* Modal pentru Read More */}
            {selectedNews && (
              <div className="news-modal-overlay" onClick={closeModal}>
                <div
                  className="news-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="close-modal" onClick={closeModal}>
                    ×
                  </button>
                  <h2>{selectedNews.title}</h2>
                  {selectedNews.imageUrl && (
                    <img
                      src={`${API_URL}${selectedNews.imageUrl}`}
                      alt={selectedNews.title}
                      className="modal-image"
                    />
                  )}
                  <p className="modal-date">
                    {new Date(selectedNews.createdAt).toLocaleDateString()}
                  </p>
                  <div className="modal-content">{selectedNews.content}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNews;
