import {z} from 'zod';

export const CreateProductSchema = z.object({
    ProductCategoryId: z.string(),
    Name: z.string(),
    Description: z.string().optional(),
    MeasuringUnitId: z.string(),
    Price: z.number(),
    Tags: z.string().array(),  // Array of strings
    // IsActive: z.boolean(),
    // IsDeleted: z.boolean(),
    CreatedById: z.string().optional(),  // Reference to User or relevant collection
    // LastUpdatedById:z.string().optional()
})

export const UpdateProductProductSchema = z.object({
    ProductCategoryId: z.string(),
    ProductImageUrl:z.string(),
    Name: z.string(),
    Description: z.string().optional(),
    MeasuringUnitId: z.string(),
    Price: z.number(),
    Tags: z.string().array(),  // Array of strings
    IsActive: z.boolean().optional(),
    IsDeleted: z.boolean().optional(),
    CreatedById: z.string().optional(),  // Reference to User or relevant collection
    LastUpdatedById:z.string()
})