import { asyncHandler } from '../../../../utils/asyncHandler'
import {createShop} from '../../../../controllers/Shop';

export const POST = asyncHandler(createShop)