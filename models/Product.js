import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    images: [{ type: String }],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

productSchema.index({ name: 'text', category: 1 });

export default mongoose.model('Product', productSchema);