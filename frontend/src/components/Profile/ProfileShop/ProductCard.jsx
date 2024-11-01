import { useState } from "react";
import PropTypes from "prop-types";
import { getImageUrl } from "../../../utils/imageUtils";
import Button from "../../Button/Button";

const ProductCard = ({ product, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest produs?")) return;

    setIsDeleting(true);
    try {
      await onDelete(product.id);
    } catch {
      alert("Nu s-a putut șterge produsul.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            console.error("Image load error:", e.target.src);
            e.target.src = "/placeholder-image.jpg";
          }}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        <div className="product-actions">
          <Button variant="primary" size="small">
            Buy Now
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
            disabled={isDeleting}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductCard;
