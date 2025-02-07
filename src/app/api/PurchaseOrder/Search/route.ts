import { asyncHandler } from '../../../../utils/asyncHandler'
import {getAllPurchaseOrders} from '../../../../controllers/PurchaseOrder';

export const GET = asyncHandler(getAllPurchaseOrders)