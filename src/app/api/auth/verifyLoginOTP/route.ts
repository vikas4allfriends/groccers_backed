
import {verifyOtp} from '../../../../controllers/Auth/Otp.controller';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(verifyOtp);
