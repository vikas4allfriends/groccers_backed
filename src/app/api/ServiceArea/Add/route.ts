import { asyncHandler } from '../../../../utils/asyncHandler'
import {addServiceArea} from '../../../../controllers/ServiceArea/ServiceArea';

export const POST = asyncHandler(addServiceArea)