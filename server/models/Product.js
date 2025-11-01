// server/models/Product.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic product identification
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true, // Removes leading/trailing whitespace
      minlength: [3, "Product name must be at least 3 characters long"],
    },
    sku: {
      // Stock Keeping Unit - unique identifier for the product
      type: String,
      required: [true, "SKU is required"],
      unique: true, // Ensures each SKU is unique
      trim: true,
      uppercase: true, // Store SKU in uppercase for consistency
      minlength: [3, "SKU must be at least 3 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"], // Price must be 0 or positive
    },
    stockQuantity: {
      // Number of items in stock
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0, // Default to 0 if not provided
    },
    imageUrl: {
      type: String,
      trim: true,
      // You might add a custom validator here for URL format if needed
    },
    // We will add dynamic fields/responses from the multi-step form here later
    // For now, these are the core product attributes.
    // The 'questions' and 'reports' will be linked, not directly embedded.
  },
  {
    timestamps: true, // Mongoose adds `createdAt` and `updatedAt` fields automatically
  }
);

// Create the Product model from the schema
const Product = mongoose.model("Product", productSchema);

export default Product;
