import PurchaseOrder from '../../models/PurchaseOrder';
import Product from '../../models/Product';
import Shop from '../../models/Shop';
import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import mongoose from 'mongoose';
import ProductBatch from '../../models/ProductBatch';

export const AddPurchaseOrder_old = async (req) => {
  try {
    // Role and permission check
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    if (roleCheck instanceof Response) {
      return roleCheck;
    }

    const { shopId, products } = await req.json(); // assuming `req.body` is used in Next.js API routes
    console.log('shopId products==', shopId, products)
    // Validate shop existence
    const shop = await Shop.findById(shopId.toString());
    if (!shop) {
      return new Response(JSON.stringify({ success: false, error: 'Shop not found' }), { status: 404 });
    }

    let TotalPrice = 0;

    // Update product quantities and calculate total amount
    const purchaseOrderProducts = await Promise.all(
      products.map(async ({ productId, quantity, price }) => {
        const product = await Product.findById(productId);
        if (!product) {
          return new Response(JSON.stringify({ success: false, error: `Product with ID ${productId} not found` }), { status: 404 });
        }

        // Update product quantity
        product.Quantity = (Number(product.Quantity) || 0) + Number(quantity);
        await product.save();

        // Calculate total price
        TotalPrice += quantity * price;
        return { ProductId: productId, Quantity: quantity, PriceAtPurchaseTime: price };
      })
    );

    // Create purchase order
    const purchaseOrder = await PurchaseOrder.create({
      ShopId: shop._id,
      ShopName: shop.name,
      ShopAddress: {
        mobileNumber: shop.address.mobileNumber,
        addressLine1: shop.address.addressLine1,
        addressLine2: shop.address.addressLine2,
        city: shop.address.city,
        state: shop.address.state,
        country: shop.address.country,
      },
      Items: purchaseOrderProducts,
      TotalPrice,
    });

    return new Response(JSON.stringify({ success: true, purchaseOrder }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
};

export const searchPurchaseOrders = async (req) => {
  try {
    // Parse the request body as JSON
    const {
      ShopId,
      ShopName,
      city,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortField = 'PurchaseDate',
      sortOrder = 'desc', // 'asc' or 'desc'
    } = await req.json();

    // Build the query object
    const query = {};

    if (ShopId && mongoose.Types.ObjectId.isValid(ShopId)) {
      query.ShopId = ShopId;
    }

    if (ShopName) {
      query.ShopName = { $regex: ShopName, $options: 'i' }; // Case-insensitive partial match
    }

    if (city) {
      query['ShopAddress.city'] = { $regex: city, $options: 'i' }; // Case-insensitive partial match
    }

    if (startDate || endDate) {
      query.PurchaseDate = {};
      if (startDate) query.PurchaseDate.$gte = new Date(startDate); // Greater than or equal to startDate
      if (endDate) query.PurchaseDate.$lte = new Date(endDate); // Less than or equal to endDate
    }

    // Pagination and sorting
    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    // Execute the query
    const [orders, totalRecords] = await Promise.all([
      PurchaseOrder.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort(sort)
        .exec(),
      PurchaseOrder.countDocuments(query),
    ]);

    // Response
    return new Response(
      JSON.stringify({
        success: true,
        data: orders,
        pagination: {
          totalRecords,
          currentPage: Number(page),
          totalPages: Math.ceil(totalRecords / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error searching purchase orders:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error.' }),
      { status: 500 }
    );
  }
};

export const getAllPurchaseOrders1 = async (req) => {
  // Access query parameters using `nextUrl.searchParams`
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get('page')) || 1; // Default to 1
  const limit = parseInt(searchParams.get('limit')) || 10; // Default to 10
  const ShopId = searchParams.get('ShopId');
  const ShopName = searchParams.get('ShopName');
  const city = searchParams.get('city');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const sortField = searchParams.get('sortField') || 'PurchaseDate';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    // Role and permission check
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    if (roleCheck instanceof Response) {
      return roleCheck;
    }

    // Fetch purchase orders with filters and populate ProductId
    const orders = await PurchaseOrder.aggregate([
      {
        $match: {
          ...(ShopId && { ShopId: new mongoose.Types.ObjectId(ShopId) }),
          ...(ShopName && { ShopName }),
          ...(city && { 'ShopAddress.city': city }),
          ...(startDate && endDate && {
            PurchaseDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }),
        },
      },
      { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'products', // Collection name for Product
          localField: 'Items.ProductId',
          foreignField: '_id',
          as: 'ProductDetails',
        },
      },
      {
        $addFields: {
          Items: {
            $map: {
              input: '$Items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    ProductName: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$ProductDetails',
                            as: 'product',
                            cond: { $eq: ['$$product._id', '$$item.ProductId'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          ProductDetails: 0, // Exclude ProductDetails as it's no longer needed
        },
      },
    ]);

    // Count total records for pagination
    const totalRecords = await PurchaseOrder.countDocuments({
      ...(ShopId && { ShopId: new mongoose.Types.ObjectId(ShopId) }),
      ...(ShopName && { ShopName }),
      ...(city && { 'ShopAddress.city': city }),
      ...(startDate && endDate && {
        PurchaseDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }),
    });

    // Return response with orders and totalRecords
    return new Response(
      JSON.stringify({
        success: true,
        data: { orders, totalRecords },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ message: 'Error fetching orders' }), { status: 500 });
  }
};

export const getAllPurchaseOrders = async (req) => {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const ShopId = searchParams.get('ShopId');
  const ShopName = searchParams.get('ShopName');
  const city = searchParams.get('city');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const sortField = searchParams.get('sortField') || 'PurchaseDate';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    // Role and permission check
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    if (roleCheck instanceof Response) {
      return roleCheck;
    }

    // Fetch purchase orders with filters and populate related data
    const orders = await PurchaseOrder.aggregate([
      {
        $match: {
          ...(ShopId && { ShopId: new mongoose.Types.ObjectId(ShopId) }),
          ...(ShopName && { ShopName }),
          ...(city && { 'ShopAddress.city': city }),
          ...(startDate && endDate && {
            PurchaseDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }),
        },
      },
      { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: 'Items.ProductId',
          foreignField: '_id',
          as: 'ProductDetails',
        },
      },
      {
        $lookup: {
          from: 'productbatches', // Collection name for ProductBatch
          localField: 'ProductBatchId',
          foreignField: '_id',
          as: 'ProductBatchDetails',
        },
      },
      {
        $addFields: {
          Items: {
            $map: {
              input: '$Items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    ProductName: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$ProductDetails',
                            as: 'product',
                            cond: { $eq: ['$$product._id', '$$item.ProductId'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          ProductDetails: 0, // Exclude ProductDetails as it's no longer needed
        },
      },
    ]);

    // Count total records for pagination
    const totalRecords = await PurchaseOrder.countDocuments({
      ...(ShopId && { ShopId: new mongoose.Types.ObjectId(ShopId) }),
      ...(ShopName && { ShopName }),
      ...(city && { 'ShopAddress.city': city }),
      ...(startDate && endDate && {
        PurchaseDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }),
    });

    // Return response with orders and totalRecords
    return new Response(
      JSON.stringify({
        success: true,
        data: { orders, totalRecords },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ message: 'Error fetching orders' }), { status: 500 });
  }
};


export const AddPurchaseOrder = async (req) => {
  try {
    // Role and permission check
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    if (roleCheck instanceof Response) {
      return roleCheck;
    }

    const { shopId, products, PurchaseDate } = await req.json();
    console.log('shopId, products, PurchaseDate===', shopId, products, PurchaseDate)
    // Validate shop existence
    const shop = await Shop.findById(shopId.toString());
    if (!shop) {
      return new Response(JSON.stringify({ success: false, error: 'Shop not found' }), { status: 404 });
    }

    let TotalPrice = 0;
    const BatchesId = []
    // Update product quantities, calculate average buying price, and calculate total amount
    const purchaseOrderProducts = await Promise.all(
      products.map(async ({ productId, quantity, price, expiryDate }) => {
        console.log('expiryDate--',expiryDate)
        const product = await Product.findById(productId);
        if (!product) {
          return new Response(JSON.stringify({ success: false, error: `Product with ID ${productId} not found` }), { status: 404 });
        }
        console.log('product===', product)
        // Calculate new weighted average for BuyingPrice
        const currentQuantity = product.Quantity || 0;
        const currentBuyingPrice = product.BuyingPrice || 0;
        // console.log('currentBuyingPrice==', currentBuyingPrice)
        const newBuyingPrice =
          ((Number(currentQuantity) * Number(currentBuyingPrice)) + (Number(quantity) * Number(price))) / (Number(currentQuantity) + Number(quantity));
        // console.log('newBuyingPrice---', (Math.round(newBuyingPrice * 100) / 100).toFixed(2));
        // Update product attributes
        // product.Quantity = currentQuantity + quantity;
        // product.Quantity = (Number(product.Quantity) || 0) + Number(quantity);
        // product.BuyingPrice = (Math.round(newBuyingPrice * 100) / 100).toFixed(2);

        // Create a new product batch
        const newBatch = new ProductBatch({
          ProductId: productId,
          ExpiryDate: expiryDate?expiryDate:null,
          Quantity: Number(quantity),
          BuyingPrice: Number(price),
        });

        
        // Update expiry date if provided
        // if (expiryDate) {
        //   product.ExpiryDate = new Date(expiryDate);
        // }
        await product.save();
        const ProductBatchRes = await newBatch.save();
        BatchesId.push(ProductBatchRes._id)
        // Calculate total price for purchase order
        TotalPrice += quantity * price;

        return {
          ProductId: productId,
          Quantity: quantity,
          PriceAtPurchaseTime: price,
          BatchesId
        };
      })
    );

    console.log('purchaseOrderProducts id===', purchaseOrderProducts)
    console.log('Batches Ids===', BatchesId)

    // Create purchase order
    const purchaseOrder = await PurchaseOrder.create({
      ShopId: shop._id,
      ShopName: shop.name,
      ShopAddress: {
        mobileNumber: shop.address.mobileNumber,
        addressLine1: shop.address.addressLine1,
        addressLine2: shop.address.addressLine2,
        city: shop.address.city,
        state: shop.address.state,
        country: shop.address.country,
      },
      Items: purchaseOrderProducts,
      TotalPrice,
      ProductBatchId:BatchesId,
      PurchaseDate
    });

    return new Response(JSON.stringify({ success: true, purchaseOrder }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
};

