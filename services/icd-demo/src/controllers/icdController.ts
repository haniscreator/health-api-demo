import { Request, Response, NextFunction } from 'express';
import { icdService } from '../services/icdService';
import { AppError } from '../middleware/errorHandler';

export const searchIcd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query.q;
    
    if (typeof query !== 'string' || query.trim() === '') {
      const error: AppError = new Error('Query parameter "q" must be a non-empty string.');
      error.statusCode = 400;
      throw error;
    }

    const results = await icdService.searchDiseases(query);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const getEntityDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || id.trim() === '') {
      const error: AppError = new Error('Entity ID is required.');
      error.statusCode = 400;
      throw error;
    }

    const details = await icdService.getEntityDetails(id);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
};
