import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User schema
        required: true
    },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    houseNumber: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    locality: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }, // New field for marking default address
}, {
    timestamps: true  // Automatically manage createdAt and updatedAt fields
});

export default mongoose.models.UserAddress || mongoose.model('UserAddress', AddressSchema);
