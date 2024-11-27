import { asyncHandler } from '../../../../utils/asyncHandler'
import {createProductCategory} from '../../../../controllers/ProductCategory/productCategory.controller';

export const POST = asyncHandler(createProductCategory)