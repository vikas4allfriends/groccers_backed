import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import Cart from '../../models/cart.models';
import Order from '../../models/order.models'; // Assume an Order schema exists
import { v4 as uuidv4 } from 'uuid'; // For generating unique Order IDs
import { CustomError } from '../../utils/error';

export const checkoutCart = async (req: Request, res: Response) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    const userId = roleCheck.user._id.toString(); // User ID from request params

    // Find the user's active cart
    const cart = await Cart.findOne({ UserId: userId, IsActive: true });

    if (!cart || cart.Items.length === 0 || cart === null) {
        throw new CustomError('No active cart found or the cart is empty.', 400)
    }
    try {
        // Calculate the total price
        const totalPrice = cart.Items.reduce((sum, item) => sum + item.Quantity * item.PriceAtAddTime, 0);
        console.log('totalPrice==', totalPrice)
        // Generate a unique order ID
        const orderId = uuidv4();
        console.log('orderId==', orderId)
        // Create a new order
        const order = new Order({
            OrderId: orderId,
            UserId: userId,
            Items: cart.Items, // Copy items from the cart
            TotalPrice: totalPrice,
            IsPaid: false, // Payment status to be handled later
            OrderStatus: 'Pending', // Initial order status
        });

        await order.save();

        // Mark the cart as inactive
        cart.IsActive = false;
        await cart.save();
        return new Response(JSON.stringify({
            message: "Checkout successful. Order created.",
            order: {
                OrderId: orderId,
                Items: cart.Items,
                TotalPrice: totalPrice,
            },
            success: true,
            statusCode: 200
        }))
    } catch (error) {
        console.error(error);
        throw new CustomError('Error during checkout.', 500)
    }
};
