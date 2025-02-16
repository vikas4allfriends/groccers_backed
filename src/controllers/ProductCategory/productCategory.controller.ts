import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import ValidateIncomingDataWithZodSchema from '../../utils/ValidateIncomingDataWithZodSchema';
import { CreateProductCategorySchema, UpdateProductCategorySchema } from '../../zod_schemas/productCategorySchema';
import { CreateProductCompanySchema } from '../../zod_schemas/productCompanySchema';
import ProductCategory from '../../models/ProductCategory';
import ProductCompany from '../../models/ProductCompany';
import { CustomError } from '../../utils/error';
import { type NextRequest } from 'next/server'
import mongoose from 'mongoose';

export const createProductCategory = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    const { Name, Description, CategoryImageUrl } = await req.json();
    const data = { Name, CategoryImageUrl, Description };

    // console.log('user===', roleCheck)
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    await ValidateIncomingDataWithZodSchema(CreateProductCategorySchema, data)

    try {
        const newProductCategory = new ProductCategory({
            Name,
            Description,
            CategoryImageUrl
        })

        const savedCategory = await newProductCategory.save();
        return new Response(
            JSON.stringify({ success: true, message: "Product category created successfully", data: savedCategory, statusCode: 200 }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.log(error)
        throw new CustomError("Error saving product category" + error, 500)
    }

}

export const GetCategories = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    try {
        const categories = await ProductCategory.aggregate([
            {
                $match: { IsActive: true }
            },
            {
                $sort: { Name: 1 } // Sort in ascending order by 'name'
            },
            {
                $facet: {
                    data: [ // Retrieve sorted data
                        { $match: {} }, // Match all documents
                        { $project: { _id: 1, Name: 1 } } // Project only _id and name fields
                    ],
                    totalRecords: [ // Retrieve total record count
                        { $count: 'total' }
                    ]
                }
            },
            {
                $project: {
                    data: 1,
                    totalRecords: { $arrayElemAt: ['$totalRecords.total', 0] } // Extract total count
                }
            }
        ]).exec();

        // return categories;
        console.log('categories==', categories)
        return new Response(JSON.stringify({ success: true, data: categories[0] }))

    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new CustomError("Error", 500);
    }
}

export const GetCategoryById = async (req: NextRequest) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }
    const searchParams = req.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const objectId = new mongoose.Types.ObjectId(categoryId);
    console.log('first==', categoryId)
    try {
        const categories = await ProductCategory.aggregate([
            { $match: { _id: objectId } }, // Match all documents
            {
                $project: {
                    _id: 1,
                    Name: 1,
                }
            }
        ]);

        // return categories;
        console.log('categories==', categories)
        return new Response(JSON.stringify({ success: true, data: categories }))

    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new CustomError("Error" + error, 500);
    }
}

export const updateProductCategory = async (req: NextRequest) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    if (roleCheck instanceof Response) {
        return roleCheck;
    }
    const { Name, CategoryImageUrl, categoryId } = await req.json();
    // const searchParams = req.nextUrl.searchParams
    // const categoryId = searchParams.get('categoryId')
    console.log("userId=== =", roleCheck.user._id, typeof (roleCheck.user._id))
    const updateData = { Name, CategoryImageUrl, IsDeleted: false, IsActive: true }
    await ValidateIncomingDataWithZodSchema(UpdateProductCategorySchema, { ...updateData, categoryId, LastUpdatedById: roleCheck.user._id })

    try {
        const objectId = new mongoose.Types.ObjectId(categoryId); // Convert string ID to ObjectId

        // Find the category by ID and update it with the provided data
        const updatedCategory = await ProductCategory.findByIdAndUpdate(
            objectId,
            { $set: updateData }, // Use $set to only update specified fields
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        if (!updatedCategory) {
            throw new Error('Category not found');
        }

        return new Response(JSON.stringify({ success: true, data: updatedCategory, statusCode: 200 }));
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export const createProductCompany = async (req: NextRequest) => {
    try {
        // Check User Role and Permissions
        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

        // If permission check fails, return the response
        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const { Name, Description } = await req.json();
        const userId = roleCheck?.user?._id;

        // Validate data before proceeding
        const data = { Name, Description, CreatedById: userId, LastUpdatedById: userId };
        await ValidateIncomingDataWithZodSchema(CreateProductCompanySchema, data);

        // Save Product Company
        const newProductCompany = new ProductCompany(data);
        const savedCompany = await newProductCompany.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Product company created successfully",
                data: savedCompany,
                statusCode: 200
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

    } catch (error) {
        console.error("Error creating product company:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error saving product category", error: error.message, statusCode: 500 }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

export const GetProductCompanies = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    try {
        const ProductCompanies = await ProductCompany.aggregate([
            {
                $match: { IsActive: true }
            },
            {
                $sort: { Name: 1 } // Sort in ascending order by 'name'
            },
            {
                $facet: {
                    data: [ // Retrieve sorted data
                        { $match: {} }, // Match all documents
                        { $project: { _id: 1, Name: 1 } } // Project only _id and name fields
                    ],
                    totalRecords: [ // Retrieve total record count
                        { $count: 'total' }
                    ]
                }
            },
            {
                $project: {
                    data: 1,
                    totalRecords: { $arrayElemAt: ['$totalRecords.total', 0] } // Extract total count
                }
            }
        ]).exec();

        // return categories;
        console.log('categories==', ProductCompanies)
        return new Response(JSON.stringify({ success: true, data: ProductCompanies[0] }))

    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new CustomError("Error", 500);
    }
}
