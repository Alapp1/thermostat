import mongoose from 'mongoose';

const thermostatStateSchema = new mongoose.Schema({
  mode: { type: String, required: true }, // e.g., 'heat', 'cool', 'off'
  lastModified: { type: Date, default: Date.now }, // Timestamp of the last update
});

export default mongoose.model('ThermostatState', thermostatStateSchema);

