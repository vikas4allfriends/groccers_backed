import mongoose from 'mongoose';

const PurchaseOrderSchema = new mongoose.Schema(
  {
    ShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    ProductBatchId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductBatch',
        required: true
      }
    ],
    ShopName: {
      type: String,
      required: true,
    },
    ShopAddress: {
      mobileNumber: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    Items: [
      {
        ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        Quantity: { type: Number, required: true },
        PriceAtPurchaseTime: { type: Number, required: true }, // Price at the time of purchase
      },
    ],
    TotalPrice: { type: Number, required: true },
    PurchaseDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const PurchaseOrder =
  mongoose.models.PurchaseOrder ||
  mongoose.model('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;
