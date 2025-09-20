import express from "express";
const coupons = express.Router();
import Coupon from '../models/Coupon.js';
import auth from "../middleware/auth.js";

// Get all active coupons
coupons.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create coupon (admin only)
coupons.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply coupon (authenticated user)
coupons.post('/apply', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gte: new Date() } });
    if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default coupons;