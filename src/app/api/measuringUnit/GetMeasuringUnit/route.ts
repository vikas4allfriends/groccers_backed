import {asyncHandler} from '../../../../utils/asyncHandler';
import {GetCategories} from '../../../../controllers/ProductCategory/productCategory.controller';

export const GET = asyncHandler(GetCategories)