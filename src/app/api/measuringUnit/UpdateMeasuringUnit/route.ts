import { asyncHandler } from '../../../../utils/asyncHandler'
import {updateMeasuringUnit} from '../../../../controllers/MeasuringUnit/measuringUnit.controllers';

export const POST = asyncHandler(updateMeasuringUnit)