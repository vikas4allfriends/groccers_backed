import { asyncHandler } from '../../../../utils/asyncHandler'
import {updateProductCategory} from '../../../../controllers/ProductCategory/productCategory.controller';

export const POST = asyncHandler(updateProductCategory)