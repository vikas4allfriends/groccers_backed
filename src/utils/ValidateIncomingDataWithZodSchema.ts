import { CustomError } from "./error";
import {z} from 'zod';

const ValidateIncomingDataWithZodSchema = async (validatingSchema:any,dataToValidate:any) => {
    try {
      await validatingSchema.parseAsync(dataToValidate);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Extract and throw the validation error messages
        const errorMessages = err.errors.map((error) => ({
          field: error.path[0],
          message: error.message,
        }));
        throw new CustomError(JSON.stringify(errorMessages), 400);
      } else {
        throw new CustomError("Unexpected validation error", 500);
      }
    }
  };

export default ValidateIncomingDataWithZodSchema;