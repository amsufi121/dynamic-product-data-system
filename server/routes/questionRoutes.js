// server/routes/questionRoutes.js

import express from 'express';
import Question from '../models/Question.js'; // Import the Question model

const router = express.Router();

// @route   POST api/questions
// @desc    Create a new question definition
// @access  Public (will be private with auth later)
router.post('/', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion); // 201 Created
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    // Handle duplicate field name error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.field) {
      return res.status(400).json({ message: `A question with field name '${req.body.field}' already exists.` });
    }
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/questions
// @desc    Get all question definitions, sorted by step and order
// @access  Public (will be private with auth later)
router.get('/', async (req, res) => {
  try {
    // Fetch all questions and sort them by step and then by order within each step
    const questions = await Question.find().sort({ step: 1, order: 1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// We can add GET by ID, PUT/PATCH for update, and DELETE later if needed for admin functionality.

export default router;