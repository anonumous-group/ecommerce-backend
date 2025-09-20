import express from "express";
const reviews = express.Router();
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';

// Get reviews for a product
reviews.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add review (authenticated user)
reviews.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default reviews;