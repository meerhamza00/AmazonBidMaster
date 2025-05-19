import { Router } from 'express';
import { campaignController } from '../controllers/campaign.controller';

const router = Router();

// Campaign routes
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.post('/', campaignController.createCampaign);
router.get('/:id/bid-prediction', campaignController.getBidPrediction);
router.get('/:id/forecast', campaignController.getCampaignForecast);
router.get('/bulk-bid-predictions', campaignController.getBulkBidPredictions);

export default router;