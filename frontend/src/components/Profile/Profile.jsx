import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css";
import axiosInstance from "../../utils/axiosConfig";
import { getImageUrl } from "../../utils/imageUtils";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [website, setWebsite] = useState(user?.website || "");
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isSavingWebsite, setIsSavingWebsite] = useState(false);
  const [localBio, setLocalBio] = useState("");
  const [localWebsite, setLocalWebsite] = useState("");
  const location = useLocation();
  const isMainProfile = location.pathname === "/profile";

  // Folosim o imagine placeholder locală
  const defaultProfileImage = "/images/default-profile.png";

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(getImageUrl(user.profileImage));
    }
    if (user?.bio) {
      setBio(user.bio);
    }
    if (user?.website) {
      setWebsite(user.website);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLocalBio(user.bio || "");
      setLocalWebsite(user.website || "");
    }
  }, [user]);

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(getImageUrl(user.profileImage));
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        "/auth/profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        const imageUrl = response.data.imageUrl;
        setProfileImage(imageUrl);
        updateUser({
          ...user,
          profileImage: imageUrl,
        });
        console.log("Imagine actualizată cu succes:", imageUrl);
      } else {
        console.error("Răspuns neașteptat de la server:", response.data);
      }
    } catch (error) {
      console.error("Eroare la încărcarea imaginii:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioEdit = () => {
    setIsEditingBio(true);
  };

  const handleBioSave = async () => {
    setIsSavingBio(true);
    try {
      const response = await axiosInstance.post("/auth/update-bio", {
        bio: localBio,
      });

      if (response.data.success) {
        await updateUser(response.data.user);
        setIsEditingBio(false);
      }
    } catch (error) {
      console.error("Eroare la salvarea bio-ului:", error);
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleBioCancel = () => {
    setBio(user?.bio || "");
    setIsEditingBio(false);
  };

  const handleWebsiteEdit = () => {
    setIsEditingWebsite(true);
  };

  const handleWebsiteSave = async () => {
    setIsSavingWebsite(true);
    try {
      const response = await axiosInstance.post("/auth/update-website", {
        website: localWebsite,
      });

      if (response.data.success) {
        await updateUser(response.data.user);
        setIsEditingWebsite(false);
      }
    } catch (error) {
      console.error("Eroare la salvarea website-ului:", error);
    } finally {
      setIsSavingWebsite(false);
    }
  };

  const handleWebsiteCancel = () => {
    setWebsite(user?.website || "");
    setIsEditingWebsite(false);
  };

  return (
    <div className="profile-container">
      <div
        className={`profile-sidebar ${isMainProfile ? "animate-sidebar" : ""}`}
      >
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

        <div className="profile-social">
          {/* <a href={user?.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={user?.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a> */}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-about">
          <div className="profile-image-container">
            <img
              src={profileImage || defaultProfileImage}
              alt={user?.username || "Profile"}
              className="profile-image"
              onError={(e) => {
                e.target.src = defaultProfileImage;
                console.log(
                  "Eroare la încărcarea imaginii, folosim imaginea default"
                );
              }}
            />
            <label className="profile-image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={isLoading}
              />
              {isLoading ? "Se încarcă..." : "Change Profile Picture"}
            </label>
          </div>

          <div className="profile-bio">
            <div className="bio-header">
              <h2>About</h2>
              {!isEditingBio && (
                <button className="edit-bio-btn" onClick={handleBioEdit}>
                  Edit
                </button>
              )}
            </div>

            {isEditingBio ? (
              <div className="bio-edit-container">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bio-textarea"
                  placeholder="Write something about yourself..."
                />
                <div className="bio-actions">
                  <button
                    className="save-bio-btn"
                    onClick={handleBioSave}
                    disabled={isSavingBio}
                  >
                    {isSavingBio ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="cancel-bio-btn"
                    onClick={handleBioCancel}
                    disabled={isSavingBio}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>{bio || "Add your bio here..."}</p>
            )}

            <div className="profile-section">
              <h3>Press</h3>
              <ul className="press-list">
                <li>E-Talk</li>
                <li>AGO</li>
                <li>CBC</li>
                <li>AFROPUNK</li>
                <li>VICE</li>
                <li>REVOLT (2018)</li>
                <li>REVOLT (2017)</li>
              </ul>
            </div>

            <div className="profile-section">
              <h3>Exhibitions</h3>
              <ul className="exhibitions-list">
                <li>
                  <span className="year">2022</span>
                  <span className="exhibition-title">
                    In These Truths (group show)
                  </span>
                  <span className="venue">Albright-Knox Northland Museum</span>
                  <span className="location">Buffalo, NY</span>
                </li>
                <li>
                  <span className="year">2020</span>
                  <span className="exhibition-title">Ascension Tech</span>
                  <span className="venue">Harbourfront Centre</span>
                  <span className="location">Toronto, ON</span>
                </li>
                {/* ... alte expoziții ... */}
              </ul>
            </div>

            <div className="profile-website">
              <div className="website-header">
                <h3>Website</h3>
                {!isEditingWebsite && (
                  <button
                    className="edit-website-btn"
                    onClick={handleWebsiteEdit}
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingWebsite ? (
                <div className="website-edit-container">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="website-input"
                    placeholder="https://your-website.com"
                  />
                  <div className="website-actions">
                    <button
                      className="save-website-btn"
                      onClick={handleWebsiteSave}
                      disabled={isSavingWebsite}
                    >
                      {isSavingWebsite ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="cancel-website-btn"
                      onClick={handleWebsiteCancel}
                      disabled={isSavingWebsite}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="website-display">
                  {website ? (
                    <a
                      href={
                        website.startsWith("http")
                          ? website
                          : `https://${website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      {website}
                    </a>
                  ) : (
                    <p className="website-placeholder">Add your website...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
