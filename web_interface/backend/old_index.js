import mongoose from 'mongoose';
import fetch from 'node-fetch';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables for Adafruit IO credentials
const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;
const FEED_KEY = 'thermostat';

// Load MongoDB environment vars
const dbUri = process.env.MONGODB_URI;

async function connectToMongoDB() {
    try {
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

connectToMongoDB();

// Middleware and routes setup
app.use(express.json());
app.use(session({
    secret: 'secure-session-secret', 
    resave: false,
    saveUninitialized: true
}));

// Serve static files (CSS, JS, etc) from the web_interface directory
app.use(express.static(path.join(process.cwd(), '../')));

// Route to serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '../index.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken');
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while registering');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Set session data
        req.session.loggedIn = true;
        req.session.username = username;

        res.status(200).send('Login successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while logging in');
    }
});

// Middleware to protect routes
function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

// Control thermostat endpoint (protected)
app.post('/setThermostat', checkAuth, async (req, res) => {
    const command = req.body.command; // "cool" or "off"
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
            res.status(200).send(`Command "${command}" sent successfully.`);
        } else {
            res.status(500).send('Failed to send command');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

