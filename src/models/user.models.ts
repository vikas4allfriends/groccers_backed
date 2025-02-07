import mongoose, { Schema, Document } from 'mongoose';
import Role from '../models/role.models';

// Define the User interface
export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;  // Add _id field explicitly
    __v?: number;  // Mongoose adds the version key by default
    username?: string;
    password?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    mobileNumberConfirmed?: boolean;
    profileImage?: string;
    createdById?: string;
    isVerified?: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    role: mongoose.Schema.Types.ObjectId;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        unique: true,
        sparse: true,  // Allows multiple null values
        default: null,
        index: true
    },
    password: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true,
        sparse: true,  // Allows multiple null values
        default: null,
        index: true
    },
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
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
    isVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: {
        type: String,
        default: null
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: null
    },
    verifyToken: {
        type: String,
        default: null
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',  // Reference to the Role collection
        required: true
    }
});

// Create and export the model
const userModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default userModel;
