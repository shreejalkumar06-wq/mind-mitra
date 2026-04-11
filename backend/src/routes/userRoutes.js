import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createAnonymousUser,
  getUserStreak,
  getUserSummary,
  getUserWellness,
} from '../controllers/userController.js';

const router = Router();

router.post('/anonymous', asyncHandler(createAnonymousUser));
router.get('/:userId/summary', asyncHandler(getUserSummary));
router.get('/:userId/streak', asyncHandler(getUserStreak));
router.get('/:userId/wellness', asyncHandler(getUserWellness));

export default router;
