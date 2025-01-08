import {AddAddress} from '../../../../controllers/UserAddress';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(AddAddress)