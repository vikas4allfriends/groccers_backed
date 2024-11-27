import {asyncHandler} from '../../../../utils/asyncHandler';
import {getAllMeasuringUnits} from '../../../../controllers/MeasuringUnit/measuringUnit.controllers';

export const GET = asyncHandler(getAllMeasuringUnits)