import { asyncHandler } from '../../../../utils/asyncHandler'
import {createProduct} from '../../../../controllers/Product/product.controller';

export const POST = asyncHandler(createProduct)