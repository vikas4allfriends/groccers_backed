import { asyncHandler } from '../../../utils/asyncHandler'
import {checkoutWebCart} from '../../../controllers/Checkout/checkout.controllers';

export const POST = asyncHandler(checkoutWebCart)