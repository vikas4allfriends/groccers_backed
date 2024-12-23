import { asyncHandler } from '../../../../utils/asyncHandler'
import {SearchServiceArea} from '../../../../controllers/ServiceArea/ServiceArea';

export const GET = asyncHandler(SearchServiceArea)