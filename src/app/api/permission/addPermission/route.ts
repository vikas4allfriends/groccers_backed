import {Permission} from '../../../../controllers/Permission/permission.controller';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(Permission);