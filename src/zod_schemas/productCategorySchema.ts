import {z} from 'zod';

export const CreateProductCategorySchema = z.object({
    Name: z.string(),
    Description:z.string().optional().nullable(),
    CategoryImageUrl: z.string().optional().nullable(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})

export const UpdateProductCategorySchema = z.object({
    Name: z.string(),
    Description:z.string().optional().nullable(),
    CategoryImageUrl: z.string().nullable().optional(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})