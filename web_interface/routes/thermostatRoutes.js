import express from 'express';
import { setThermostat } from '../controllers/thermostatController.js';
import { authenticateToken } from './middleware/auth.js';
import { verifyCsrfToken } from './middleware/verifyCsrfToken.js';

const router = express.Router();

router.post('/setThermostat', authenticateToken, verifyCsrfToken, setThermostat);
//router.post('/setSchedule', addSchedule);


export default router;

