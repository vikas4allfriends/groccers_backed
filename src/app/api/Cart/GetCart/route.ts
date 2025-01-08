import {getCart} from '../../../../controllers/Cart/cart.controllers';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const GET = asyncHandler(getCart)