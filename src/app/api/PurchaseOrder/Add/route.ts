import { asyncHandler } from '../../../../utils/asyncHandler'
import {PurchaseItems} from '../../../../controllers/PurchaseOrder';

export const POST = asyncHandler(PurchaseItems)