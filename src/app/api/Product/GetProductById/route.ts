import {asyncHandler} from '../../../../utils/asyncHandler';
import {GetCategoryById} from '../../../../controllers/ProductCategory/productCategory.controller';

export const GET = asyncHandler(GetCategoryById)