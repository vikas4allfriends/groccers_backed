import {asyncHandler} from '../../../../../utils/asyncHandler';
import {GetProductCompanies} from '../../../../../controllers/ProductCategory/productCategory.controller';

export const GET = asyncHandler(GetProductCompanies)