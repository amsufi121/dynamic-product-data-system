// client/src/App.jsx

import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // New function to handle product deletion
  const handleProductDeleted = (deletedProductId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedProductId)
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Dynamic Product Data System
      </h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        Manage your products efficiently
      </p>

      <ProductForm onProductAdded={handleProductAdded} />

      <hr style={{ margin: "30px 0", borderColor: "#eee" }} />

      {/* Pass the new handleProductDeleted function to ProductList */}
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onProductDeleted={handleProductDeleted} // <-- Pass this prop
      />
    </div>
  );
}

export default App;
