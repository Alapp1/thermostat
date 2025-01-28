import cron from 'node-cron';
import Schedule from '../models/Schedule.js';
import moment from 'moment-timezone';
import ThermostatState from '../models/ThermostatState.js';
import fetch from 'node-fetch';

/**
 * The ScheduleService encapsulates the database logic
 * for adding, retrieving, updating, and deleting schedules.
 */
class ScheduleService {
  async getSchedules() {
    try {
      const schedules = await Schedule.find().lean();

      if (!schedules || schedules.length === 0) {
        return [];
      }

      // Format the schedules for display
      return schedules.map((schedule) => {
        if (!schedule) return null;

        return {
          ...schedule,
          // Convert stored Date to an EST string "YYYY-MM-DD HH:mm"
          time: moment(schedule.time).tz('America/New_York').format('YYYY-MM-DD HH:mm'),
          status: schedule.status || 'Unknown'
        };
      }).filter(Boolean);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      throw err;
    }
  }

  async addSchedule(time, mode, recurring) {
    try {
      const scheduleTime = this.convertToNYTime(time);

      // Forbid duplicate schedule
      const existingSchedule = await Schedule.findOne({ time: scheduleTime, mode });
      if (existingSchedule) {
        throw new Error('A schedule already exists for this time and mode');
      }

      const newSchedule = await Schedule.create({
        time: scheduleTime,
        mode,
        recurring: !!recurring
      });
      return newSchedule;
    } catch (err) {
      console.error('Error adding schedule:', err);
      throw err;
    }
  }

  async updateSchedule(scheduleId, time, mode, recurring) {
    try {
      const scheduleTime = this.convertToNYTime(time);

      // Use a "findById -> set -> save" pattern to ensure we get version checking
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      schedule.time = scheduleTime;
      schedule.mode = mode;
      schedule.recurring = recurring;

      // If there's a concurrency conflict, Mongoose will throw a VersionError
      const updated = await schedule.save();
      return updated;
    } catch (err) {
      console.error('Error updating schedule:', err);
      throw err;
    }
  }

  async deleteSchedule(scheduleId) {
    try {
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      await Schedule.findByIdAndDelete(scheduleId);
    } catch (err) {
      console.error('Error deleting schedule:', err);
      throw err;
    }
  }

  /**
   * Converts a "HH:mm" string (from UI) into the current date in EST (moment-timezone).
   * For a recurring schedule, only hour and minute matter. For one-time, the actual date matters.
   */
  convertToNYTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const currentDate = new Date();
    return moment.tz(
      {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
        hour: hours,
        minute: minutes
      },
      'America/New_York'
    ).toDate();
  }
  /**
   * This function sets up a cron job that runs every minute (i.e., "0 * * * * *" would be every minute).
   * You can adjust the cron expression as needed.
   */
  startCronJob() {
    // ┌────────────── second (optional)
    // │ ┌──────────── minute
    // │ │ ┌────────── hour
    // │ │ │ ┌──────── day of month
    // │ │ │ │ ┌────── month
    // │ │ │ │ │ ┌──── day of week
    // │ │ │ │ │ │
    // * * * * * *
    cron.schedule('* * * * *', async () => {
      try {
        console.log('[Cron] Checking schedules...');

        // 1) Fetch all schedules from DB
        const schedules = await Schedule.find({});

        // 2) Current time in America/New_York
        const now = moment().tz('America/New_York');

        for (const schedule of schedules) {
          // Convert the schedule time to a moment in the same day
          const scheduleMoment = moment(schedule.time).tz('America/New_York');

          // Check if the schedule is "due"
          if (schedule.recurring) {
            // For a daily recurring, we check if hour and minute match exactly
            if (
              scheduleMoment.hour() === now.hour() &&
              scheduleMoment.minute() === now.minute()
            ) {
              await this.triggerSchedule(schedule);
            }
          } else {
            // For one-time schedules, compare the full date/time
            // If it's now or in the past but not triggered, then trigger
            if (
              scheduleMoment.isSameOrBefore(now) &&
              schedule.status !== 'Triggered'
            ) {
              await this.triggerSchedule(schedule);

              // Mark as triggered so we don't trigger it again
              schedule.status = 'Triggered';
              await schedule.save();
            }
          }
        }
      } catch (err) {
        console.error('[Cron] Error checking schedules:', err);
      }
    });
  }

  /**
   * Trigger schedule using same logic as setThermostat
   */
  async triggerSchedule(schedule) {
    try {
      console.log(`[Cron] Triggering schedule: ${schedule._id} => ${schedule.mode}`);

      // We replicate a simple fetch to the Adafruit feed 
      const AIO_USERNAME = process.env.AIO_USERNAME;
      const AIO_KEY = process.env.AIO_KEY;
      const FEED_KEY = 'thermostat';

      // Send the command to the thermostat
      const response = await fetch(
        `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': AIO_KEY,
          },
          body: JSON.stringify({ value: schedule.mode }),
        }
      );

      if (!response.ok) {
        console.error(`[Cron] Failed to send command for schedule ${schedule._id}`);
        return;
      }

      // update ThermostatState
      await ThermostatState.findOneAndUpdate(
        {},
        { mode: schedule.mode, lastModified: new Date() },
        { upsert: true, new: true }
      );

      console.log(`[Cron] Schedule ${schedule._id} triggered successfully.`);
    } catch (err) {
      console.error(`[Cron] Error triggering schedule ${schedule._id}:`, err);
    }
  }
}

export default new ScheduleService();
