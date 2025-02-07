import mongoose from 'mongoose';

// Define the Product schema
const ProductSchema = new mongoose.Schema({
  ProductCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory', // Reference to the ProductCategory schema
    required: true,
  },
  ProductImageUrl: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
    required: true,
  },
  MeasuringUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Assuming you have a MeasuringUnit collection
  },
  Price: {
    type: Number,
    required: true, // Selling price
  },
  BuyingPrice: {
    type: Number,
    required: true,
    default: 0, // Initialize to zero
  },
  Quantity: {
    type: Number,
    required: true,
    default: 0, // Default to zero
  },
  ExpiryDate: {
    type: Date, // Stores the expiry date of the product
    required: false, // Optional field
    default: null, // Products without an expiry date will have null
  },
  Tags: {
    type: [String], // Array of strings for tags
    required: true,
    default: [], // Initialize with an empty array if not provided
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
  CreatedById: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Reference to the user who created the product
    default: null,
  },
  LastUpdatedById: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Middleware to update `IsActive` based on `Quantity`
// ProductSchema.pre('save', function (next) {
//   this.IsActive = this.Quantity > 0;
//   next();
// });

// Create or retrieve the Product model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
