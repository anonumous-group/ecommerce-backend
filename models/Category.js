import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    brands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
        }
    ]
});

export default mongoose.model('Category', categorySchema);