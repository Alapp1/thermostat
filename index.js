import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import thermostatRoutes from './routes/thermostatRoutes.js';
import { addSchedule } from './controllers/schedulerController.js';

const app = express();
const PORT = process.env.PORT || 3000;

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

connectToMongoDB();

app.use(express.json());
app.use(session({
    secret: 'secure-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Serve static files
app.use(express.static(path.join(process.cwd(), '../')));

// Register routes
app.use(authRoutes);
app.use(thermostatRoutes);

// Register schedule route
app.post('/setSchedule', addSchedule);

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '../index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

