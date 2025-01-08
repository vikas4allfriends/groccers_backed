import {GetAllAddress} from '../../../../controllers/UserAddress';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const GET = asyncHandler(GetAllAddress)