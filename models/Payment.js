import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    paymentMethod: {
        type: String,
        enum: [
            'card',
            'paypal',
            'bank',
        ],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'completed',
            'failed',
        ],
        default: 'pending',
    },
    transactionId: {type: String},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model('Payment', paymentSchema);