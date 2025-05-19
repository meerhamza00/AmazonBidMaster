import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = Router();

// Chat routes
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:id', chatController.getConversation);
router.post('/conversations', chatController.createConversation);
router.post('/messages/:id', chatController.sendMessage);
router.post('/messages', chatController.sendMessage); // Keep for backward compatibility
router.delete('/conversations/:id', chatController.deleteConversation);
router.get('/models', chatController.getModels);
router.post('/conversations/:id/rename', chatController.renameConversation);

export default router;