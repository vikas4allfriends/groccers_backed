import {asyncHandler} from '../../../utils/asyncHandler';
import {checkoutCart} from '../../../controllers/Checkout/checkout.controllers';

export const POST = asyncHandler(checkoutCart);