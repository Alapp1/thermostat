import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    time: { type: Date, required: true },
    mode: { type: String, enum: ['cool', 'heat', 'off'], required: true },
    recurring: { type: Boolean, default: true }, // true => repeats daily, false => one-time
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Pending' }
  },
  {
    // This enables optimistic concurrency using the internal version key (__v).
    // Mongoose throws a VersionError if it detects conflicting concurrent updates.
    optimisticConcurrency: true
  }
);

export default mongoose.model('Schedule', scheduleSchema);
