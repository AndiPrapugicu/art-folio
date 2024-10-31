import "./ImageGallery.css";
import art1 from "./images/art1.jfif";
import art2 from "./images/art2.jpg";
import art3 from "./images/art3.jpg";

const images = [art1, art2, art3];

const ImageGallery = () => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Art piece ${index + 1}`}
          className="gallery-image"
        />
      ))}
    </div>
  );
};

export default ImageGallery;
