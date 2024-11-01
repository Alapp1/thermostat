import express from 'express';
import { setThermostat } from '../controllers/thermostatController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/setThermostat', checkAuth, setThermostat);

export default router;

