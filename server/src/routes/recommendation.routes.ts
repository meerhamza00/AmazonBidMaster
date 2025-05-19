import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller';

const router = Router();

// Recommendation routes
router.get('/', recommendationController.getAllRecommendations);
router.post('/', recommendationController.createRecommendation);

export default router;