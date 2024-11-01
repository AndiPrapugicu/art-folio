import Button from "../../../Button/Button";
import PropTypes from "prop-types";
import Textarea from "../../../Textarea/Textarea";

const ProfileBio = ({
  bio,
  isEditingBio,
  localBio,
  isSavingBio,
  handleBioEdit,
  handleBioSave,
  handleBioCancel,
  setLocalBio,
}) => (
  <div className="profile-bio">
    <div className="bio-header">
      <h2>About</h2>
      {!isEditingBio && (
        <Button variant="edit" size="small" onClick={handleBioEdit}>
          Edit
        </Button>
      )}
    </div>

    {isEditingBio ? (
      <div className="bio-edit-container">
        <Textarea
          value={localBio}
          onChange={(e) => setLocalBio(e.target.value)}
          placeholder="Write something about yourself..."
          label="About"
          rows={4}
          maxLength={500}
          disabled={isSavingBio}
          className="bio-textarea"
          id="bio"
          name="bio"
        />
        <div className="bio-actions">
          <Button
            variant="success"
            onClick={handleBioSave}
            disabled={isSavingBio}
            isLoading={isSavingBio}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={handleBioCancel}
            disabled={isSavingBio}
          >
            Cancel
          </Button>
        </div>
      </div>
    ) : (
      <p>{bio || "Add your bio here..."}</p>
    )}
  </div>
);

ProfileBio.propTypes = {
  bio: PropTypes.string,
  isEditingBio: PropTypes.bool.isRequired,
  localBio: PropTypes.string.isRequired,
  isSavingBio: PropTypes.bool.isRequired,
  handleBioEdit: PropTypes.func.isRequired,
  handleBioSave: PropTypes.func.isRequired,
  handleBioCancel: PropTypes.func.isRequired,
  setLocalBio: PropTypes.func.isRequired,
};

ProfileBio.defaultProps = {
  bio: "",
};

export default ProfileBio;
