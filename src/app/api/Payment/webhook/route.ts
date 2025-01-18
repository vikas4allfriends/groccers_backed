import { asyncHandler } from '../../../../utils/asyncHandler'
import {razorpayWebhook} from '../../../../controllers/Webhook';

export const POST = asyncHandler(razorpayWebhook);