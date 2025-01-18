import mongoose from 'mongoose';

const PurchaseOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true, // Link to the shop where goods were purchased
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create or retrieve the PurchaseOrder model
const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;
