import {createRole} from '../../../../controllers/Role';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(createRole);

