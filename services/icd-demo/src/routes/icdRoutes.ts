import { Router } from 'express';
import { searchIcd, getEntityDetails } from '../controllers/icdController';

const router = Router();

// GET /api/icd/search?q=...
router.get('/search', searchIcd);

// GET /api/icd/entity/:id
router.get('/entity/:id', getEntityDetails);

export default router;
