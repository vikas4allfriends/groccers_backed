import dbConnect from '../../lib/dbConnect';
import UserPermissions from '../../models/UserPermission/index.ts';
import Role from '../../models/Role';
import { CustomError } from '../../utils/error';
import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import mongoose from 'mongoose';

// Define a mapping of model names to actual Mongoose models
const models = {
  UserPermissions,
  Role
}

export const AddPermission = async (req) => {
  dbConnect()
  try {
    const { description, name } = await req.json();
    const newPermissions = new UserPermissions({
      name,
      description,
    });

    await newPermissions.save();
    return new Response(JSON.stringify({ status: "success", message: "Permission created successfully", statusCode: 200 }))
  } catch (error) {
    throw new CustomError("Error while creating permission", 400)
  }
}

export const SearchPermissions = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 10);
    const PermissionId = url.searchParams.get('PermissionId') || null;
    const sortBy = url.searchParams.get('sortBy') || 'Price'; // Default sorting by Price
    const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? 1 : -1; // Default ascending

    console.log('Search Query:', query, '| Page:', page, '| Limit:', limit, '| SortBy:', sortBy, '| SortOrder:', sortOrder);

    // Build dynamic filters
    const filters = {};
    if (query) filters.name = { $regex: new RegExp(query, 'i') };
    if (PermissionId) filters._id = PermissionId;

    // Fetch all matching products (WITHOUT pagination yet)
    const PermissionList = await UserPermissions.find(filters).lean();




    // **Sorting logic BEFORE pagination**
    const SortedPermissionList = PermissionList.sort((a, b) => {
      if (sortBy === 'Name') return (a.name - b.name) * sortOrder;
      if (sortBy === 'BuyingPrice') return (a.AverageBuyingPrice - b.AverageBuyingPrice) * sortOrder;
      if (sortBy === 'Quantity') return (a.TotalStockQuantity - b.TotalStockQuantity) * sortOrder;
      return 0;
    });

    // **Apply pagination AFTER sorting**
    const totalCustomers = SortedPermissionList.length;
    const totalPages = Math.ceil(totalCustomers / limit);
    const updatedPermissionList = SortedPermissionList.slice((page - 1) * limit, page * limit);

    return new Response(JSON.stringify({
      success: true,
      permissions: updatedPermissionList,
      pagination: { totalPages, currentPage: page, totalItems: totalCustomers }
    }), { status: 200 });

  } catch (error) {
    console.error("Error in Permissions:", error.message, "\nRequest URL:", req.url);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};

export const update = async (req, res) => {
  console.log('updateeee')
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  try {
    const { id, modelName, data } = await req.json(); // Destructure `Model` and `id`
    console.log('data---', id, modelName, data )

    // Retrieve the original MeasuringUnit to keep `CreatedById` unchanged
    const existingData = await models[modelName].findById({_id:id});
    if (!existingData) {
      return new Response(JSON.stringify({ success: false, message: 'Data not found', statusCode: 404 }));
    }

    // Ensure CreatedById is not overwritten
    data["CreatedById"] = existingData.CreatedById;

    const updatedData = await models[modelName].findByIdAndUpdate(
      id,
      {
        $set: { ...data, LastUpdatedById: roleCheck.user._id.toString() }
      },
      { new: true, runValidators: true }
    );

    return new Response(JSON.stringify({ success: true, data: updatedData, statusCode: 200 }));
  } catch (error) {
    throw new CustomError("Error in updating : " + error, 500);
  }
};


export const DeleteById = async (req, res) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  try {
    const { id, modelName } = await req.json(); // Destructure `Model` and `id`

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Measuring Unit ID' }), { status: 404 });
    }

    // Find and delete
    const Entry = await models[modelName].findByIdAndDelete({ _id: id });
    if (!Entry) {
      return new Response(JSON.stringify({ success: false, message: "Entry not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "Entry deleted successfully" }), { status: 200 });
  } catch (error) {
    throw new CustomError("Error in deleting : " + error, 500);
  }
};