import mongoose from 'mongoose';

const ServiceAreaSchema = new mongoose.Schema(
    {
        localityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country', // Refers to the nested Locality in the Country schema
            required: true,
        },
        deliveryCharge: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.ServiceArea || mongoose.model('ServiceArea', ServiceAreaSchema);
