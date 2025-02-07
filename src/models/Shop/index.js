import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: {
            mobileNumber: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Create or retrieve the Shop model
const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

export default Shop;
