import {asyncHandler} from '../../../../utils/asyncHandler';
import {SearchProducts} from '../../../../controllers/Product/product.controller';

export const GET = asyncHandler(SearchProducts)