// client/src/components/ProductForm.jsx

import React, { useState } from "react";

// ProductForm will receive a callback function to notify App.jsx when a product is added
const ProductForm = ({ onProductAdded }) => {
  // State to hold form input values
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      // Convert price and stockQuantity to numbers if they are for those fields
      [name]:
        name === "price" || name === "stockQuantity" ? Number(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product), // Send product data as JSON
      });

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to read error message from backend
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newProduct = await response.json();
      setSuccess(true);
      // Call the callback function to notify the parent component
      onProductAdded(newProduct);

      // Reset form fields after successful submission
      setProduct({
        name: "",
        sku: "",
        description: "",
        category: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
      });
      console.log("Product added:", newProduct);
    } catch (err) {
      setError(err.message);
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "10px", maxWidth: "400px" }}
      >
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label htmlFor="sku">SKU:</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label htmlFor="stockQuantity">Stock Quantity:</label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleChange}
            required
            min="0"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          ></textarea>
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
      {success && <p style={{ color: "green" }}>Product added successfully!</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default ProductForm;
