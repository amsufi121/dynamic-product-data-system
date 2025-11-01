// client/src/components/ProductList.jsx

import React from "react";

const ProductList = ({ products, loading, error, onProductDeleted }) => {
  // Receive onProductDeleted prop
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        // Call the parent's callback to update the product list
        onProductDeleted(productId);
        alert("Product deleted successfully!");
      } catch (err) {
        alert(`Error deleting product: ${err.message}`);
        console.error("Error deleting product:", err);
      }
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products found. Add some!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product._id}
              style={{
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
                marginBottom: "10px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                display: "flex", // Use flexbox for layout
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
                  {product.name}
                </h3>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{
                    backgroundColor: "#dc3545", // Red color for delete
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8em",
                    flexShrink: 0, // Prevent button from shrinking
                  }}
                >
                  Delete
                </button>
              </div>
              <p style={{ margin: "0", color: "#555" }}>
                SKU: <strong>{product.sku}</strong> | Price:{" "}
                <strong>${product.price.toFixed(2)}</strong>
              </p>
              <p style={{ margin: "5px 0", fontSize: "0.9em", color: "#777" }}>
                {product.description}
              </p>
              <p style={{ margin: "0", fontSize: "0.9em", color: "#888" }}>
                Category: {product.category} | Stock: {product.stockQuantity}
              </p>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginTop: "10px",
                    borderRadius: "4px",
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
