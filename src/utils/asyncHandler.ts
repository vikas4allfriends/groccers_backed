import { NextRequest, NextResponse } from 'next/server';

export const asyncHandler = (fn: (req: NextRequest,...args:any) => Promise<Response>) => 
  async (req: NextRequest, ...args:any): Promise<Response> => {
    try {
      return await fn(req, ...args);
    } catch (error: any) {

      // Create an error response using NextResponse
      return Response.json(
        {
          success: false, 
          message: error.message || 'Internal Server Error', 
        },
        { status: error.statusCode || 500 }
      );
    }
};
