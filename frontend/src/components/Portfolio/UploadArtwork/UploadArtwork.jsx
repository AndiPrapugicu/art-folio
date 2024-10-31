import { useState } from "react";
import axios from "axios";

const UploadArtwork = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:3000/api/artworks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTitle("");
      setDescription("");
      setImage(null);
      alert("Artwork uploaded successfully!");
    } catch (error) {
      console.error("Error uploading artwork:", error);
      alert("Failed to upload artwork. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        required
      />
      <button type="submit">Upload Artwork</button>
    </form>
  );
};

export default UploadArtwork;
