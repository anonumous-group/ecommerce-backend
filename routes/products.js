import express from "express";
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const products = express.Router();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'ecommerce', format: async () => 'jpg' },
});
const upload = multer({ storage });

// upload product images
products.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// get all products;
products.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 25 } = req.query;
        const products = await Product.find()
            .populate('category')
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// get single product
products.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

products.get('/search', async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice, sortBy } = req.query;
        let filter = {};
        if (query) filter.name = { $regex: query, $options: 'i' }; // Case-insensitive search
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        let sort = {};
        if (sortBy) sort[sortBy] = sortBy === 'price' ? 1 : -1; // e.g., price asc/desc
        const products = await Product.find(filter).populate('category').sort(sort);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// create product (admin only)
products.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// update product (admin only);
products.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
        const product = await Product.findByIdAndUpdate(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// delete product (admin only)
products.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

//

export default products;