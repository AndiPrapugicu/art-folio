import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../../Button/Button";

const AddProductForm = ({ onSubmit, onCancel, isLoading }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name.trim());
    formData.append("price", parseFloat(product.price).toString());
    formData.append("description", product.description.trim());

    if (product.image) {
      formData.append("image", product.image);
    }

    onSubmit(formData);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if ((value.match(/\./g) || []).length > 1) return;
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setProduct({ ...product, price: value });
    }
  };

  return (
    <div className="add-product-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            value={product.price}
            onChange={handlePriceChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProduct({ ...product, image: e.target.files[0] })
            }
            required
          />
        </div>
        <div className="form-actions">
          <Button type="submit" disabled={isLoading} className="submit-btn">
            Add Product
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="cancel-btn"
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

AddProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AddProductForm;
