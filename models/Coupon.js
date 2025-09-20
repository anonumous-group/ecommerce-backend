import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
});

export default mongoose.model('Coupon', couponSchema);