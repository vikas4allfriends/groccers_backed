import {z} from 'zod';

export const CreateProductCategorySchema = z.object({
    name: z.string(),
    CategoryImageUrl: z.string().optional(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})

export const UpdateProductCategorySchema = z.object({
    name: z.string(),
    CategoryImageUrl: z.string().nullable().optional(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})