import { useState, useEffect } from "react";
import axiosInstance from "./axiosConfig";

export const useProducts = (username) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/shop/products/${username}`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    if (username) fetchProducts();
  }, [username]);

  const addProduct = async (productData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/shop/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        await fetchProducts();
        return true;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await axiosInstance.delete(
        `/shop/products/${productId}`
      );
      if (response.data.success) {
        await fetchProducts();
        return true;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  };

  return { products, addProduct, deleteProduct, isLoading };
};
