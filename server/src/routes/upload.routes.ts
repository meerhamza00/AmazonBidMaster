import { Router } from 'express';
import { campaignController } from '../controllers/campaign.controller';

const router = Router();

// CSV upload route
router.post('/', campaignController.uploadCsv);

export default router;