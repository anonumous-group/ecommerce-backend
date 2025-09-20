import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ],
        default: 'pending',
    },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'completed',
            'failed'
        ],
        createdAt: { type: Date, default: Date.now },
    }
});

orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);