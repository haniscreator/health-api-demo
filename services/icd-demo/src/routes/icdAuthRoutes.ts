import { Router } from 'express';
import { getIcdToken } from '../controllers/icdAuthController';

const router = Router();

// GET /api/icd/token
router.get('/token', getIcdToken);

export default router;
