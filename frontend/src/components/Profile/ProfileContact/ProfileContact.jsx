import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axiosInstance from "../../../utils/axiosConfig";
import { Link } from "react-router-dom";
import "./ProfileContact.css";

const ProfileContact = () => {
  const { user, updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState(
    user?.contactMessage || "Hi, you can find me and my art here"
  );

  const defaultProfileImage = "/images/default-profile.png";

  useEffect(() => {
    if (user?.profileImage) {
      const imageUrl = `http://localhost:3000${user.profileImage}`;
      setProfileImage(imageUrl);
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.phone) setPhone(user.phone);
    if (user?.contactMessage) setContactMessage(user.contactMessage);
  }, [user]);

  const handleContactEdit = () => {
    setIsEditingContact(true);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    // Acceptăm numere de telefon cu sau fără prefix internațional
    const re = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    return re.test(phone.replace(/\s+/g, ""));
  };

  const handleContactSave = async () => {
    // Validăm datele înainte de salvare
    if (email && !validateEmail(email)) {
      alert("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    if (phone && !validatePhone(phone)) {
      alert("Te rugăm să introduci un număr de telefon valid.");
      return;
    }

    setIsSavingContact(true);
    try {
      const response = await axiosInstance.post("/auth/update-contact", {
        email,
        phone,
        contactMessage,
      });

      console.log("Response from server:", response.data); // Pentru debugging

      if (response.data?.success) {
        // Actualizăm token-ul
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
        }

        // Folosim direct obiectul user returnat de server
        const serverUser = response.data.user;

        // Ne asigurăm că toate proprietățile sunt prezente
        const updatedUser = {
          ...user, // păstrăm proprietățile existente
          ...serverUser, // suprascriem cu datele noi de la server
          email: serverUser.email,
          phone: serverUser.phone,
          contactMessage: serverUser.contactMessage,
          profileImage: serverUser.profileImage,
          website: serverUser.website,
          username: serverUser.username,
          bio: serverUser.bio,
        };

        console.log("Updating user with:", updatedUser); // Pentru debugging

        updateUser(updatedUser);
        setIsEditingContact(false);
        alert("Informațiile de contact au fost actualizate cu succes!");
      }
    } catch (error) {
      console.error("Eroare la salvarea informațiilor de contact:", error);
      alert(
        error.response?.data?.message ||
          "Nu s-au putut salva informațiile de contact. Vă rugăm încercați din nou."
      );
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleContactCancel = () => {
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setContactMessage(
      user?.contactMessage || "Hi, you can find me and my art here"
    );
    setIsEditingContact(false);
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
          <Link to="https://instagram.com/the.manlyman_">INSTAGRAM</Link>
        </nav>

        <div className="profile-social">{/* social links */}</div>
      </div>

      <div className="profile-content">
        <div className="contact-page">
          <div className="contact-container">
            <div className="contact-header">
              <div className="contact-image-container">
                <img
                  src={profileImage || defaultProfileImage}
                  alt={user?.username || "Profile"}
                  className="contact-image"
                  onError={(e) => {
                    e.target.src = defaultProfileImage;
                    console.error("Eroare la încărcarea imaginii de profil");
                  }}
                />
              </div>
              <h1>{user?.username || "Artist Name"}</h1>
            </div>

            <div className="contact-content">
              {isEditingContact ? (
                <div className="contact-edit-container">
                  <div className="contact-field">
                    <label>Contact Message:</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="contact-textarea"
                      placeholder="Write your contact message..."
                    />
                  </div>

                  <div className="contact-field">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="contact-input"
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="contact-field">
                    <label>Phone:</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="contact-input"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="contact-actions">
                    <button
                      className="save-contact-btn"
                      onClick={handleContactSave}
                      disabled={isSavingContact}
                    >
                      {isSavingContact ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="cancel-contact-btn"
                      onClick={handleContactCancel}
                      disabled={isSavingContact}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="contact-display">
                  <div className="edit-button-container">
                    <button
                      className="edit-contact-btn"
                      onClick={handleContactEdit}
                    >
                      Edit Contact Info
                    </button>
                  </div>
                  <p className="contact-message">
                    {contactMessage || "Add your contact message..."}
                  </p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      {email ? (
                        <a href={`mailto:${email}`}>{email}</a>
                      ) : (
                        <span className="placeholder">Add your email...</span>
                      )}
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      {phone ? (
                        <a href={`tel:${phone}`}>{phone}</a>
                      ) : (
                        <span className="placeholder">
                          Add your phone number...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContact;
