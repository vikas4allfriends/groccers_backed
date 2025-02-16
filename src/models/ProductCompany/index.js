import mongoose, { Schema, Document } from 'mongoose';

// Define the MeasuringUnit schema
const ProductCompanySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true // Ensure the unit name is unique
    },
    Description: {
        type: String,
    },
    IsActive: {
        type: Boolean,
        default: true
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    CreatedById: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Reference to the user/admin who created the unit
    },
    LastUpdatedById: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Reference to the user/admin who last updated the unit
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create or retrieve the MeasuringUnit model
const ProductCompany = mongoose.models.ProductCompany || mongoose.model('ProductCompany', ProductCompanySchema);

export default ProductCompany;
