import { asyncHandler } from '../../../../utils/asyncHandler'
import {update} from '../../../../controllers/Permission';

export const POST = asyncHandler(update);