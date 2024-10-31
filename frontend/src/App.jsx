import "./App.css";
import Header from "./components/Header/Header";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import PortfolioDetail from "./components/Portfolio/PortfolioDetail";
import PortfolioList from "./components/Portfolio/PortfolioList/PortfolioList";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import ArtworkDetails from "./components/Portfolio/ArtWork/ArtWork";
import initialArtworks from "./artWork";
import Modal from "./components/Portfolio/Modal/Modal";
import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import Profile from "./components/Profile/Profile";
import ProfileContact from "./components/Profile/ProfileContact/ProfileContact";
import ProfileShop from "./components/Profile/ProfileShop/ProfileShop";
import ProfileNews from "./components/Profile/ProfileNews/ProfileNews";

function App() {
  const { isLoggedIn, username, logout, userId: authUserId } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworks, setArtworks] = useState(initialArtworks);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artworksResponse = await axios.get(
          "http://localhost:3000/api/artworks"
        );
        if (Array.isArray(artworksResponse.data)) {
          setArtworks(artworksResponse.data);
        } else {
          console.error(
            "Răspunsul de la server nu este un array:",
            artworksResponse.data
          );
          setArtworks([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Eroare la încărcarea datelor:", err);
        setError(
          "A apărut o eroare la încărcarea datelor. Vă rugăm să încercați din nou mai târziu."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setUserId(authUserId);
  }, [authUserId]);

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  const closeModal = () => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
      modalContent.classList.add("exit");
      setTimeout(() => {
        setModalOpen(false);
        setSelectedArtwork(null);
        modalContent.classList.remove("exit");
      }, 300);
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      {!isModalOpen && (
        <Header isLoggedIn={isLoggedIn} username={username} onLogout={logout} />
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/portfolio/:category"
            element={
              isLoggedIn ? (
                <PortfolioDetail artworks={artworks} userId={userId} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/portfolio" element={<PortfolioList />} />
          <Route
            path="/portfolio/:category/:username"
            element={<PortfolioDetail />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/:username/shop" element={<ProfileShop />} />
          <Route path="/profile/:username/news" element={<ProfileNews />} />
          <Route
            path="/profile/:username/contact"
            element={<ProfileContact />}
          />
          <Route
            path="/artwork/:id"
            element={
              <ArtworkDetails artworks={artworks} openModal={openModal} />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Footer />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={selectedArtwork?.imageUrl}
        title={selectedArtwork?.title}
      />
    </div>
  );
}

export default App;
