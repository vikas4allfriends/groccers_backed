import { asyncHandler } from '../../../../utils/asyncHandler'
import {updateProduct} from '../../../../controllers/Product/product.controller';

export const POST = asyncHandler(updateProduct)