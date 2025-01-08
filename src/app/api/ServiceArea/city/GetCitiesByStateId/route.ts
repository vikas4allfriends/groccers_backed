import {fetchCitiesByStateId} from '../../../../../controllers/location';
import { asyncHandler } from '../../../../../utils/asyncHandler';

export const GET = asyncHandler(fetchCitiesByStateId)