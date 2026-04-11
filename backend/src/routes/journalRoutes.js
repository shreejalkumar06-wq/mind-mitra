import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntry,
  listJournalEntries,
} from '../controllers/journalController.js';

const router = Router({ mergeParams: true });

router.get('/', asyncHandler(listJournalEntries));
router.get('/:entryId', asyncHandler(getJournalEntry));
router.post('/', asyncHandler(createJournalEntry));
router.delete('/:entryId', asyncHandler(deleteJournalEntry));

export default router;
