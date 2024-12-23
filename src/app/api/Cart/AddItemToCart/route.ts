import {addItemToCart} from '../../../../controllers/Cart/cart.controllers';
import { asyncHandler } from '../../../../utils/asyncHandler';

export const POST = asyncHandler(addItemToCart)