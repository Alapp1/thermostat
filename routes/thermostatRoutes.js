// TODO: UPDATE FILE AND DEPENDANT FILES 

import express from 'express';
import { setThermostat } from '../controllers/thermostatController.js';

const router = express.Router();


//router.post('/setSchedule', addSchedule);

router.post('/setThermostat', setThermostat);

export default router;

