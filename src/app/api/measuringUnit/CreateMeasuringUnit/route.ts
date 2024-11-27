import { asyncHandler } from '../../../../utils/asyncHandler'
import {createMeasuringUnit} from '../../../../controllers/MeasuringUnit/measuringUnit.controllers';

export const POST = asyncHandler(createMeasuringUnit)