import PropTypes from "prop-types";

const ProfileImage = ({
  profileImage = "",
  defaultProfileImage,
  user = null,
  isLoading = false,
  handleImageUpload,
}) => (
  <div className="profile-image-container">
    <img
      src={profileImage || defaultProfileImage}
      alt={user?.username || "Profile"}
      className="profile-image"
      onError={(e) => {
        e.target.src = defaultProfileImage;
      }}
    />
    <label className="profile-image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isLoading}
        className="hidden-input"
        style={{ display: "none" }}
      />
      <span className="upload-button">
        {isLoading ? "Se încarcă..." : "Schimbă poza de profil"}
      </span>
    </label>
  </div>
);

ProfileImage.propTypes = {
  profileImage: PropTypes.string,
  defaultProfileImage: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
  handleImageUpload: PropTypes.func.isRequired,
};

export default ProfileImage;
