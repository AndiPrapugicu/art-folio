import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axiosInstance from "../../../utils/axiosConfig";
import "./ProfileShop.css";
import { getImageUrl } from "../../../utils/imageUtils";

const ProductCard = ({ product, onDelete }) => {
  // const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Ești sigur că vrei să ștergi acest produs?")) {
      setIsDeleting(true);
      try {
        await onDelete(product.id);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Nu s-a putut șterge produsul. Vă rugăm încercați din nou.");
      } finally {
        setIsDeleting(false);
      }
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
          <button className="buy-btn">Buy Now</button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
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

const ProfileShop = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Încărcăm produsele la montarea componentei
  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `/shop/products/${user?.username}`
      );
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Eroare la încărcarea produselor:", error);
    }
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", parseFloat(newProduct.price).toString());
      formData.append("description", newProduct.description);

      if (newProduct.image) {
        formData.append("image", newProduct.image);
        console.log("Appending image to form:", newProduct.image); // Logging pentru debugging
      }

      // Logging pentru a verifica FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axiosInstance.post("/shop/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        console.log("Product created successfully:", response.data);
        await fetchProducts();
        setIsAddingProduct(false);
        setNewProduct({ name: "", price: "", description: "", image: null });
      }
    } catch (error) {
      console.error("Eroare la adăugarea produsului:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Nu s-a putut adăuga produsul. Vă rugăm încercați din nou."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Logging pentru debugging
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const handlePriceChange = (e) => {
    // Permitem doar numere și un singur punct decimal
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Verificăm dacă avem mai mult de un punct decimal
    if ((value.match(/\./g) || []).length > 1) return;

    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setNewProduct({ ...newProduct, price: value });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axiosInstance.delete(
        `/shop/products/${productId}`
      );
      if (response.data.success) {
        // Reîncărcăm lista de produse după ștergere
        await fetchProducts();
      }
    } catch (error) {
      console.error("Eroare la ștergerea produsului:", error);
      throw error;
    }
  };

  // Modificăm componenta de afișare a produselor
  const renderProducts = () => {
    if (!products.length) {
      return <p className="no-products">No products available yet.</p>;
    }

    return (
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-name">
          <h1>{user?.username || "Artist Name"}</h1>
        </div>

        <nav className="profile-nav">
          <Link to={`/profile/${user?.username}/news`}>NEWS</Link>
          <Link to={`/profile/${user?.username}`}>ABOUT</Link>
          <Link to={`/profile/${user?.username}/contact`}>CONTACT</Link>
          <Link to={`/profile/${user?.username}/shop`}>SHOP</Link>
          <Link to="https://instagram.com/the.manlyman_">INSTAGRAM</Link>
        </nav>
      </div>

      <div className="profile-content">
        <div className="shop-page">
          <div className="shop-container">
            <div className="shop-header">
              <h2>My Shop</h2>
              <button className="add-product-btn" onClick={handleAddProduct}>
                Add New Product
              </button>
            </div>

            {isAddingProduct && (
              <div className="add-product-form">
                <form onSubmit={handleProductSubmit}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={handlePriceChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {renderProducts()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
