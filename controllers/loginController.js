import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user 
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

    // Compare the plain text password with the hash
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      console.error(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If the pws match login is successful
    console.log(`User logged in successfully: ${username}`);
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

