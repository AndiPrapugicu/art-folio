import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import ProductCard from "./ProductCard";
import AddProductForm from "./AddProductForm";
import Button from "../../Button/Button";
import "./ProfileShop.css";

const ProfileShop = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `/shop/products/${user.username}`
      );
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Eroare la încărcarea produselor:", error);
    }
  };

  const handleAddProduct = async (productData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/shop/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        await fetchProducts();
        setIsAddingProduct(false);
      }
    } catch (error) {
      alert("Nu s-a putut adăuga produsul. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const response = await axiosInstance.delete(`/shop/products/${productId}`);
    if (response.data.success) {
      await fetchProducts();
    }
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
        <div className="shop-container">
          <div className="shop-header">
            <h2>My Shop</h2>
            <Button
              variant="primary"
              onClick={() => setIsAddingProduct(true)}
              size="medium"
              className="add-product-button"
            >
              Add New Product
            </Button>
          </div>

          {isAddingProduct && (
            <AddProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setIsAddingProduct(false)}
              isLoading={isLoading}
            />
          )}

          <div className="products-grid">
            {!products.length ? (
              <p className="no-products">No products available yet.</p>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
