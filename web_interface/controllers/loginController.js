import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      console.error(`User not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ensure hashedPassword exists
    if (!user.hashedPassword) {
      console.error(`Missing hashed password for user: ${username}`);
      return res.status(500).json({ message: 'Server error: Missing password hash' });
    }

    // Compare the plain text password with the stored hash
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      console.error(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isTestUser: user.isTestUser },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // Short token lifespan for security
    );

    // Generate CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Set HTTP-only cookie for JWT
    res.cookie('jwt', token, {
      httpOnly: true, // Secure against XSS
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 30 * 60 * 1000, // Match token lifespan (30 minutes)
    });

    // Set a cookie for CSRF token
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false, // Accessible by front-end
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // Match token lifespan
    });

    // Respond with success (optional: include user info, but exclude sensitive data)
    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

