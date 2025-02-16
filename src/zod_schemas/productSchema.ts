import { z } from 'zod';
import mongoose from "mongoose";

export const CreateProductSchema = z.object({
    Name: z.string(),
    Price: z.number(),
    Tags: z.string().array(),  // Array of strings
    Description: z.string().optional(),
    ProductCategoryId:  z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for CreatedById"
    }),
    ProductCompanyId: z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for CreatedById"
    }),
    MeasuringUnitId:  z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for CreatedById"
    }),
    CreatedById:  z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for CreatedById"
    }).optional(),  // Reference to User or relevant collection
})

export const UpdateProductProductSchema = z.object({
    ProductCategoryId: z.string(),
    ProductImageUrl: z.string(),
    Name: z.string(),
    Description: z.string().optional(),
    MeasuringUnitId: z.string(),
    Price: z.number(),
    Tags: z.string().array(),  // Array of strings
    IsActive: z.boolean().optional(),
    IsDeleted: z.boolean().optional(),
    CreatedById: z.string().optional(),  // Reference to User or relevant collection
    LastUpdatedById: z.string()
})