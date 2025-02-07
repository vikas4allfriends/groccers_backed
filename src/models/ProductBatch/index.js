import mongoose from 'mongoose';

// Define the ProductBatch schema
const ProductBatchSchema = new mongoose.Schema({
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product schema
      required: true,
    },
    ExpiryDate: {
      type: Date,
      required: true,
    },
    Quantity: {
      type: Number,
      required: true,
      default: 0, // Default to zero
    },
    BuyingPrice: {
      type: Number,
      required: true, // Batch-specific buying price
    },
    CreatedAt: {
      type: Date,
      default: Date.now, // Timestamp for when the batch was created
    },
  });
  
  // Create or retrieve the ProductBatch model
  const ProductBatch = mongoose.models.ProductBatch || mongoose.model('ProductBatch', ProductBatchSchema);
  
  export default ProductBatch;
  