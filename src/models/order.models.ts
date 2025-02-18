import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    Quantity: {
        type: Number,
        required: true,
    },
    PriceAtAddTime: {
        type: Number,
        required: true,
    },
    PurchaseItemFromOutside: {
        type: Number,
        default: 0, // Default is 0, meaning no external purchase is needed
    },
});

const RazorpayDetailsSchema = new mongoose.Schema({
    PaymentGatewayOrderId: {
        type: String,
        required: true, // Razorpay Order ID
    },
    PaymentGatewayOrderAmount: {
        type: Number,
        required: true, // Amount in the smallest currency unit (e.g., paise for INR)
    },
    Currency: {
        type: String,
        required: true, // Currency (e.g., INR, USD)
        default: 'INR',
    },
    PaymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Captured'], // Include 'Paid' here
        default: 'Pending',
    },
});

const OrderSchema = new mongoose.Schema(
    {
        OrderId: {
            type: String,
            required: true,
            unique: true,
        },
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        Items: {
            type: [OrderItemSchema],
            required: true,
        },
        TotalPrice: {
            type: Number,
            required: true,
        },
        Discount: {
            type: Number,
            default: 0,
        },
        DeliveryCharge: {
            type: Number,
            default: 0,
        },
        IsPaid: {
            type: Boolean,
            default: false,
        },
        OrderStatus: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Shipped', 'Cancelled'],
            default: 'Pending',
        },
        RazorpayDetails: {
            type: RazorpayDetailsSchema,
            required: false, // Razorpay details may not be immediately available
        },
        DeliveryAddress: {
            fullName: { type: String, required: true },
            mobileNumber: { type: String, required: true },
            houseNumber: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            locality: { type: String },
            street: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            pinCode: { type: String, required: true },
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
