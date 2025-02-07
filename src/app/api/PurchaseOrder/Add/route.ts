import { asyncHandler } from '../../../../utils/asyncHandler'
import {AddPurchaseOrder} from '../../../../controllers/PurchaseOrder';

export const POST = asyncHandler(AddPurchaseOrder)