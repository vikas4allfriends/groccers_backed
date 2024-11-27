import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import MeasuringUnit from '../../models/measuringUnit.models'; // Ensure correct path to the model
import { CustomError } from '../../utils/error';
import { type NextRequest } from 'next/server'
import ValidateIncomingDataWithZodSchema from '../../utils/ValidateIncomingDataWithZodSchema';
import { CreateMeasuringUnitSchema, UpdateMeasuringUnitSchema } from '../../zod_schemas/measuringUnitSchema';

// Create a new MeasuringUnit
export const createMeasuringUnit = async (req: Request) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }
    console.log('roleCheck==', roleCheck.user._id)
    try {
        const { name } = await req.json();
        const data = { name }
        await ValidateIncomingDataWithZodSchema(CreateMeasuringUnitSchema, data)

        const measuringUnit = new MeasuringUnit({
            Name: name,
            CreatedById: roleCheck.user._id,
            LastUpdatedById: roleCheck.user._id  // Set both to CreatedById initially
        });

        await measuringUnit.save();
        return new Response(JSON.stringify({ success: true, data: measuringUnit }))
    } catch (error) {
        throw new CustomError("Error creating measuring unit" + error, 500)
    }
};

// Update an existing MeasuringUnit by ID
export const updateMeasuringUnit = async (req: NextRequest, res: Response) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }
    try {
        const { measuringUnitId, Name, IsActive, IsDeleted } = await req.json();
        const data = {measuringUnitId, Name, IsActive, IsDeleted}
        console.log('roleCheck.user._id===', roleCheck.user._id, typeof(roleCheck.user._id.toString()))
        await ValidateIncomingDataWithZodSchema(UpdateMeasuringUnitSchema, data)
        const updatedMeasuringUnit = await MeasuringUnit.findByIdAndUpdate(
            measuringUnitId,
            {
                $set: { Name, IsActive, IsDeleted, LastUpdatedById: roleCheck.user._id.toString() }
            },
            { new: true, runValidators: true }  // Return updated doc and run validations
        );

        if (!updatedMeasuringUnit) {
            return new Response(JSON.stringify({ success: false, message: 'Measuring unit not found', statusCode: 500 }));
        }
        return new Response(JSON.stringify({ success: true, data: updatedMeasuringUnit, statusCode: 200 }));
    } catch (error) {
        throw new CustomError("Error in updating measuring unit " + error, 500)
    }
};

// // Get a MeasuringUnit by ID
export const getAllMeasuringUnits = async (req: Request, res: Response) => {
    const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);
    // If the middleware returns a Response object (e.g., error), return it immediately
    if (roleCheck instanceof Response) {
        return roleCheck;
    }

    try {
        const measuringUnits = await MeasuringUnit.aggregate([
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
        console.log('MeasuringUnit==', measuringUnits)
        return new Response(JSON.stringify({ success: true, data: measuringUnits[0] }))

    } catch (error) {
        throw new CustomError("Error fetching measuring unit " + error, 500);
    }
};

// // Delete a MeasuringUnit by ID
// export const deleteMeasuringUnit = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const deletedMeasuringUnit = await MeasuringUnit.findByIdAndDelete(id);

//         if (!deletedMeasuringUnit) {
//             return res.status(404).json({ success: false, message: 'Measuring unit not found' });
//         }

//         return res.status(200).json({ success: true, message: 'Measuring unit deleted successfully' });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Error deleting measuring unit', error });
//     }
// };
