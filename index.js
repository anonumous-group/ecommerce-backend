import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import users from './routes/users.js';
import products from './routes/products.js';
import orders from './routes/orders.js';
import categories from './routes/categories.js';
import carts from './routes/carts.js';
import reviews from './routes/reviews.js';
import addresses from './routes/addresses.js';
import brands from './routes/brands.js';

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Add your routes here
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/categories', categories);
app.use('/api/cart', carts);
app.use('/api/address', addresses);
app.use('/api/reviews', reviews);
app.use('/api/brands', brands);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));