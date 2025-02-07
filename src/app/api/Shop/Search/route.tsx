import { asyncHandler } from '../../../../utils/asyncHandler'
import {searchShop} from '../../../../controllers/Shop';

export const GET = asyncHandler(searchShop)