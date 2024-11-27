import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import { CustomError } from '../../utils/error';
import { type NextRequest } from 'next/server'
import mongoose from 'mongoose';
import Product from '../../models/product.models';
import Cart from '../../models/cart.models';

export const getCart = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    if (roleCheck instanceof Response) {
        return roleCheck;
    }


}

// Add an item to the cart
export const addItemToCart = async (req: Request, res: Response) => {
    try {

        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const userId = roleCheck.user._id.toString(); // User ID from request params
        const { productId, quantity } = await req.json(); // Product ID and quantity from request body

        if (!productId || !quantity || quantity <= 0) {
            // return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
            throw new CustomError("Invalid product or quantity ", 400)
        }

        // Check if the product exists
        const product = await Product.findById(productId);

        if (!product) {
            return new Response(JSON.stringify({ success: false, message: 'Product not found', statusCode: 404 }));
        }

        // Check if the user already has an active cart
        let cart = await Cart.findOne({ UserId: userId, IsActive: true });

        if (!cart) {
            // If no active cart exists, create a new one
            cart = new Cart({
                UserId: userId,
                Items: [
                    {
                        ProductId: productId,
                        Quantity: quantity,
                        PriceAtAddTime: product.Price, // Lock the current price
                    }
                ]
            });
        } else {
            // If an active cart exists, check if the product is already in the cart
            const existingItem = cart.Items.find(item => item.ProductId.toString() === productId);

            if (existingItem) {
                // If the product exists in the cart, update the quantity
                existingItem.Quantity += quantity;
            } else {
                // Otherwise, add the product as a new item
                cart.Items.push({
                    ProductId: productId,
                    Quantity: quantity,
                    PriceAtAddTime: product.Price, // Lock the current price
                });
            }
        }

        // Save the cart
        await cart.save();

        // return res.status(200).json({
        //     success: true,
        //     message: 'Item added to cart successfully',
        //     cart
        // });
        return new Response(JSON.stringify({ success: true, message: 'Item added to cart successfully', cart, statusCode: 200 }));
    } catch (error) {


        console.error(error);
        // return res.status(500).json({
        //     success: false,
        //     message: 'Error adding item to cart',
        //     error: error.message
        // });
        return new Response(JSON.stringify({ success: false, message: 'Error adding item to cart ' + error, statusCode: 500 }));
    }
};

export const checkForPriceChanges = async (req: Request, res: Response) => {
    try {
        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const userId = roleCheck.user._id.toString(); // User ID from request params

        const cart = await Cart.findOne({ UserId: userId, IsActive: true });

        if (!cart) {
            throw new CustomError("Cart not found ", 404)
        }

        const priceChanges = [];

        for (let item of cart.Items) {
            const product = await Product.findById(item.ProductId);

            if (product && product.Price !== item.PriceAtAddTime) {
                priceChanges.push({
                    ProductId: product._id,
                    Name: product.Name,
                    OldPrice: item.PriceAtAddTime,
                    NewPrice: product.Price
                });
            }
        }

        if (priceChanges.length > 0) {
            // return res.status(200).json({
            //     success: true,
            //     message: 'Price changes detected',
            //     priceChanges
            // });
            return new Response(JSON.stringify({success: true, statusCode: 200, message: 'Price changes detected'}))
        }

        // return res.status(200).json({
        //     success: true,
        //     message: 'No price changes detected'
        // });
        return new Response(JSON.stringify({success: true, statusCode: 200, message: 'No price changes detected'}))
    } catch (error) {
        // return res.status(500).json({
        //     success: false,
        //     message: 'Error checking for price changes',
        //     error
        // });
        throw new CustomError("Error checking for price changes ", 500)
    }
};

