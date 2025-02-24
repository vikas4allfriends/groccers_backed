import { asyncHandler } from '../../../../utils/asyncHandler'
import {deleteMeasuringUnit} from '../../../../controllers/MeasuringUnit/measuringUnit.controllers';

export const POST = asyncHandler(deleteMeasuringUnit)