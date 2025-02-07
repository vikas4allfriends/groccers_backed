import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a Permission document
export interface IProductCategory extends Document {
    _id: mongoose.Schema.Types.ObjectId;  // Explicitly define _id field
    Name: string;  // Name of the permission
    Description: string;
    CategoryImageUrl?: string;  // Optional description of the permission
    IsDeleted:boolean;
    IsActive:boolean;
    LastUpdatedById:string;
}

// Define the Permission schema
const ProductCategorySchema: Schema<IProductCategory> = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true,  // Ensure that each category name is unique
    },
    Description: {
        type: String,
        required: true,
        unique: true,
    },
    CategoryImageUrl: {
        type: String,
        required: false,  // Optional description,
        default:null
    },
    IsDeleted: {
        type:Boolean,
        default:false
    },
    IsActive: {
        type:Boolean,
        default:true
    },
    LastUpdatedById: {
        type:String,
    }
}, {
    timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Create or retrieve the Permission model
const ProductCategory = mongoose.models.ProductCategory || mongoose.model('ProductCategory', ProductCategorySchema);

export default ProductCategory;
