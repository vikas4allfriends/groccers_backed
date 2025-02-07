import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import { CustomError } from '../../utils/error';
import { type NextRequest } from 'next/server'
import mongoose from 'mongoose';
import Product from '../../models/product_old.models';
import Cart from '../../models/cart.models';
import dbConnect from '../../lib/dbConnect';

// export const getCart = async (req: Request) => {
//     const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

//     if (roleCheck instanceof Response) {
//         return roleCheck;
//     }


// }

// Add an item to the cart
// export const addItemToCart = async (req: Request, res: Response) => {
//     try {

//         const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

//         if (roleCheck instanceof Response) {
//             return roleCheck;
//         }

//         const userId = roleCheck.user._id.toString(); // User ID from request params
//         const { productId, quantity } = await req.json(); // Product ID and quantity from request body
//         console.log('productId--',productId)
//         if (!productId || !quantity || quantity <= 0) {
//             // return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
//             throw new CustomError("Invalid product or quantity ", 400)
//         }

//         // Check if the product exists
//         const product = await Product.findById(productId);

//         if (!product) {
//             return new Response(JSON.stringify({ success: false, message: 'Product not found', statusCode: 404 }));
//         }

//         // Check if the user already has an active cart
//         let cart = await Cart.findOne({ UserId: userId, IsActive: true });

//         if (!cart) {
//             // If no active cart exists, create a new one
//             cart = new Cart({
//                 UserId: userId,
//                 Items: [
//                     {
//                         ProductId: productId,
//                         Quantity: quantity,
//                         PriceAtAddTime: product.Price, // Lock the current price
//                     }
//                 ]
//             });
//         } else {
//             // If an active cart exists, check if the product is already in the cart
//             const existingItem = cart.Items.find(item => item.ProductId.toString() === productId);

//             if (existingItem) {
//                 // If the product exists in the cart, update the quantity
//                 existingItem.Quantity += quantity;
//             } else {
//                 // Otherwise, add the product as a new item
//                 cart.Items.push({
//                     ProductId: productId,
//                     Quantity: quantity,
//                     PriceAtAddTime: product.Price, // Lock the current price
//                 });
//             }
//         }

//         // Save the cart
//         await cart.save();
//         return new Response(JSON.stringify({ success: true, message: 'Item added to cart successfully', cart, statusCode: 200 }));
//     } catch (error) {
//         return new Response(JSON.stringify({ success: false, message: 'Error adding item to cart ' + error, statusCode: 500 }));
//     }
// };

