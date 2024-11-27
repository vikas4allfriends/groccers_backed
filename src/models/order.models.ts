import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    OrderId: string; // Unique Order ID
    UserId: mongoose.Schema.Types.ObjectId;
    Items: {
        ProductId: mongoose.Schema.Types.ObjectId;
        Quantity: number;
        PriceAtAddTime: number;
    }[];
    TotalPrice: number;
    IsPaid: boolean; // Payment status
    OrderStatus: string; // e.g., Pending, Shipped, Delivered
}

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
    {
        OrderId: { type: String, required: true, unique: true },
        UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        Items: [
            {
                ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                Quantity: { type: Number, required: true },
                PriceAtAddTime: { type: Number, required: true },
            }
        ],
        TotalPrice: { type: Number, required: true },
        IsPaid: { type: Boolean, default: false },
        OrderStatus: { type: String, default: 'Pending' },
    },
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
