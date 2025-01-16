import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import thermostatRoutes from './routes/thermostatRoutes.js';

dotenv.config();

// Needed for ES Modules 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

// Serve front-end static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes); 
app.use('/api', thermostatRoutes);

// Catch-all route for front-end
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


