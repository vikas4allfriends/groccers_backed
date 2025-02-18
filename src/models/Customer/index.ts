import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;  // Add _id field explicitly
    __v?: number;  // Mongoose adds the version key by default
    name?: string;
    mobileNumber?: string;
    mobileNumberConfirmed?: boolean;
    profileImage?: string;
    createdById?: string;
    role: mongoose.Schema.Types.ObjectId;
}

// Define the User schema
const CustomerSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        unique: true,
        index: true
    },
    mobileNumber: {
        type: String,
        unique: true,
        index: true,
        sparse: true,  // Allows multiple `null` values
        default: null
    },
    mobileNumberConfirmed: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: null
    },
    createdById: {
        type: String,
        default: null
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',  // Reference to the Role collection
        required: true
    }
});

// Create and export the model
const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export default CustomerModel;
