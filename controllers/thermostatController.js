// controllers/thermostatController.js
import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;
const FEED_KEY = 'thermostat';

export const setThermostat = async (req, res) => {
  const { command } = req.body; // e.g., "cool" or "off"
  if (!command) {
    return res.status(400).send('Command is required');
  }

  try {
    const response = await fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': AIO_KEY
      },
      body: JSON.stringify({ value: command })
    });

    if (response.ok) {
      res.status(200).json({message: `Command "${command}" sent successfully.`});
    } else {
      res.status(500).json({message: 'Failed to send command'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occurred'});
  }
};

