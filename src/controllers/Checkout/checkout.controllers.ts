import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import Cart from '../../models/cart.models';
import Order from '../../models/order.models'; // Assume an Order schema exists
import { v4 as uuidv4 } from 'uuid'; // For generating unique Order IDs
import { CustomError } from '../../utils/error';
import { createPayment } from '../Payment/Payment.controller';
import ProductBatch from '../../models/ProductBatch';

export const checkoutCart1 = async (req: Request, res: Response) => {
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

// Checkout if oder is coming from mobile app
export const checkoutCart = async (req: Request, res: Response) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    const requestBody = await req.json();
    const { deliveryAddress, isCashOnDelivery, discount = 0, deliveryCharge = 0 } = requestBody;

    console.log('data===', requestBody);

    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    const userId = roleCheck.user._id.toString(); // Get user ID

    if (!deliveryAddress) {
        console.log('Delivery address is missing');
        throw new CustomError('Delivery address is missing.', 400);
    }

    // Validate required fields in deliveryAddress
    const requiredFields = ['fullName', 'mobileNumber', 'houseNumber', 'addressLine1', 'city', 'state', 'country', 'pinCode'];
    for (const field of requiredFields) {
        if (!deliveryAddress[field]) {
            console.log(`Delivery address field '${field}' is required.`);
            throw new CustomError(`Delivery address field '${field}' is required.`, 400);
        }
    }

    // Find the user's active cart
    const cart = await Cart.findOne({ UserId: userId, IsActive: true });

    if (!cart || cart.Items.length === 0 || cart === null) {
        console.log('No active cart found or the cart is empty');
        throw new CustomError('No active cart found or the cart is empty.', 400);
    }

    try {
        // Calculate the total price
        const ItemsPrice = cart.Items.reduce((sum, item) => sum + item.Quantity * item.PriceAtAddTime, 0);
        const TotalPrice = (ItemsPrice - discount) + deliveryCharge;

        // Generate a unique order ID
        const orderId = uuidv4();

        // Create an order object
        const order = new Order({
            OrderId: orderId,
            UserId: userId,
            Items: cart.Items, // Copy items from the cart
            TotalPrice: TotalPrice,
            IsPaid: isCashOnDelivery, // If COD, mark as paid
            OrderStatus: isCashOnDelivery ? 'Confirmed' : 'Pending', // Set status accordingly
            Discount: discount,
            DeliveryCharge: deliveryCharge,
            IsCashOnDelivery: isCashOnDelivery,
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
        });

        if (!isCashOnDelivery) {
            // Generate a Razorpay order only if it's not COD
            const razorpayOrder = await createPayment(orderId, TotalPrice);

            // Attach Razorpay details
            order.RazorpayDetails = {
                PaymentGatewayOrderId: razorpayOrder.id,
                PaymentGatewayOrderAmount: razorpayOrder.amount,
                Currency: razorpayOrder.currency,
                PaymentStatus: 'Pending',
            };
        }

        // Save the order in the database
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
                    isCashOnDelivery: isCashOnDelivery,
                    ...(isCashOnDelivery ? {} : { razorpayOrder }), // Only return Razorpay details if applicable
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

// Checkout if oder is coming from web app
export const checkoutWebCart = async (req: Request, res: Response) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    const requestBody = await req.json();
    const { Cart,DeliveryAddress, IsPaid, Discount = 0, DeliveryCharge = 0, CustomerId } = requestBody;

    console.log('data===', requestBody);

    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    const userId = roleCheck.user._id.toString(); // Get user ID

    // if (!DeliveryAddress) {
    //     console.log('Delivery address is missing');
    //     throw new CustomError('Delivery address is missing.', 400);
    // }

    // Validate required fields in deliveryAddress
    const requiredFields = ['fullName', 'mobileNumber', 'houseNumber', 'addressLine1', 'city', 'state', 'country', 'pinCode'];
    for (const field of requiredFields) {
        if (!DeliveryAddress[field]) {
            console.log(`Delivery address field '${field}' is required.`);
            throw new CustomError(`Delivery address field '${field}' is required.`, 400);
        }
    }

    // Find the user's active cart
    // const cart = await Cart.findOne({ UserId: userId, IsActive: true });

    if (!Cart || Cart.Items.length === 0 || Cart === null) {
        console.log('No active cart found or the cart is empty');
        throw new CustomError('No active cart found or the cart is empty.', 400);
    }

    try {
        // Calculate the total price
        const ItemsPrice = Cart.Items.reduce((sum, item) => sum + item.Quantity * item.PriceAtAddTime, 0);
        const TotalPrice = (ItemsPrice - Discount) + DeliveryCharge;

        // Generate a unique order ID
        const orderId = uuidv4();

        // Create an order object
        const order = new Order({
            OrderId: orderId,
            UserId: userId,
            Items: Cart.Items, // Copy items from the cart
            TotalPrice: TotalPrice,
            IsPaid: IsPaid, // If COD, mark as paid
            OrderStatus: 'Confirmed', // Set status accordingly
            Discount: Discount,
            DeliveryCharge: DeliveryCharge,
            IsCashOnDelivery: false,
            DeliveryAddress: {
                fullName: DeliveryAddress.fullName,
                mobileNumber: DeliveryAddress.mobileNumber,
                houseNumber: DeliveryAddress.houseNumber,
                addressLine1: DeliveryAddress.addressLine1,
                addressLine2: DeliveryAddress.addressLine2 || '',
                locality: DeliveryAddress.locality || '',
                street: DeliveryAddress.street || '',
                city: DeliveryAddress.city,
                state: DeliveryAddress.state,
                country: DeliveryAddress.country,
                pinCode: DeliveryAddress.pinCode.toString(),
            },
        });

        // Save the order in the database
        await order.save();

        // Return response to the client
        return new Response(
            JSON.stringify({
                message: 'Checkout successful. Order created.',
                order: {
                    OrderId: orderId,
                    Items: Cart.Items,
                    TotalPrice: TotalPrice,
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

// Fetch batches of the product sorted by ExpiryDate (FIFO).
// Deduct quantities from the earliest-expiring batches first.

export async function sellProducts(products) {
    const session = await ProductBatch.startSession();
    session.startTransaction();
    
    try {
        let results = [];

        for (const { productId, quantity } of products) {
            let remainingQty = quantity;

            // Get all batches sorted by ExpiryDate (FIFO)
            const batches = await ProductBatch.find({ ProductId: productId })
                .sort({ ExpiryDate: 1 }) // FIFO order
                .session(session);

            if (!batches.length) {
                throw new Error(`No stock available for product: ${productId}`);
            }

            for (const batch of batches) {
                if (remainingQty <= 0) break;

                if (batch.Quantity <= remainingQty) {
                    remainingQty -= batch.Quantity;
                    await ProductBatch.findByIdAndDelete(batch._id).session(session);
                } else {
                    batch.Quantity -= remainingQty;
                    remainingQty = 0;
                    await batch.save({ session });
                }
            }

            if (remainingQty > 0) {
                throw new Error(`Not enough stock for product: ${productId}. Short by ${remainingQty} units.`);
            }

            results.push({ productId, message: "Product sold successfully." });
        }

        await session.commitTransaction();
        session.endSession();
        return results;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message);
    }
}
  

