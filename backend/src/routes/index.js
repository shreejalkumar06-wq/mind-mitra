import { Router } from 'express';
import userRoutes from './userRoutes.js';
import moodRoutes from './moodRoutes.js';
import journalRoutes from './journalRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'mindmitra-backend',
    timestamp: new Date().toISOString(),
  });
});

router.use('/users', userRoutes);
router.use('/users/:userId/moods', moodRoutes);
router.use('/users/:userId/journal', journalRoutes);
router.use('/chat', chatRoutes);

export default router;
