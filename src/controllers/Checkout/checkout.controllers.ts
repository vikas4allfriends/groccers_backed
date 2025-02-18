import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import Cart from '../../models/cart.models';
import Order from '../../models/order.models'; // Assume an Order schema exists
import { v4 as uuidv4 } from 'uuid'; // For generating unique Order IDs
import { CustomError } from '../../utils/error';
import { createPayment } from '../Payment/Payment.controller';
import ProductBatch from '../../models/ProductBatch';
import Customer from '../../models/Customer';
import Role from '../../models/role.models';

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
        const TotalPrice = (ItemsPrice - discount) + deliveryCharge
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
        const razorpayOrder = await createPayment(orderId, TotalPrice);

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
export const checkoutWebCart1 = async (req: Request, res: Response) => {
    // const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    const requestBody = await req.json();
    let { Cart, DeliveryAddress, IsPaid, Discount = 0, DeliveryCharge = 0, CustomerId, SalesDate, CustomerName } = requestBody;

    console.log('data===', requestBody);

    // if (roleCheck instanceof Response) {
    //     return roleCheck;
    // }

    if (!SalesDate) {
        return new Response(JSON.stringify({ success: false, error: 'SalesDate is mandatory field.' }), { status: 404 });
    }
    // If CustomerId is not provided, create a new user
    if (!CustomerId) {

        if (!CustomerName) {
            return new Response(JSON.stringify({ success: false, error: 'CustomerName is required to create a new user.' }), { status: 400 });
            // throw new CustomError("CustomerName is required to create a new user.", 400);
        }

        const role = await Role.findOne({ name: "Customer" })

        if (!role) {
            return new Response(JSON.stringify({ success: false, error: 'Cutomer Role not found in Database to create new user.' }), { status: 400 });
        }

        console.log('role id -- ', role)
        try {
            const newUser = new User({
                FirstName: CustomerName,
                Role: role?._id,
                IsActive: true,
            });

            const savedUser = await newUser.save();
            CustomerId = savedUser._id.toString(); // Assign newly created user ID to CustomerId
            console.log("New Customer Created:", savedUser);
        } catch (error) {
            console.error("Error creating new customer:", error);
            return new Response(JSON.stringify({ success: false, error: 'Error creating new customer.' }), { status: 500 });
        }
    }

    if (!Cart || Cart.length === 0 || Cart === null) {
        console.log('Cart is empty');
        return new Response(JSON.stringify({ success: false, error: 'Cart is empty' }), { status: 400 });
    }

    try {
        // Calculate the total price
        const ItemsPrice = Cart.reduce((sum, item) => sum + item.Quantity * item.PriceAtAddTime, 0);
        const TotalPrice = (ItemsPrice - Discount) + DeliveryCharge;
        console.log('ItemsPrice TotalPrice', ItemsPrice, TotalPrice)

        // Generate a unique order ID
        const orderId = uuidv4();

        // Create an order object
        const order = new Order({
            OrderId: orderId,
            UserId: CustomerId, // Use existing or newly created CustomerId
            Items: Cart,
            TotalPrice: TotalPrice,
            IsPaid: IsPaid,
            OrderStatus: 'Confirmed',
            Discount: Discount,
            DeliveryCharge: DeliveryCharge,
            IsCashOnDelivery: false,
            DeliveryAddress: {
                fullName: DeliveryAddress.fullName || "NA",
                mobileNumber: DeliveryAddress.mobileNumber || "NA",
                houseNumber: DeliveryAddress.houseNumber || "NA",
                addressLine1: DeliveryAddress.addressLine1 || "NA",
                addressLine2: DeliveryAddress.addressLine2 || '',
                locality: DeliveryAddress.locality || '',
                street: DeliveryAddress.street || '',
                city: DeliveryAddress.city || "NA",
                state: DeliveryAddress.state || "NA",
                country: DeliveryAddress.country || "NA",
                pinCode: DeliveryAddress.pinCode.toString() || "NA",
            },
        });

        // Deduct stock and save order
        await sellProducts(Cart);
        await order.save();

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

export const checkoutWebCart = async (req, res) => {
    
    try {
        const requestBody = await req.json();
        let { Cart, DeliveryAddress, IsPaid, Discount = 0, DeliveryCharge = 0, CustomerId, SalesDate, CustomerName } = requestBody;

        console.log('Received data:', requestBody);

        if (!SalesDate) {
            return new Response(JSON.stringify({ success: false, error: 'SalesDate is mandatory.' }), { status: 400 });
        }

        if (!CustomerId && !CustomerName) {
            return new Response(JSON.stringify({ success: false, error: 'Required either Customer Name or Customer ID.' }), { status: 400 });
        }

        if (!Cart?.length) {
            console.log('Cart is empty');
            return new Response(JSON.stringify({ success: false, error: 'Cart is empty' }), { status: 400 });
        }

        // If CustomerId is not provided, create a new user
        if (!CustomerId) {
            if (!CustomerName) {
                return new Response(JSON.stringify({ success: false, error: 'CustomerName is required.' }), { status: 400 });
            }

            // const role = await Role.findOne({ name: "Customer" });
            const role = await Role.aggregate([
                {
                    $match: { name: "Customer" }
                },
            ])

            if (!role) {
                return new Response(JSON.stringify({ success: false, error: 'Customer role not found.' }), { status: 400 });
            }

            console.log('Customer role ID:', role[0]._id);

            // Ensure CustomerName is unique if it's used as a username
            // const existingUser = await Customer.findOne({ name: CustomerName });
            const existingUser = await Role.aggregate([
                {
                    $match: { name: CustomerName }
                },
            ])
            console.log('existingUser==', existingUser)
            if (existingUser) {
                return new Response(JSON.stringify({ success: false, error: `Customer with name ${existingUser} already exists.` }), { status: 400 });
            }

            const newCustomer = new Customer({
                name: CustomerName,
                role: role[0]._id,
                IsActive: true,
            });

            const savedUser = await newCustomer.save();
            CustomerId = savedUser._id.toString();
            console.log("New Customer Created:", savedUser);
        }

        // Calculate the total price
        const ItemsPrice = Cart.reduce((sum, item) => sum + item.Quantity * item.PriceAtAddTime, 0);
        const TotalPrice = (ItemsPrice - Discount) + DeliveryCharge;
        console.log('ItemsPrice:', ItemsPrice, 'TotalPrice:', TotalPrice);

        // Generate a unique order ID
        const orderId = uuidv4();

        // Create order object
        const order = new Order({
            OrderId: orderId,
            UserId: CustomerId,
            Items: Cart,
            TotalPrice: TotalPrice,
            IsPaid: IsPaid,
            OrderStatus: 'Confirmed',
            Discount: Discount,
            DeliveryCharge: DeliveryCharge,
            IsCashOnDelivery: false,
            DeliveryAddress: {
                fullName: DeliveryAddress?.fullName || "NA",
                mobileNumber: DeliveryAddress?.mobileNumber || "NA",
                houseNumber: DeliveryAddress?.houseNumber || "NA",
                addressLine1: DeliveryAddress?.addressLine1 || "NA",
                addressLine2: DeliveryAddress?.addressLine2 || '',
                locality: DeliveryAddress?.locality || '',
                street: DeliveryAddress?.street || '',
                city: DeliveryAddress?.city || "NA",
                state: DeliveryAddress?.state || "NA",
                country: DeliveryAddress?.country || "NA",
                pinCode: DeliveryAddress?.pinCode ? DeliveryAddress.pinCode.toString() : "NA",
            },
        });

        // Deduct stock and save order
        await sellProducts(Cart);
        await order.save();

        return new Response(
            JSON.stringify({
                message: 'Checkout successful. Order created.',
                order: {
                    OrderId: orderId,
                    Items: Cart,
                    TotalPrice: TotalPrice,
                },
                success: true,
                statusCode: 200,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Error during checkout:', error);
        return new Response(JSON.stringify({ success: false, error: 'Error during checkout.' }), { status: 500 });
    }
};

// Fetch batches of the product sorted by ExpiryDate (FIFO).
// Deduct quantities from the earliest-expiring batches first.

export async function sellProducts(products) {
    console.log('sellProducts---', products)
    const session = await ProductBatch.startSession();
    session.startTransaction();

    try {
        let results = [];

        for (const { ProductId, Quantity } of products) {
            let remainingQty = Quantity;

            // const firstbatch = ProductBatch.findOne({ProductId:ProductId})
            // Get all batches sorted by ExpiryDate (FIFO)
            const batches = await ProductBatch.find({ ProductId: ProductId })
                .sort({ ExpiryDate: 1 }) // FIFO order
                .session(session);

            if (!batches.length) {
                throw new Error(`No stock available for product: ${ProductId}`);
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
                throw new Error(`Not enough stock for product: ${ProductId}. Short by ${remainingQty} units.`);
            }

            results.push({ ProductId, message: "Product sold successfully." });
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


