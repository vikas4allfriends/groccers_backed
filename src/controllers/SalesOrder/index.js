import {checkUserRoleAndPermission} from '../../middlewares/checkUserRoleAndPermission';
import mongoose from 'mongoose';
import Order from '../../models/order.models';

export const getAllSalesOrders = async (req) => {
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



export const getAllOrders = async (req) => {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const userId = searchParams.get('UserId');
    const orderStatus = searchParams.get('OrderStatus');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const customerType = searchParams.get('customerType') || 'Customer';
    try {
        // Role and permission check
        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        // Construct filter object
        const filters = {
            ...(userId && { UserId: new mongoose.Types.ObjectId(userId) }),
            ...(orderStatus && { OrderStatus: orderStatus }),
            ...(customerType && { CustomerType: customerType }),
            ...(startDate && endDate && {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },

            }),
        };

        // Fetch orders with filters, sorting, and pagination
        const orders = await Order.find(filters)
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
              path: 'CustomerRefId',
          })
            .populate({
                path: 'Items.ProductId',
                select: 'Name Price',
            });

        // Count total records for pagination
        const totalRecords = await Order.countDocuments(filters);

        return new Response(
            JSON.stringify({ success: true, data: { orders, totalRecords } }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response(JSON.stringify({ message: 'Error fetching orders' }), { status: 500 });
    }
};
