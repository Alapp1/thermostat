// controllers/thermostatController.js
import ThermostatState from '../models/ThermostatState.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;
const FEED_KEY = 'thermostat';

export const setThermostat = async (req, res) => {
  try {
    const { command } = req.body; 
    const { isTestUser } = req.user;
    if (isTestUser) {
      return res.status(200).json({ message: `Simulated: Thermostat switched to ${command}` });
    }

    const response = await fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': AIO_KEY
      },
      body: JSON.stringify({ value: command })
    });
  if (!response.ok) {
      return res.status(500).json({ message: 'Failed to send command to thermostat.' });
    }

    // Update thermostat state in the database
    const updatedState = await ThermostatState.findOneAndUpdate(
      {}, // Match any document (assuming one thermostat)
      { mode: command, lastModified: new Date() }, // Update mode and timestamp
      { upsert: true, new: true } // Create a new document if it doesn't exist
    );

    res.status(200).json({
      message: `Command "${command}" sent successfully.`,
      thermostatState: updatedState
    });
     } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occurred'});
  }
};

