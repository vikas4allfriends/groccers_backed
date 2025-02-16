import { asyncHandler } from '../../../../../utils/asyncHandler'
import {createProductCompany} from '../../../../../controllers/ProductCategory/productCategory.controller';

export const POST = asyncHandler(createProductCompany)