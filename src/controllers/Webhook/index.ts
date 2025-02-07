import crypto from 'crypto';
import Order from '../../models/order.models';
import Product from '../../models/product_old.models'; // Assuming your Product model is imported here
import { CustomError } from '../../utils/error';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js's body parser
    },
};

// Convert the request body to a readable stream


export const razorpayWebhook = async (req: Request) => {
    try {
        // Use `raw-body` package to read the raw body
        const rawBody = await req.text();
        console.log('body type===', typeof(rawBody))

        console.log('Raw Body:', rawBody);
        // Validate Razorpay signature
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || ''; // Ensure this is defined in your .env file
        // const razorpaySignature = req.headers['x-razorpay-signature'];
        const razorpaySignature = req.headers.get('x-razorpay-signature');
        console.log('razorpaySignature==', razorpaySignature)
        console.log('secret==', secret)
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${rawBody}`)
            .digest('hex');

        console.log('expectedSignature==', expectedSignature)
        if (razorpaySignature !== expectedSignature) {
            console.log('Invalid Razorpay signature')
            return new Response(JSON.stringify({ success: false, message: 'Invalid Razorpay signature.' }));
        }

          // Step 2: Parse the webhook payload
          const payload = JSON.parse(rawBody);

          if (!payload || !payload.event) {
            throw new CustomError('Invalid webhook payload.', 400);
        }

        const { event, payload: eventPayload } = payload;


        // Step 3: Handle specific webhook events
        if (event === 'payment.captured') {
            const paymentEntity = eventPayload.payment?.entity;
        
            const paymentId = paymentEntity?.id; // Extract payment ID
            const razorpayOrderId = paymentEntity?.order_id; // Extract order ID
            console.log('razorpayOrderId==', razorpayOrderId)
            if (!razorpayOrderId || !paymentId) {
                throw new CustomError('Razorpay order or payment ID missing in payload.', 400);
            }

            // Step 4: Find and update the order in the database
            const order = await Order.findOne({ 'RazorpayDetails.PaymentGatewayOrderId': razorpayOrderId });
            console.log('order==', order)
            if (!order) {
                throw new CustomError('Order not found for the given Razorpay order ID.', 404);
            }

            // Update the RazorpayDetails with payment status and payment ID
            order.RazorpayDetails = {
                ...order.RazorpayDetails,
                PaymentStatus: 'Paid', // Update payment status to "Paid"
                PaymentGatewayPaymentId: paymentId, // Add payment ID
            };

            order.IsPaid = true; // Mark the order as paid
            order.OrderStatus = 'Paid'; // Update order status to "Paid"

            await order.save();

            // Return success response
            return new Response(
                JSON.stringify({ message: 'Order payment status updated successfully.', success: true }),
                { status: 200 }
            );
        }

        // Handle other Razorpay events if needed
        return new Response(JSON.stringify({ message: 'Event not handled.', success: false }), { status: 200 });
    } catch (error) {
        console.error('Razorpay webhook error:', error);

        return new Response(JSON.stringify({ error: error.message, success: false }), { status: 500 });
    }
};
