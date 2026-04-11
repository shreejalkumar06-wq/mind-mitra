import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  getTodayMood,
  listMoodEntries,
  upsertMoodEntry,
} from '../controllers/moodController.js';

const router = Router({ mergeParams: true });

router.get('/', asyncHandler(listMoodEntries));
router.get('/today', asyncHandler(getTodayMood));
router.post('/', asyncHandler(upsertMoodEntry));

export default router;
