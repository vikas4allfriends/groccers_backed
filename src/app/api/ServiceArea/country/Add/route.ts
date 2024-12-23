import { asyncHandler } from '../../../../../utils/asyncHandler'
import {addCountry} from '../../../../../controllers/ServiceArea/AddCountry';

console.log('first===')
export const POST = asyncHandler(addCountry)