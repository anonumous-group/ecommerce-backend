import express from "express";
const addresses = express.Router();
import Address from '../models/Address.js';
import auth from '../middleware/auth.js';

// get user addresses
addresses.get('/', auth, async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// add address
addresses.post('/', auth, async (req, res) => {
    try {
        const address = new Address({ ...req.body, user: req.user.id });
        await address.save();
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// update address
addresses.put('/:id', auth, async(req, res) => {
    try {
        const address = await Address.findOne({_id: req.params.id, user: req.user.id});
        if (!address) return res.status(404).json({error: 'Address not found'});
        Object.assign(address, req.body);
        await address.save();
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete address
addresses.delete('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default addresses;