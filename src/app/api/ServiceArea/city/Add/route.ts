import { asyncHandler } from '../../../../../utils/asyncHandler'
import {addCity} from '../../../../../controllers/ServiceArea/AddCity';

export const POST = asyncHandler(addCity)