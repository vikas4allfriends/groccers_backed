import crypto from 'crypto';
// import { Request, Response } from 'express';
import Order from '../../models/order.models';
import { CustomError } from '../../utils/error';
import { razorpayInstance } from '../../config/razorpay';

export const createPayment = async (orderId:any, TotalPrice:number) => {
    try {
        // const { orderId } = await req.json();
        // Fetch the order details from the database
        // const order = await Order.findOne({ OrderId: orderId });
        console.log('orderId===>>>', TotalPrice)

        // if (!order) {
        //     throw new CustomError('Order not found', 400)
        // }
        // console.log('order===>>>', order)
        // Create a Razorpay order
        // console.log('razorpayInstance=======', razorpayInstance)
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: TotalPrice * 100, // Amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: orderId,
            notes: {
                orderId: orderId, // Pass your orderId in notes
            },
            // payment_capture: 1, // Automatically capture payment
        });
        return razorpayOrder;
    } catch (error) {
        console.error(error);
        throw new CustomError('Error creating payment', 500)
    }
};

