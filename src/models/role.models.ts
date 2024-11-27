import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a Role document
export interface IRole extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    permissions: mongoose.Schema.Types.ObjectId[]; // Array of ObjectIds for permissions
}

// Define the Role schema
const roleSchema: Schema<IRole> = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Role names must be unique
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',  // Reference to the Permission model
    }],
}, {
    timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Create or retrieve the Role model
const Role = mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema);
export default Role;
