import {AddPermission} from '../../../../controllers/Permission';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(AddPermission);