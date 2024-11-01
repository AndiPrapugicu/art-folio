import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileSidebar from "./ProfileUtils/ProfileSidebar/ProfileSidebar";
import ProfileImage from "./ProfileUtils/ProfileImage/ProfileImage";
import ProfileBio from "./ProfileUtils/ProfileBio/ProfileBio";
import ProfileWebsite from "./ProfileUtils/ProfileWebsite/ProfileWebsite";
import "./Profile.css";
import useProfile from "../../utils/useProfile";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const isMainProfile = location.pathname === "/profile";
  const defaultProfileImage = "/images/default-profile.png";

  const {
    profileImage,
    isLoading,
    bio,
    website,
    localBio,
    localWebsite,
    isEditingBio,
    isEditingWebsite,
    isSavingBio,
    isSavingWebsite,
    handleImageUpload,
    handleBioEdit,
    handleBioSave,
    handleBioCancel,
    handleWebsiteEdit,
    handleWebsiteSave,
    handleWebsiteCancel,
    setLocalBio,
    setLocalWebsite,
  } = useProfile(user, updateUser);

  return (
    <div className="profile-container">
      <ProfileSidebar user={user} isMainProfile={isMainProfile} />

      <div className="profile-content">
        <div className="profile-about">
          <ProfileImage
            profileImage={profileImage}
            defaultProfileImage={defaultProfileImage}
            user={user}
            isLoading={isLoading}
            handleImageUpload={handleImageUpload}
          />

          <ProfileBio
            bio={bio}
            isEditingBio={isEditingBio}
            localBio={localBio}
            isSavingBio={isSavingBio}
            handleBioEdit={handleBioEdit}
            handleBioSave={handleBioSave}
            handleBioCancel={handleBioCancel}
            setLocalBio={setLocalBio}
            variant="edit"
          />

          <ProfileWebsite
            website={website}
            isEditingWebsite={isEditingWebsite}
            localWebsite={localWebsite}
            isSavingWebsite={isSavingWebsite}
            handleWebsiteEdit={handleWebsiteEdit}
            handleWebsiteSave={handleWebsiteSave}
            handleWebsiteCancel={handleWebsiteCancel}
            setLocalWebsite={setLocalWebsite}
            variant="edit"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
