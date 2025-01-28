import scheduleService from '../services/scheduleService.js';

class ScheduleController {
  // GET /api/schedule
  getSchedule = async (req, res) => {
    try {
      const schedules = await scheduleService.getSchedules();
      res.json(schedules);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      res.status(500).json({ message: 'Error fetching schedules' });
    }
  };

  // POST /api/schedule
  addSchedule = async (req, res) => {
    // "recurring" will be a boolean from the front-end (instead of "permanent")
    const { time, mode, recurring } = req.body;

    if (!this.validateScheduleInput(time, mode)) {
      return res.status(400).json({
        message: 'Invalid input. Time must be in HH:mm format and mode must be "cool", "heat", or "off"'
      });
    }

    try {
      const newSchedule = await scheduleService.addSchedule(time, mode, recurring);
      res.status(201).json({
        message: 'Schedule added successfully',
        schedule: newSchedule
      });
    } catch (err) {
      console.error('Error adding schedule:', err);
      res.status(500).json({ message: err.message || 'Error adding schedule' });
    }
  };

  // PUT /api/schedule/:id
  updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { time, mode, recurring } = req.body;

    if (!this.validateScheduleInput(time, mode)) {
      return res.status(400).json({
        message: 'Invalid input. Time must be in HH:mm format and mode must be "cool", "heat", or "off"'
      });
    }

    try {
      const updatedSchedule = await scheduleService.updateSchedule(id, time, mode, recurring);
      res.status(200).json({
        message: 'Schedule updated successfully',
        schedule: updatedSchedule
      });
    } catch (err) {
      console.error('Error updating schedule:', err);
      res.status(500).json({ message: err.message || 'Error updating schedule' });
    }
  };

  // DELETE /api/schedule/:id
  deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
      await scheduleService.deleteSchedule(id);
      res.status(204).end();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      res.status(500).json({ message: err.message || 'Error deleting schedule' });
    }
  };

  validateScheduleInput = (time, mode) => {
    // Matches "HH:mm" or "H:mm" with 0–23 hours, 0–59 minutes
    const timeRegex = /^([0-1]?\d|2[0-3]):[0-5]\d$/;
    const validModes = ['cool', 'heat', 'off'];

    return timeRegex.test(time) && validModes.includes(mode);
  };
}

export default new ScheduleController();
