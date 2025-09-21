import express from "express";
const brands = express.Router();
import Brand from '../models/Brand.js';
import auth from '../middleware/auth.js';

// Get all brands
brands.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create brand (admin only)
brands.post('/', auth, async (req, res) => {
  try {
    if (req.user.role != 'admin') return res.status(403).json({ error: req.user.role });
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category (admin only)
brands.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) return res.status(404).json({ error: 'Category not found' });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category (admin only)
brands.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default brands;