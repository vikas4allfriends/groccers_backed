import { asyncHandler } from '../../../../../utils/asyncHandler'
import {addState} from '../../../../../controllers/ServiceArea/AddState';

export const POST = asyncHandler(addState)