export const addItemToCart = async (req) => {
    try {

        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const userId = roleCheck.user._id.toString(); // User ID from request params

        const { productId, quantity } = await req.json();
        console.log('productId==', productId)
        // Fetch product details using aggregation
        const productAggregation = await Product.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(productId), IsActive: true, IsDeleted: false } },
            {
                $lookup: {
                    from: "productcategories", // Collection name for ProductCategory
                    localField: "ProductCategoryId",
                    foreignField: "_id",
                    as: "productCategory",
                },
            },
            { $unwind: { path: "$productCategory", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "measuringunits", // Collection name for MeasuringUnit
                    localField: "MeasuringUnitId",
                    foreignField: "_id",
                    as: "measuringUnit",
                },
            },
            { $unwind: { path: "$measuringUnit", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "productimages", // Collection name for ProductImages
                    localField: "_id",
                    foreignField: "ProductId",
                    as: "productImages",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: "$Name",
                    description: "$Description",
                    price: "$Price",
                    tags: "$Tags",
                    productCategory: {
                        _id: "$productCategory._id",
                        name: "$productCategory.name",
                        categoryImage: "$productCategory.CategoryImageUrl",
                    },
                    measuringUnit: {
                        _id: "$measuringUnit._id",
                        name: "$measuringUnit.name",
                    },
                    productImages: {
                        _id: 1,
                        productId: 1,
                        imageUrl: 1,
                    },
                },
            },
        ]);

        const product = productAggregation[0];
        if (!product) {
            return new Response(
                JSON.stringify({ success: false, message: "Product not found or inactive" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the cart already exists for the user
        let cart = await Cart.findOne({ UserId: userId, IsActive: true });
        if (!cart) {
            cart = await new Cart({ UserId: userId, Items: [] });
        }

        // Check if the product is already in the cart
        const existingItemIndex = cart.Items.findIndex((item) => item.ProductId.toString() === productId);
        if (existingItemIndex !== -1) {
            // Update quantity if product already exists
            cart.Items[existingItemIndex].Quantity += quantity;
            cart.Items[existingItemIndex].PriceAtAddTime = product.price;
        } else {
            // Add new item to the cart
            cart.Items.push({
                ProductId: productId,
                Quantity: quantity,
                PriceAtAddTime: product.price,
            });
        }

        // Save the cart
        await cart.save();
        // console.log('cart.Items._id===',cart)
        const aggregatedCart = await Cart.aggregate([
            { $match: { UserId: new mongoose.Types.ObjectId(userId), IsActive: true } },
            { $unwind: "$Items" },
            {
                $lookup: {
                    from: "products", // Collection name for Product
                    localField: "Items.ProductId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "productcategories", // Collection name for ProductCategory
                    localField: "productDetails.ProductCategoryId",
                    foreignField: "_id",
                    as: "productDetails.productCategory",
                },
            },
            { $unwind: { path: "$productDetails.productCategory", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "measuringunits", // Collection name for MeasuringUnit
                    localField: "productDetails.MeasuringUnitId",
                    foreignField: "_id",
                    as: "productDetails.measuringUnit",
                },
            },
            { $unwind: { path: "$productDetails.measuringUnit", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "productimages", // Collection name for ProductImages
                    localField: "productDetails._id",
                    foreignField: "ProductId",
                    as: "productDetails.productImages",
                },
            },
            {
                $project: {
                    _id: "$Items._id",
                    product: {
                        _id: "$productDetails._id",
                        name: "$productDetails.Name",
                        description: "$productDetails.Description",
                        price: "$productDetails.Price",
                        tags: "$productDetails.Tags",
                        productCategory: {
                            _id: "$productDetails.productCategory._id",
                            name: "$productDetails.productCategory.name",
                            categoryImage: "$productDetails.productCategory.CategoryImageUrl",
                        },
                        measuringUnit: {
                            _id: "$productDetails.measuringUnit._id",
                            name: "$productDetails.measuringUnit.name",
                        },
                        productImages: "$productDetails.productImages",
                    },
                    priceWhenAddedToCart: "$Items.PriceAtAddTime",
                    quantity: "$Items.Quantity",
                },
            },
        ]);
        // Format the response
        const responseItem = {
            _id: cart._id,
            product,
            priceWhenAddedToCart: product.price,
            quantity,
        };

        return new Response(
            JSON.stringify({
                success: true,
                message: "Item added to cart successfully",
                data: aggregatedCart,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to add item to cart ", error,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};


export const getCart1 = async (req: Request, res: Response) => {
    try {
        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }
        const userId = roleCheck.user._id.toString(); // User ID from request params
        console.log('userId???', userId)

        const cart = await Cart.findOne({ UserId: userId, IsActive: true });

        if (!cart) {
            console.log('no cart found')
            // throw new CustomError("Cart not found ", 404)
            return new Response(JSON.stringify([]))
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
            return new Response(JSON.stringify({ success: true, statusCode: 200, message: 'Price changes detected' }))
        }
        return new Response(JSON.stringify({ success: true, statusCode: 200, cart, message: 'No price changes detected' }))
    } catch (error) {
        console.log("Error checking for price changes ", error)
        throw new CustomError("Error checking for price changes " + error, 500)
    }
};


export const getCart = async (req) => {
    try {
        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const userId = roleCheck.user._id.toString(); // User ID from request params
        console.log('userId===', userId)
        // Fetch the cart for the given user with aggregation
        const aggregatedCart = await Cart.aggregate([
            { $match: { UserId: new mongoose.Types.ObjectId(userId), IsActive: true } },
            { $unwind: "$Items" },
            {
                $lookup: {
                    from: "products", // Collection name for Product
                    localField: "Items.ProductId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "productcategories", // Collection name for ProductCategory
                    localField: "productDetails.ProductCategoryId",
                    foreignField: "_id",
                    as: "productDetails.productCategory",
                },
            },
            { $unwind: { path: "$productDetails.productCategory", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "measuringunits", // Collection name for MeasuringUnit
                    localField: "productDetails.MeasuringUnitId",
                    foreignField: "_id",
                    as: "productDetails.measuringUnit",
                },
            },
            { $unwind: { path: "$productDetails.measuringUnit", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "productimages", // Collection name for ProductImages
                    localField: "productDetails._id",
                    foreignField: "ProductId",
                    as: "productDetails.productImages",
                },
            },
            {
                $project: {
                    _id: "$Items._id",
                    product: {
                        _id: "$productDetails._id",
                        name: "$productDetails.Name",
                        description: "$productDetails.Description",
                        price: "$productDetails.Price",
                        tags: "$productDetails.Tags",
                        productCategory: {
                            _id: "$productDetails.productCategory._id",
                            name: "$productDetails.productCategory.name",
                            categoryImage: "$productDetails.productCategory.CategoryImageUrl",
                        },
                        measuringUnit: {
                            _id: "$productDetails.measuringUnit._id",
                            name: "$productDetails.measuringUnit.name",
                        },
                        productImages: "$productDetails.productImages",
                    },
                    priceWhenAddedToCart: "$Items.PriceAtAddTime",
                    quantity: "$Items.Quantity",
                },
            },
        ]);
        // Aggregate cart data with populated fields
        // const aggregatedCart = await Cart.aggregate([
        //     { $match: { UserId: new mongoose.Types.ObjectId(userId), IsActive: true, IsDeleted: false } },
        //     { $unwind: "$Items" },
        //     {
        //         $lookup: {
        //             from: "products",
        //             localField: "Items.ProductId",
        //             foreignField: "_id",
        //             as: "product",
        //         },
        //     },
        //     { $unwind: "$product" },
        //     {
        //         $lookup: {
        //             from: "productcategories",
        //             localField: "product.ProductCategoryId",
        //             foreignField: "_id",
        //             as: "product.productCategory",
        //         },
        //     },
        //     { $unwind: "$product.productCategory" },
        //     {
        //         $lookup: {
        //             from: "measuringunits",
        //             localField: "product.MeasuringUnitId",
        //             foreignField: "_id",
        //             as: "product.measuringUnit",
        //         },
        //     },
        //     { $unwind: "$product.measuringUnit" },
        //     {
        //         $lookup: {
        //             from: "productimages",
        //             localField: "product._id",
        //             foreignField: "ProductId",
        //             as: "product.productImages",
        //         },
        //     },
        //     {
        //         $group: {
        //             _id: "$_id",
        //             UserId: { $first: "$UserId" },
        //             IsActive: { $first: "$IsActive" },
        //             IsDeleted: { $first: "$IsDeleted" },
        //             Items: {
        //                 $push: {
        //                     _id: "$Items._id", // Include cartItemId
        //                     product: {
        //                         _id: "$product._id",
        //                         name: "$product.Name",
        //                         description: "$product.Description",
        //                         price: "$product.Price",
        //                         tags: "$product.Tags",
        //                         productCategory: {
        //                             _id: "$product.productCategory._id",
        //                             name: "$product.productCategory.Name",
        //                             categoryImage: "$product.productCategory.CategoryImage",
        //                         },
        //                         measuringUnit: {
        //                             _id: "$product.measuringUnit._id",
        //                             name: "$product.measuringUnit.Name",
        //                         },
        //                         productImages: "$product.productImages",
        //                     },
        //                     priceWhenAddedToCart: "$Items.PriceAtAddTime",
        //                     quantity: "$Items.Quantity",
        //                 },
        //             },
        //         },
        //     },
        // ]);

        if (aggregatedCart.length === 0) {
            return new Response(JSON.stringify({data:[]}))

        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Cart fetched successfully",
                data: aggregatedCart,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error fetching cart:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to fetch cart" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

export const Increment_Or_Decrement_Cart_Item = async (req) => {
    try {
        const { cartItemId, action } = await req.json();
        console.log('cartItemId, action===', cartItemId, action)
        if (!cartItemId || !action) {
            return new Response(JSON.stringify({ success: false, message: "Invalid request data" }), { status: 400 });
        }

        await dbConnect()

        // Find the cart containing the cart item
        const cart = await Cart.findOne({ "Items._id": cartItemId });
        console.log('cart==', cart)
        if (!cart) {
            return new Response(JSON.stringify({ success: false, message: "Cart item not found" }), { status: 404 });
        }

        const cartItemIndex = cart.Items.findIndex((item) => item._id.toString() === cartItemId);

        if (cartItemIndex === -1) {
            return new Response(JSON.stringify({ success: false, message: "Cart item not found" }), { status: 404 });
        }

        const cartItem = cart.Items[cartItemIndex];

        // Increment or decrement the quantity
        if (action === "increment") {
            cartItem.Quantity += 1;
        } else if (action === "decrement") {
            if (cartItem.Quantity === 1) {
                // Remove the item if quantity is 1 and action is decrement
                cart.Items.splice(cartItemIndex, 1);
            } else {
                cartItem.Quantity -= 1;
            }
        } else {
            return new Response(JSON.stringify({ success: false, message: "Invalid action" }), { status: 400 });
        }

        // Save the updated cart
        await cart.save();

        // Aggregate cart data with populated fields (similar to getCart)
        const aggregatedCart = await Cart.aggregate([
            { $match: { _id: cart._id } },
            { $unwind: "$Items" },
            {
                $lookup: {
                    from: "products",
                    localField: "Items.ProductId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "productcategories",
                    localField: "product.ProductCategoryId",
                    foreignField: "_id",
                    as: "product.productCategory",
                },
            },
            { $unwind: "$product.productCategory" },
            {
                $lookup: {
                    from: "measuringunits",
                    localField: "product.MeasuringUnitId",
                    foreignField: "_id",
                    as: "product.measuringUnit",
                },
            },
            { $unwind: "$product.measuringUnit" },
            {
                $lookup: {
                    from: "productimages",
                    localField: "product._id",
                    foreignField: "ProductId",
                    as: "product.productImages",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    UserId: { $first: "$UserId" },
                    IsActive: { $first: "$IsActive" },
                    IsDeleted: { $first: "$IsDeleted" },
                    Items: {
                        $push: {
                            _id: "$Items._id",
                            product: {
                                _id: "$product._id",
                                name: "$product.Name",
                                description: "$product.Description",
                                price: "$product.Price",
                                tags: "$product.Tags",
                                productCategory: {
                                    _id: "$product.productCategory._id",
                                    name: "$product.productCategory.Name",
                                    categoryImage: "$product.productCategory.CategoryImage",
                                },
                                measuringUnit: {
                                    _id: "$product.measuringUnit._id",
                                    name: "$product.measuringUnit.Name",
                                },
                                productImages: "$product.productImages",
                            },
                            priceWhenAddedToCart: "$Items.PriceAtAddTime",
                            quantity: "$Items.Quantity",
                        },
                    },
                },
            },
        ]);

        return new Response(
            JSON.stringify({
                success: true,
                message: action === "increment" ? "Item incremented successfully" : "Item decremented successfully",
                cart: aggregatedCart[0] || null,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in Increment_Or_Decrement_Cart_Item API:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
    }
}

export const RemoveCartItem = async (req) =>{
    try {
        const { cartItemId } = await req.json();

        if (!cartItemId) {
            return new Response(JSON.stringify({ success: false, message: "Invalid request data" }), { status: 400 });
        }

        await dbConnect();

        // Find the cart containing the cart item
        const cart = await Cart.findOne({ "Items._id": cartItemId });

        if (!cart) {
            return new Response(JSON.stringify({ success: false, message: "Cart item not found" }), { status: 404 });
        }

        // Remove the item from the cart
        const updatedItems = cart.Items.filter((item) => item._id.toString() !== cartItemId);
        cart.Items = updatedItems;

        // Save the updated cart
        await cart.save();

        // Aggregate cart data with populated fields (similar to getCart)
        const aggregatedCart = await Cart.aggregate([
            { $match: { _id: cart._id } },
            { $unwind: "$Items" },
            {
                $lookup: {
                    from: "products",
                    localField: "Items.ProductId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "productcategories",
                    localField: "product.ProductCategoryId",
                    foreignField: "_id",
                    as: "product.productCategory",
                },
            },
            { $unwind: "$product.productCategory" },
            {
                $lookup: {
                    from: "measuringunits",
                    localField: "product.MeasuringUnitId",
                    foreignField: "_id",
                    as: "product.measuringUnit",
                },
            },
            { $unwind: "$product.measuringUnit" },
            {
                $lookup: {
                    from: "productimages",
                    localField: "product._id",
                    foreignField: "ProductId",
                    as: "product.productImages",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    UserId: { $first: "$UserId" },
                    IsActive: { $first: "$IsActive" },
                    IsDeleted: { $first: "$IsDeleted" },
                    Items: {
                        $push: {
                            _id: "$Items._id",
                            product: {
                                _id: "$product._id",
                                name: "$product.Name",
                                description: "$product.Description",
                                price: "$product.Price",
                                tags: "$product.Tags",
                                productCategory: {
                                    _id: "$product.productCategory._id",
                                    name: "$product.productCategory.Name",
                                    categoryImage: "$product.productCategory.CategoryImage",
                                },
                                measuringUnit: {
                                    _id: "$product.measuringUnit._id",
                                    name: "$product.measuringUnit.Name",
                                },
                                productImages: "$product.productImages",
                            },
                            priceWhenAddedToCart: "$Items.PriceAtAddTime",
                            quantity: "$Items.Quantity",
                        },
                    },
                },
            },
        ]);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Item removed successfully",
                cart: aggregatedCart[0] || null,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in RemoveCartItem API:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
    }

}