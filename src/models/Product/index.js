import mongoose from 'mongoose';

// Define the Product schema
const ProductSchema = new mongoose.Schema({
  ProductCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory', // Reference to the ProductCategory schema
    required: true,
  },
  ProductCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCompany', // Reference to the ProductCategory schema
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
    ref:'MeasuringUnit',
    required: true, // Assuming you have a MeasuringUnit collection
  },
  Price: {
    type: Number,
    required: true, // Selling price
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

// Create or retrieve the Product model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
