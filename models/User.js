// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  // We'll store hashed passwords, not plain text
  hashedPassword: {
    type: String,
    required: true
  },
});

export default mongoose.model('User', userSchema);

