import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import Shop from '../../models/Shop';
import dbConnect from '../../lib/dbConnect';

export const createShop = async (req) => {
  // const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
  // if (roleCheck instanceof Response) {
  //   return roleCheck;
  // }
  dbConnect();
  try {
    const { name, address } = await req.json()
    console.log('name, address-----', name, address)
    // Validate request body
    if (!name || !address) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Shop name and address are required.',
        }),
        { status: 400 }
      );
    }
    const { mobileNumber, addressLine1, city, state, country } = address;

    if (!mobileNumber || !addressLine1 || !city || !state || !country) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All address fields (mobileNumber, addressLine1, city, state, country) are required.',
        }),
        { status: 400 }
      );
    }

    // Create a new shop
    const newShop = new Shop({
      name,
      address,
    });

    // Save the shop to the database
    const shop = await newShop.save();

    // Return the success response
    return new Response(JSON.stringify({ success: true, shop }), { status: 201 });
  } catch (error) {
    console.error('Error adding shop:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while adding the shop.',
      }),
      { status: 500 }
    );
  }
}

export const updateShop = async (req) => {
  try {
    const { shopId, name, address } = await req.json(); // Use `req.json()` to parse the request body

    // Validate request body
    if (!shopId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Shop ID is required.' }),
        { status: 400 }
      );
    }

    if (!name && !address) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'At least one field (name or address) must be provided for update.',
        }),
        { status: 400 }
      );
    }

    // Find the shop by ID
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return new Response(
        JSON.stringify({ success: false, message: 'Shop not found.' }),
        { status: 404 }
      );
    }

    // Update the shop fields
    if (name) shop.name = name;
    if (address) {
      const { mobileNumber, addressLine1, city, state, country } = address;
      if (!mobileNumber || !addressLine1 || !city || !state || !country) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'All address fields (mobileNumber, addressLine1, city, state, country) are required.',
          }),
          { status: 400 }
        );
      }
      shop.address = address;
    }

    // Save the updated shop
    const updatedShop = await shop.save();

    // Return the success response
    return new Response(JSON.stringify({ success: true, shop: updatedShop }), { status: 200 });
  } catch (error) {
    console.error('Error updating shop:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while updating the shop.',
      }),
      { status: 500 }
    );
  }
}

export const searchShop = async (req) => {
  try {
    dbConnect();

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q') || ''; // Optional query to search by name
    const city = url.searchParams.get('city') || ''; // Optional query to filter by city
    const state = url.searchParams.get('state') || ''; // Optional query to filter by state
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Page number for pagination
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Limit per page for pagination

    const filters = {};

    // Add filters based on query parameters
    if (searchQuery) {
      filters.name = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search
    }
    if (city) {
      filters['address.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      filters['address.state'] = { $regex: state, $options: 'i' };
    }
    // Fetch shops with pagination
    const skip = (page - 1) * limit;
    const shops = await Shop.find(filters).skip(skip).limit(limit);
    const totalShops = await Shop.countDocuments(filters);

    return new Response(
      JSON.stringify({
        success: true,
        shops,
        totalShops,
        currentPage: page,
        totalPages: Math.ceil(totalShops / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}