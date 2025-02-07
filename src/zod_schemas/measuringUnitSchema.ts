import {z} from 'zod';

export const CreateMeasuringUnitSchema = z.object({
    Name: z.string(),
    Description:z.string().optional(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})

export const UpdateMeasuringUnitSchema = z.object({
    measuringUnitId:z.string(),
    Name: z.string(),
    Description:z.string().optional(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})