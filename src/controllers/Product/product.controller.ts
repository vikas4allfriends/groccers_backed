import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import ValidateIncomingDataWithZodSchema from '../../utils/ValidateIncomingDataWithZodSchema';
import { CreateProductSchema, UpdateProductProductSchema } from '../../zod_schemas/productSchema';
import Product from '../../models/product.models';
import { CustomError } from '../../utils/error';
import { type NextRequest } from 'next/server'
import mongoose from 'mongoose';

export const createProduct = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    const { ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, ProductImageUrl } = await req.json();
    const data = { ProductImageUrl, ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, CreatedById: roleCheck.user._id.toString()};

    // console.log('user===', roleCheck)
    // If the middleware returns a Response object (e.g., error), return it immediately

    await ValidateIncomingDataWithZodSchema(CreateProductSchema, data)

    try {
        const newProduct = new Product({
            ProductImageUrl, ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, CreatedById: roleCheck.user._id.toString()
        })

        const savedProduct = await newProduct.save();
        return new Response(
            JSON.stringify({ success: true, message: "Product created successfully", data: savedProduct, statusCode: 200 }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.log(error)
        throw new CustomError("Error saving product" + error, 500)
    }

}

export const SearchProducts = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    try {
        const products = await Product.aggregate([
            {
                $match: {IsActive:true}
            },
            {
                $sort: { name: 1 } // Sort in ascending order by 'name'
            },
            {
                $lookup: {
                    from: 'productcategories',
                    localField: 'ProductCategoryId',
                    foreignField: '_id',
                    as: 'Productcategory',
                }
            },
            {
                $facet: {
                    data: [ // Retrieve sorted data
                        { $match: {} }, // Match all documents
                        { $project: { _id: 1, 
                            Name: 1,
                            ProductCategoryId: 1, 
                            Price:1, 
                            Tags:1, 
                            MeasuringUnitId:1, 
                            Description:1, 
                            ProductImageUrl:1,
                            Productcategory:1
                        } } // Project only _id and name fields
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
        console.log('categories==', products)
        return new Response(JSON.stringify({ success: true, data: products[0] }))

    } catch (error) {
        console.error('Error fetching products:', error);
        throw new CustomError("Error", 500);
    }
}

export const GetProductById = async (req: NextRequest) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }
    const searchParams = req.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const objectId = new mongoose.Types.ObjectId(categoryId);
    console.log('first==', categoryId)
    try {
        const categories = await Product.aggregate([
            { $match: { _id: objectId } }, // Match all documents
            {
                $project: {
                    _id: 1,
                    name: 1,
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

export const updateProduct = async (req: NextRequest) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }
    const { ProductId,ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, ProductImageUrl } = await req.json();
    // const searchParams = req.nextUrl.searchParams
    // const categoryId = searchParams.get('categoryId')

    const updateData = { ProductId,ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, ProductImageUrl, LastUpdatedById: roleCheck.user._id.toString()}
    try {
        await ValidateIncomingDataWithZodSchema(UpdateProductProductSchema, updateData)
        const objectId = new mongoose.Types.ObjectId(ProductId); // Convert string ID to ObjectId

        // Find the category by ID and update it with the provided data
        const updatedProduct = await Product.findByIdAndUpdate(
            objectId,
            { $set: updateData }, // Use $set to only update specified fields
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        if (!updatedProduct) {
            throw new Error('Product not found');
        }

        return new Response(JSON.stringify({success:true, data:updatedProduct, statusCode:200}));
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

import ProductCategory from "../../models/productCategory.models";

export const getProductsByEachCategory = async (req) => {
  try {
    const categoriesWithProducts = await ProductCategory.aggregate([
      { $match: { IsActive: true, IsDeleted: false } }, // Step 1: Match active categories
      {
        $lookup: {
          from: "products", // Step 2: Lookup products
          localField: "_id",
          foreignField: "ProductCategoryId",
          as: "products",
          pipeline: [
            { $match: { IsActive: true, IsDeleted: false } },
            { $limit: 10 },
            {
              $lookup: { // Join with MeasuringUnit
                from: "measuringunits",
                localField: "MeasuringUnitId",
                foreignField: "_id",
                as: "measuringUnit",
              },
            },
            { $unwind: { path: "$measuringUnit", preserveNullAndEmptyArrays: true } },
            {
              $lookup: { // Join with ProductImages
                from: "productimages",
                localField: "_id",
                foreignField: "ProductId",
                as: "productImages",
              },
            },
          ],
        },
      },
      {
        $match: { "products.0": { $exists: true } }, // Step 3: Remove categories without products
      },
      {
        $project: { // Step 4: Project the required fields
          productCategory: {
            _id: "$_id",
            name: "$name",
            categoryImage: "$CategoryImageUrl",
          },
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                _id: "$$product._id",
                name: "$$product.Name",
                description: "$$product.Description",
                price: "$$product.Price",
                tags: { $arrayElemAt: ["$$product.Tags", 0] },
                productCategory: {
                  _id: "$_id",
                  name: "$name",
                  categoryImage: "$CategoryImageUrl",
                },
                measuringUnit: {
                  _id: "$$product.measuringUnit._id",
                  name: "$$product.measuringUnit.Name",
                },
                productImages: {
                  $map: {
                    input: "$$product.productImages",
                    as: "image",
                    in: {
                      _id: "$$image._id",
                      productId: "$$image.ProductId",
                      imageUrl: "$$image.imageUrl",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        data: categoriesWithProducts,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching products by category",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

