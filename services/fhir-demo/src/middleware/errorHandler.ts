import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  
  // Log detailed diagnostic information securely for developers
  console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode}`);
  console.error(err.stack || err.message);

  // Send generic error message to user, keeping logs safe from sensitive data leaks
  const message = statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : err.message;
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { details: err.stack } : {})
  });
};
