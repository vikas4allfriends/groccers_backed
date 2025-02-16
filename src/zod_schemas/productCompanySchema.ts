import { z } from "zod";
import mongoose from "mongoose";

export const CreateProductCompanySchema = z.object({
    Name: z.string(),
    Description:z.string().optional().nullable(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    CreatedById: z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for CreatedById"
    }),
    LastUpdatedById: z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for LastUpdatedById"
    })
})

export const UpdateProductCompanySchema = z.object({
    Name: z.string(),
    Description:z.string().optional().nullable(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    CreatedById: z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for CreatedById"
    }),
    LastUpdatedById: z.instanceof(mongoose.Types.ObjectId, {
        message: "Invalid ObjectId for LastUpdatedById"
    })
})