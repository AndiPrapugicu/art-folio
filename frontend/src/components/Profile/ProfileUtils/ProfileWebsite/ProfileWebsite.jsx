import PropTypes from "prop-types";
import Button from "../../../Button/Button";
import Input from "../../../Input/Input";
import "./ProfileWebsite.css";

const ProfileWebsite = ({
  website,
  isEditingWebsite,
  localWebsite,
  isSavingWebsite,
  handleWebsiteEdit,
  handleWebsiteSave,
  handleWebsiteCancel,
  setLocalWebsite,
}) => {
  return (
    <div className="profile-website">
      <div className="website-header">
        <h3>Website</h3>
        {!isEditingWebsite && (
          <Button variant="edit" onClick={handleWebsiteEdit}>
            Edit
          </Button>
        )}
      </div>

      {isEditingWebsite ? (
        <div className="website-edit-container">
          <Input
            type="url"
            value={localWebsite}
            onChange={(e) => setLocalWebsite(e.target.value)}
            placeholder="https://your-website.com"
            label="Website"
            disabled={isSavingWebsite}
            className="website-input"
            id="website"
            name="website"
            variant="outline"
            size="medium"
          />
          <div className="website-actions">
            <Button
              variant="success"
              onClick={handleWebsiteSave}
              disabled={isSavingWebsite}
              isLoading={isSavingWebsite}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleWebsiteCancel}
              disabled={isSavingWebsite}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="website-display">
          {website ? (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
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
  );
};

ProfileWebsite.propTypes = {
  website: PropTypes.string,
  isEditingWebsite: PropTypes.bool.isRequired,
  localWebsite: PropTypes.string.isRequired,
  isSavingWebsite: PropTypes.bool.isRequired,
  handleWebsiteEdit: PropTypes.func.isRequired,
  handleWebsiteSave: PropTypes.func.isRequired,
  handleWebsiteCancel: PropTypes.func.isRequired,
  setLocalWebsite: PropTypes.func.isRequired,
};

export default ProfileWebsite;
