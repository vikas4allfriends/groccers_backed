import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
}, {
    timestamps: true,
});

// Create or retrieve the Shop model
const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

export default Shop;
