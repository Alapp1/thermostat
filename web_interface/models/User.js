// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  isTestUser: {
    type: Boolean,
    default: false
  },
});

export default mongoose.model('User', userSchema);

