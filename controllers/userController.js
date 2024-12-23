// controllers/userController.js
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2) Compare the plain text password with the stored hash
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3) If match, login is successful
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

