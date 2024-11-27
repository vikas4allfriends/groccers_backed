import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a CartItem
export interface ICartItem {
    ProductId: mongoose.Schema.Types.ObjectId;  // Reference to the Product schema
    Quantity: number;  // Quantity of the product
    PriceAtAddTime: number;  // Price of the product when it was added to the cart
}

// Define the interface for a Cart document
export interface ICart extends Document {
    UserId: mongoose.Schema.Types.ObjectId;  // Reference to the User who owns the cart
    Items: ICartItem[];  // Array of cart items
    IsActive: boolean;  // Indicates if the cart is currently active
    IsDeleted: boolean;  // Soft delete flag
    CreatedAt: Date;  // Automatically generated creation timestamp
    UpdatedAt: Date;  // Automatically generated update timestamp
}

// Define the Cart schema
const CartSchema: Schema<ICart> = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User schema
        required: true
    },
    Items: [
        {
            ProductId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  // Reference to the Product schema
                required: true
            },
            Quantity: {
                type: Number,
                required: true,
                min: 1  // Ensure at least 1 item is added
            },
            PriceAtAddTime: {
                type: Number,
                required: true  // Store the price of the product at the time of adding to the cart
            }
        }
    ],
    IsActive: {
        type: Boolean,
        default: true
    },
    IsDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Automatically manage createdAt and updatedAt fields
});

// Create or retrieve the Cart model
const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
