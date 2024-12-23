import crypto from 'crypto';
// import { Request, Response } from 'express';
import Order from '../../models/order.models';
import { CustomError } from '../../utils/error';
import { razorpayInstance } from '../../config/razorpay';

export const createPayment = async (orderId:any) => {
    try {
        // const { orderId } = await req.json();

        // Fetch the order details from the database
        const order = await Order.findOne({ OrderId: orderId });

        if (!order) {
            throw new CustomError('Order not found', 400)
            // return res.status(404).json({ success: false, message: 'Order not found' });
        }
        console.log('order===', order)
        // Create a Razorpay order
        console.log('razorpayInstance=======', razorpayInstance)
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: order.TotalPrice * 100, // Amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: orderId,
            payment_capture: 1, // Automatically capture payment
        });

        // return res.status(200).json({
        //     success: true,
        //     message: 'Razorpay order created successfully',
        //     razorpayOrder,
        // });

        // return new Response(JSON.stringify({
        //     message: 'Razorpay order created successfully',
        //     razorpayOrder,
        //     statusCode:200
        // }))
        console.log('razorpayOrder========',razorpayOrder)
        return razorpayOrder;
    } catch (error) {
        console.error(error);
        throw new CustomError('Error creating payment', 500)
    }
};


// Webhook for Payment Verification
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Verify the payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            // return res.status(400).json({ success: false, message: 'Invalid signature' });
            throw new CustomError('Invalid signature',400)
        }

        // Update the order status in the database
        const order = await Order.findOneAndUpdate(
            { OrderId: razorpay_order_id },
            { IsPaid: true, OrderStatus: 'Placed' },
            { new: true }
        );

        if (!order) {
            throw new CustomError('Order not found',400)
            // return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // return res.status(200).json({
        //     success: true,
        //     message: 'Payment verified and order placed successfully',
        //     order,
        // });

        return new Response(JSON.stringify({
            message:"Payment verified and order placed successfully",
            order,
            statusCode:200
        }))
    } catch (error) {
        console.error(error);
        throw new CustomError('Error verifying payment', 500)
        // return res.status(500).json({
        //     success: false,
        //     message: 'Error verifying payment',
        //     error: error.message,
        // });
    }
};
