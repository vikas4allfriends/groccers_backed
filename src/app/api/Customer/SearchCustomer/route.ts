import {asyncHandler} from '../../../../utils/asyncHandler';
import {SearchCustomers} from '../../../../controllers/Customer';

export const GET = asyncHandler(SearchCustomers)