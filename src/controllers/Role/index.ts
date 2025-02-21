import dbConnect from '../../lib/dbConnect';
import Roles from '../../models/Role';
import { CustomError } from '../../utils/error';
import {checkUserRoleAndPermission} from '../../middlewares/checkUserRoleAndPermission';

export const createRole = async(req:Request) =>{
    dbConnect()
        const { permissions, name } = await req.json();
        
        if(!permissions || !name) {
            console.log("role permissions and role name are required fields")
            throw new CustomError("role permissions and role name are required fields", 400)
        }

        const newRole = new Roles({
            name,
            permissions,
        });

        await newRole.save();
        return new Response(JSON.stringify({message:'Role created successfully', statusCode:200,success:true}))

}

export const SearchRoles = async (req:Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
  
    if (roleCheck instanceof Response) {
      return roleCheck;
    }
  
    try {
      const url = new URL(req.url);
      const query = url.searchParams.get('q') || '';
      const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
      const limit = Math.max(1, Number(url.searchParams.get('limit')) || 10);
      const RoleId = url.searchParams.get('RoleId') || null;
      const sortBy = url.searchParams.get('sortBy') || 'Price'; // Default sorting by Price
      const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? 1 : -1; // Default ascending
  
      console.log('Search Query:', query, '| Page:', page, '| Limit:', limit, '| SortBy:', sortBy, '| SortOrder:', sortOrder);
  
      // Build dynamic filters
      const filters = {};
      if (query) filters.name = { $regex: new RegExp(query, 'i') };
      if (RoleId) filters._id = RoleId;
  
      // Fetch all matching products (WITHOUT pagination yet)
      const RolesList = await Roles.find(filters).lean();
  

  
  
      // **Sorting logic BEFORE pagination**
      const SortedRolesList = RolesList.sort((a, b) => {
        if (sortBy === 'Name') return (a.name - b.name) * sortOrder;
        if (sortBy === 'BuyingPrice') return (a.AverageBuyingPrice - b.AverageBuyingPrice) * sortOrder;
        if (sortBy === 'Quantity') return (a.TotalStockQuantity - b.TotalStockQuantity) * sortOrder;
        return 0;
      });
  
      // **Apply pagination AFTER sorting**
      const totalRoles = SortedRolesList.length;
      const totalPages = Math.ceil(totalRoles / limit);
      const updatedRolesList = SortedRolesList.slice((page - 1) * limit, page * limit);
  
      return new Response(JSON.stringify({
        success: true,
        roles: updatedRolesList,
        pagination: { totalPages, currentPage: page, totalItems: totalRoles }
      }), { status: 200 });
  
    } catch (error) {
      console.error("Error in Roles:", error.message, "\nRequest URL:", req.url);
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
  };