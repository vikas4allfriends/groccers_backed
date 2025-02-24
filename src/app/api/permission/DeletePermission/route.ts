import { asyncHandler } from '../../../../utils/asyncHandler'
import {DeleteById} from '../../../../controllers/Permission';

export const POST = asyncHandler(DeleteById)