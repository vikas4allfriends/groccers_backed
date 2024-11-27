import {createRole} from '../../../../controllers/Role/role.controller';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(createRole);

