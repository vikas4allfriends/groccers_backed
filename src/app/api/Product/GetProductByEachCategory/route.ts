import {asyncHandler} from '../../../../utils/asyncHandler';
import {getProductsByEachCategory} from '../../../../controllers/Product/product.controller';

export const GET = asyncHandler(getProductsByEachCategory)