import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a Permission document
export interface IPermission extends Document {
    _id: mongoose.Schema.Types.ObjectId;  // Explicitly define _id field
    name: string;  // Name of the permission
    description?: string;  // Optional description of the permission
}

// Define the Permission schema
const permissionSchema: Schema<IPermission> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Ensure that each permission name is unique
    },
    description: {
        type: String,
        required: false,  // Optional description
    },
}, {
    timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Create or retrieve the Permission model
const Permission = mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema);

export default Permission;
