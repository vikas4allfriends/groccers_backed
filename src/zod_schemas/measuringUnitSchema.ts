import {z} from 'zod';

export const CreateMeasuringUnitSchema = z.object({
    name: z.string(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})

export const UpdateMeasuringUnitSchema = z.object({
    measuringUnitId:z.string(),
    Name: z.string(),
    IsDeleted:z.boolean().optional(),
    IsActive:z.boolean().optional(),
    LastUpdatedById:z.string().optional()
})