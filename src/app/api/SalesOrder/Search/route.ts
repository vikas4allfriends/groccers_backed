import { asyncHandler } from '../../../../utils/asyncHandler'
import {getAllOrders} from '../../../../controllers/SalesOrder';

export const GET = asyncHandler(getAllOrders)