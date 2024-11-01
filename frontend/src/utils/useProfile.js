import { useState, useEffect } from "react";
import { getImageUrl } from "./imageUtils";
import axiosInstance from "./axiosConfig";

const useProfile = (user, updateUser) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [localBio, setLocalBio] = useState("");
  const [localWebsite, setLocalWebsite] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [isSavingWebsite, setIsSavingWebsite] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.profileImage) setProfileImage(getImageUrl(user.profileImage));
      if (user.bio) {
        setBio(user.bio);
        setLocalBio(user.bio);
      }
      if (user.website) {
        setWebsite(user.website);
        setLocalWebsite(user.website);
      }
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.patch(
        "/auth/profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data?.success) {
        const imageUrl = response.data.imageUrl;
        setProfileImage(imageUrl);
        updateUser({ ...user, profileImage: imageUrl });
      }
    } catch (error) {
      console.error("Eroare la încărcarea imaginii:", error);
      if (error.response) {
        console.error("Răspuns server:", error.response.data);
        console.error("Status:", error.response.status);
      }
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
        setBio(localBio);
        const updatedUser = {
          ...user,
          ...response.data.user,
        };
        await updateUser(updatedUser);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        setIsEditingBio(false);
      }
    } catch (error) {
      console.error("Eroare la salvarea bio-ului:", error);
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleBioCancel = () => {
    setLocalBio(user?.bio || "");
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
        setWebsite(localWebsite);
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
    setLocalWebsite(user?.website || "");
    setIsEditingWebsite(false);
  };

  return {
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
  };
};

export default useProfile;
