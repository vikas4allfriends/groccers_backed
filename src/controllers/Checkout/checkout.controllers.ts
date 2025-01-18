import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import Cart from '../../models/cart.models';
import Order from '../../models/order.models'; // Assume an Order schema exists
import { v4 as uuidv4 } from 'uuid'; // For generating unique Order IDs
import { CustomError } from '../../utils/error';
import { createPayment } from '../Payment/Payment.controller';

export const checkoutCart = async (req: Request, res: Response) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    const requestBody = await req.json();
    const { deliveryAddress, isCashOnDelivery, discount, deliveryCharge } = requestBody;

    console.log('data===', requestBody)

    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    const userId = roleCheck.user._id.toString(); // User ID from request params

    if (!deliveryAddress) {
        console.log('Delivery address is missing')
        throw new CustomError('Delivery address is missing.', 400);
    }

    // Validate required fields in deliveryAddress
    const requiredFields = [
        'fullName',
        'mobileNumber',
        'houseNumber',
        'addressLine1',
        'city',
        'state',
        'country',
        'pinCode',
    ];
    for (const field of requiredFields) {
        if (!deliveryAddress[field]) {
            console.log(`Delivery address field '${field}' is required.`)
            throw new CustomError(`Delivery address field '${field}' is required.`, 400);
        }
    }

    // Find the user's active cart
    const cart = await Cart.findOne({ UserId: userId, IsActive: true });

    if (!cart || cart.Items.length === 0 || cart === null) {
        console.log('No active cart found or the cart is empty')
        throw new CustomError('No active cart found or the cart is empty.', 400);
    }

    try {
        // Calculate the total price
        const ItemsPrice = cart.Items.reduce((sum, item) => sum + item.Quantity * item.PriceAtAddTime, 0);
        const TotalPrice = (ItemsPrice-discount)+deliveryCharge
        // Generate a unique order ID
        const orderId = uuidv4();

        // Create a new order in the database (without Razorpay details yet)
        const order = new Order({
            OrderId: orderId,
            UserId: userId,
            Items: cart.Items, // Copy items from the cart
            TotalPrice: TotalPrice,
            IsPaid: false, // Payment status to be handled later
            OrderStatus: 'Pending', // Initial order status,
            Discount: discount,
            DeliveryCharge: deliveryCharge,
            DeliveryAddress: {
                fullName: deliveryAddress.fullName,
                mobileNumber: deliveryAddress.mobileNumber,
                houseNumber: deliveryAddress.houseNumber,
                addressLine1: deliveryAddress.addressLine1,
                addressLine2: deliveryAddress.addressLine2 || '',
                locality: deliveryAddress.locality || '',
                street: deliveryAddress.street || '',
                city: deliveryAddress.city,
                state: deliveryAddress.state,
                country: deliveryAddress.country,
                pinCode: deliveryAddress.pinCode.toString(),
            },
            // RazorpayDetails: {
            //     PaymentGatewayOrderId: null,
            //     PaymentGatewayOrderAmount: null,
            //     Currency: 'INR',
            //     PaymentStatus: 'Pending',
            // },
        });

        await order.save();

        // Generate a Razorpay order
        const razorpayOrder = await createPayment(orderId,TotalPrice);

        // Update the order in the database with Razorpay details
        order.RazorpayDetails = {
            PaymentGatewayOrderId: razorpayOrder.id,
            PaymentGatewayOrderAmount: razorpayOrder.amount,
            Currency: razorpayOrder.currency,
            PaymentStatus: 'Pending', // Default status
        };

        await order.save();

        // Mark the cart as inactive
        cart.IsActive = false;
        await cart.save();

        // Return response to the client
        return new Response(
            JSON.stringify({
                message: 'Checkout successful. Order created.',
                order: {
                    OrderId: orderId,
                    Items: cart.Items,
                    TotalPrice: TotalPrice,
                    razorpayOrder,
                },
                success: true,
                statusCode: 200,
            })
        );
    } catch (error) {
        console.error(error);
        throw new CustomError('Error during checkout.', 500);
    }
};
