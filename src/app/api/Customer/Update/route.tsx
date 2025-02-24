import { asyncHandler } from '../../../../utils/asyncHandler'
import {updateShop} from '../../../../controllers/Shop';

export const POST = asyncHandler(updateShop)