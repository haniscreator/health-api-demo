import { Request, Response, NextFunction } from 'express';
import { icdAuthService } from '../services/icdAuthService';

export const getIcdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenDetails = await icdAuthService.getTokenDetails();
    res.status(200).json(tokenDetails);
  } catch (error) {
    next(error);
  }
};
