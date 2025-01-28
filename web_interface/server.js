import moment from 'moment-timezone';
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import scheduleService from './services/scheduleService.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import thermostatRoutes from './routes/thermostatRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';

// Import Middleware
import { authenticateToken, restrictTestUser } from './routes/middleware/auth.js';

// Import Controllers
import { setThermostat } from './controllers/thermostatController.js';

// Load environment variables
dotenv.config();

// Needed for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);          // Authentication routes
app.use('/api/thermostat', thermostatRoutes); // Thermostat-specific routes

// All schedule routes under /api/schedule
app.use('/api/schedule', scheduleRoutes);

// Direct route for setting the thermostat
app.post('/api/setThermostat', authenticateToken, restrictTestUser, setThermostat);

// Serve Control and Schedule Pages
app.get('/control', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control.html'));
});

app.get('/schedule', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'schedule.html'));
});

// Catch-all route for front-end
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the cron job to check for scheduled commands
scheduleService.startCronJob();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
