import Customer from '../../models/Customer';
import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';

export const SearchCustomers = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 10);
    const CustomerId = url.searchParams.get('CustomerId') || null;
    const sortBy = url.searchParams.get('sortBy') || 'Price'; // Default sorting by Price
    const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? 1 : -1; // Default ascending

    console.log('Search Query:', query, '| Page:', page, '| Limit:', limit, '| SortBy:', sortBy, '| SortOrder:', sortOrder);

    // Build dynamic filters
    const filters = {};
    if (query) filters.name = { $regex: new RegExp(query, 'i') };
    if (CustomerId) filters._id = CustomerId;

    // Fetch all matching products (WITHOUT pagination yet)
    const customerList = await Customer.find(filters)
      // .populate('role')
      .lean();

    // const customerList = await Customer.aggregate([
    //   {
    //     $match: filters
    //   },
    //   {
    //     $lookup: {
    //       from: 'roles', // Collection name for the Role model
    //       localField: 'role', // Field in the User collection
    //       foreignField: '_id', // Field in the Role collection
    //       as: 'roleData', // Output array field
    //     },
    //   },
    //   {
    //     $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true }, // Unwind roleData
    //   },
    // ]).exec

    if (!customerList || customerList.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No cutomer found', customers: [] }), { status: 200 });
    }


    // **Sorting logic BEFORE pagination**
    const SortedCustomerList = customerList.sort((a, b) => {
      if (sortBy === 'Name') return (a.name - b.name) * sortOrder;
      if (sortBy === 'BuyingPrice') return (a.AverageBuyingPrice - b.AverageBuyingPrice) * sortOrder;
      if (sortBy === 'Quantity') return (a.TotalStockQuantity - b.TotalStockQuantity) * sortOrder;
      return 0;
    });

    // **Apply pagination AFTER sorting**
    const totalCustomers = SortedCustomerList.length;
    const totalPages = Math.ceil(totalCustomers / limit);
    const updatedCustomerList = SortedCustomerList.slice((page - 1) * limit, page * limit);

    return new Response(JSON.stringify({
      success: true,
      customers: updatedCustomerList,
      pagination: { totalPages, currentPage: page, totalItems: totalCustomers }
    }), { status: 200 });

  } catch (error) {
    console.error("Error in SearchProducts:", error.message, "\nRequest URL:", req.url);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};