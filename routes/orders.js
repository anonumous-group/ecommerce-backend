import express from "express";
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';

const orders = express.Router();

// create order (auhtenticated user only)
orders.post('/', auth, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress,
        });
        await order.save();
        res.status(201).json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// get user orders (authenticated user only)
orders.get('/', auth, async (req, res) => {
    try {
        const order = await Order.find({ user: req.user.id }).populate('items.product shippingAddress');
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// get single order (authenticated user or admin)
orders.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product shippingAddress');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// update order status (admin only)
orders.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorize' });
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default orders;