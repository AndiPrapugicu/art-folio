import { useState } from "react";

const WorkForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call onSubmit with the new artwork data
    onSubmit({ title, description, image });
  };

  return (
    <form onSubmit={handleSubmit} className="work-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Artwork Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Artwork Description"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Submit Artwork</button>
    </form>
  );
};

export default WorkForm;
