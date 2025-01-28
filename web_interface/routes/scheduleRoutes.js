import express from 'express';
import { authenticateToken, restrictTestUser } from './middleware/auth.js';
import scheduleController from '../controllers/scheduleController.js';

const router = express.Router();

/**
 * The test user cannot modify, so we wrap all POST/PUT/DELETE with restrictTestUser.
 * There is no harm in test users viewing our schedule, so we allow them to get
 */
router.get('/', authenticateToken, scheduleController.getSchedule);
router.post('/', authenticateToken, restrictTestUser, scheduleController.addSchedule);
router.put('/:id', authenticateToken, restrictTestUser, scheduleController.updateSchedule);
router.delete('/:id', authenticateToken, restrictTestUser, scheduleController.deleteSchedule);

export default router;
