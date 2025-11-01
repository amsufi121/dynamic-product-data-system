// server/models/Question.js

import mongoose from "mongoose";

// Define the schema for choices (e.g., for radio buttons, select dropdowns)
const choiceSchema = new mongoose.Schema({
  label: { type: String, required: true }, // Display label for the choice
  value: { type: String, required: true }, // Actual value to store
});

// Define the schema for conditional logic (when to show this question)
const conditionSchema = new mongoose.Schema({
  field: { type: String, required: true }, // The name of the field to check (e.g., 'category')
  operator: {
    type: String,
    enum: ["equals", "not_equals", "in", "not_in", "greater_than", "less_than"], // Operators for comparison
    required: true,
  },
  value: mongoose.Schema.Types.Mixed, // The value to compare against (can be string, number, array, boolean)
});

// Define the main Question schema
const questionSchema = new mongoose.Schema(
  {
    // Unique identifier for the question (e.g., 'productCategory', 'materialType')
    // This will also be used as the field name in the product data when saved
    field: {
      type: String,
      required: [true, "Question field name is required"],
      unique: true,
      trim: true,
      lowercase: true, // Standardize field names
    },
    label: {
      type: String,
      required: [true, "Question label is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "number",
        "select",
        "radio",
        "checkbox",
        "date",
        "boolean",
      ],
      required: [true, "Question type is required"],
    },
    options: [choiceSchema], // Array of choices for 'select' or 'radio' types
    placeholder: {
      type: String,
      trim: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    // Conditional logic: array of conditions that must be met for this question to be displayed
    conditions: [conditionSchema],
    // Step in which this question appears (for multi-step forms)
    step: {
      type: Number,
      required: true,
      min: 1,
    },
    order: {
      // Order of questions within a step
      type: Number,
      required: true,
      default: 0,
    },
    defaultValue: mongoose.Schema.Types.Mixed, // Optional default value
    // We can add validation rules here too if needed, e.g., min/max for numbers, regex for text
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
