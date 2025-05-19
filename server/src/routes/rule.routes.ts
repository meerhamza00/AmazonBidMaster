import { Router } from 'express';
import { ruleController } from '../controllers/rule.controller';

const router = Router();

// Rule routes
router.get('/', ruleController.getAllRules);
router.get('/:id', ruleController.getRuleById);
router.post('/', ruleController.createRule);
router.patch('/:id', ruleController.updateRule);
router.post('/validate', ruleController.validateRule);

export default router;