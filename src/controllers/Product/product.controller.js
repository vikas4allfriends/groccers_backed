import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import ValidateIncomingDataWithZodSchema from '../../utils/ValidateIncomingDataWithZodSchema';
import { CreateProductSchema, UpdateProductProductSchema } from '../../zod_schemas/productSchema';
import Product from '../../models/Product';
import { CustomError } from '../../utils/error';
// import { type NextRequest } from 'next/server'
import mongoose from 'mongoose';
import ProductCategory from "../../models/productCategory.models";
import ProductBatch from '../../models/ProductBatch';

export const createProduct = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  const { ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, ProductImageUrl, ProductCompanyId } = await req.json();
  const data = {
    ProductImageUrl,
    ProductCategoryId: new mongoose.Types.ObjectId(ProductCategoryId),
    ProductCompanyId: new mongoose.Types.ObjectId(ProductCompanyId),
    Name,
    Price,
    Tags,
    MeasuringUnitId: new mongoose.Types.ObjectId(MeasuringUnitId),
    Description,
    CreatedById: roleCheck.user._id
  };

  // console.log('user===', roleCheck)
  // If the middleware returns a Response object (e.g., error), return it immediately

  await ValidateIncomingDataWithZodSchema(CreateProductSchema, data)

  try {
    // const newProduct = new Product({
    //   ProductImageUrl, ProductCategoryId, Name, Price, Tags, 
    //   MeasuringUnitId, Description, CreatedById: roleCheck.user._id.toString(), 
    //   ProductCompanyId
    // })

    const newProduct = new Product(data)
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

export const SearchProducts2 = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

  if (roleCheck instanceof Response) {
    return roleCheck;
  }
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;

    // Search products by name or other query
    const searchRegex = new RegExp(query, 'i');
    const products = await Product.find({ Name: { $regex: searchRegex } })
      .skip((page - 1) * limit)
      .limit(limit);

    // console.log('products===', products)
    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No products found', products: [] }), { status: 200 });
    }

    // Map products to fetch batch data and include all product attributes
    const productData = await Promise.all(
      products.map(async (product) => {
        // Fetch all batches associated with the product
        const batches = await ProductBatch.find({ ProductId: product._id });

        // Calculate total quantity and average buying price from batches
        const totalQuantity = batches.reduce((sum, batch) => sum + batch.Quantity, 0);
        const averageBuyingPrice =
          batches.reduce((sum, batch) => sum + batch.BuyingPrice * batch.Quantity, 0) / totalQuantity || 0;

        return {
          _id: product._id,
          Name: product.Name,
          Description: product.Description,
          Tags: product.Tags || [],
          Price: product.Price,
          IsActive: product.IsActive,
          CreatedById: product.CreatedById,
          LastUpdatedById: product.LastUpdatedById,
          MeasuringUnitId: product.MeasuringUnitId,
          TotalQuantity: totalQuantity,
          AverageBuyingPrice: averageBuyingPrice.toFixed(2),
          Batches: batches.map(({ ExpiryDate, Quantity, BuyingPrice }) => ({
            ExpiryDate,
            Quantity,
            BuyingPrice,
          })),
        };
      })
    );

    return new Response(JSON.stringify({ success: true, products: productData }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};

export const SearchProducts3 = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    console.log('query--', query)
    // Search products by name
    const searchRegex = new RegExp(query, 'i');
    const products = await Product.find({ Name: { $regex: searchRegex } })
      .populate('ProductCompanyId')  // Fetch Product Company details
      .populate('ProductCategoryId') // Fetch Product Category details
      .populate('MeasuringUnitId')   // Fetch Measuring Unit details
      .skip((page - 1) * limit)
      .limit(limit);

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No products found', products: [] }), { status: 200 });
    }

    // Map products to include batch details
    const productData = await Promise.all(
      products.map(async (product) => {
        // Fetch all batches associated with the product
        const batches = await ProductBatch.find({ ProductId: product._id });

        // Calculate total quantity and average buying price from batches
        const totalQuantity = batches.reduce((sum, batch) => sum + batch.Quantity, 0);
        const averageBuyingPrice =
          batches.reduce((sum, batch) => sum + batch.BuyingPrice * batch.Quantity, 0) / totalQuantity || 0;

        return {
          _id: product._id,
          Name: product.Name,
          Description: product.Description,
          Tags: product.Tags || [],
          Price: product.Price,
          IsActive: product.IsActive,
          CreatedById: product.CreatedById,
          LastUpdatedById: product.LastUpdatedById,

          // Populated Data
          ProductCompany: product.ProductCompanyId,   // Company details
          ProductCategory: product.ProductCategoryId, // Category details
          MeasuringUnit: product.MeasuringUnitId,     // Measuring unit details

          TotalQuantity: totalQuantity,
          AverageBuyingPrice: averageBuyingPrice.toFixed(2),
          Batches: batches.map(({ ExpiryDate, Quantity, BuyingPrice }) => ({
            ExpiryDate,
            Quantity,
            BuyingPrice,
          })),
        };
      })
    );

    return new Response(JSON.stringify({ success: true, products: productData }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};

export const SearchProducts = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder', 'Admin'])(req);

  if (roleCheck instanceof Response) {
    return roleCheck;
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 10);
    const productCompanyId = url.searchParams.get('ProductCompanyId') || null;
    const ProductCategoryId = url.searchParams.get('ProductCategoryId') || null;
    const sortBy = url.searchParams.get('sortBy') || 'Price'; // Default sorting by Price
    const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? 1 : -1; // Default ascending

    console.log('Search Query:', query, '| Page:', page, '| Limit:', limit, '| SortBy:', sortBy, '| SortOrder:', sortOrder);
    
    // Build dynamic filters
    const filters = {};
    if (query) filters.Name = { $regex: new RegExp(query, 'i') };
    if (productCompanyId) filters.ProductCompanyId = productCompanyId;
    if (ProductCategoryId) filters.ProductCategoryId = ProductCategoryId;

    // Fetch all matching products (WITHOUT pagination yet)
    const products = await Product.find(filters)
      .populate('ProductCompanyId', 'Name')
      .populate('ProductCategoryId', 'Name')
      .populate('MeasuringUnitId')
      .lean();

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No products found', products: [] }), { status: 200 });
    }

    // Fetch batches in a single query
    const productIds = products.map(p => p._id);
    const batches = await ProductBatch.find({ ProductId: { $in: productIds } }).lean();

    // Create a map of batches by product ID
    const batchMap = batches.reduce((acc, batch) => {
      if (!acc[batch.ProductId]) acc[batch.ProductId] = [];
      acc[batch.ProductId].push(batch);
      return acc;
    }, {});

    // Calculate total stock per product
    const stockMap = batches.reduce((acc, batch) => {
      acc[batch.ProductId] = (acc[batch.ProductId] || 0) + batch.Quantity;
      return acc;
    }, {});

    // Map products with batch details
    let productData = products.map(product => {
      const productBatches = batchMap[product._id] || [];
      const totalQuantity = stockMap[product._id] || 0;

      // Calculate average buying price
      const averageBuyingPrice =
        totalQuantity > 0
          ? (productBatches.reduce((sum, batch) => sum + batch.BuyingPrice * batch.Quantity, 0) / totalQuantity)
          : 0;

      return {
        _id: product._id,
        Name: product.Name,
        Description: product.Description,
        Tags: product.Tags || [],
        Price: product.Price,
        IsActive: product.IsActive,
        CreatedById: product.CreatedById,
        LastUpdatedById: product.LastUpdatedById,

        // Populated Data
        ProductCompany: product.ProductCompanyId,
        ProductCategory: product.ProductCategoryId,
        MeasuringUnit: product.MeasuringUnitId,

        // Stock details
        TotalStockQuantity: totalQuantity,
        AverageBuyingPrice: averageBuyingPrice.toFixed(2),

        // Batch details
        Batches: productBatches.map(({ ExpiryDate, Quantity, BuyingPrice }) => ({
          ExpiryDate,
          Quantity,
          BuyingPrice,
        })),
      };
    });

    // **Sorting logic BEFORE pagination**
    productData.sort((a, b) => {
      if (sortBy === 'Price') return (a.Price - b.Price) * sortOrder;
      if (sortBy === 'BuyingPrice') return (a.AverageBuyingPrice - b.AverageBuyingPrice) * sortOrder;
      if (sortBy === 'Quantity') return (a.TotalStockQuantity - b.TotalStockQuantity) * sortOrder;
      return 0;
    });

    // **Apply pagination AFTER sorting**
    const totalProducts = productData.length;
    const totalPages = Math.ceil(totalProducts / limit);
    productData = productData.slice((page - 1) * limit, page * limit);

    return new Response(JSON.stringify({
      success: true,
      products: productData,
      pagination: { totalPages, currentPage: page, totalItems: totalProducts }
    }), { status: 200 });

  } catch (error) {
    console.error("Error in SearchProducts:", error.message, "\nRequest URL:", req.url);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};

export const GetProductById = async (req) => {
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

export const updateProduct = async (req) => {
  const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
  // If the middleware returns a Response object (e.g., error), return it immediately
  if (roleCheck instanceof Response) {
    return roleCheck;
  }
  const { ProductId, ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, ProductImageUrl } = await req.json();
  // const searchParams = req.nextUrl.searchParams
  // const categoryId = searchParams.get('categoryId')

  const updateData = { ProductId, ProductCategoryId, Name, Price, Tags, MeasuringUnitId, Description, ProductImageUrl, LastUpdatedById: roleCheck.user._id.toString() }
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

    return new Response(JSON.stringify({ success: true, data: updatedProduct, statusCode: 200 }));
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

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

// Query the ProductBatch collection for products expiring in a given timeframe

// const getExpiringProducts = async (req, res) => {
//   const { startDate, endDate } = req.query;

//   try {
//     const expiringBatches = await ProductBatch.find({
//       ExpiryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
//     }).populate('ProductId');

//     res.status(200).json({ success: true, data: expiringBatches });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to fetch expiring products.' });
//   }
// };


