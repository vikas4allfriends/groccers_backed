
import {SignUp} from '../../../../controllers/Auth/Auth.controller';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(SignUp);
