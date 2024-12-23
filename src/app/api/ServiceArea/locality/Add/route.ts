import { asyncHandler } from '../../../../../utils/asyncHandler'
import {addLocality} from '../../../../../controllers/ServiceArea/locality';

export const POST = asyncHandler(addLocality)