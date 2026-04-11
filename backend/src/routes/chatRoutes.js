import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { listChatRooms, listRoomMessages } from '../controllers/chatController.js';

const router = Router();

router.get('/rooms', asyncHandler(listChatRooms));
router.get('/rooms/:roomId/messages', asyncHandler(listRoomMessages));

export default router;
