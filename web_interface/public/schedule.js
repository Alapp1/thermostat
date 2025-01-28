document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : `${window.location.protocol}//${window.location.host}/api`;

  // Fetch the schedule on page load
  async function fetchSchedule() {
    console.log('Fetching schedule...');
    const res = await fetch(`${BASE_URL}/schedule`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const schedule = await res.json();
    console.log('Schedule fetched: ', schedule);
    updateScheduleUI(schedule);
  }

  /**
   * Sorts the schedule entries by their `time` property (ascending),
   * then updates the UI with the sorted list.
   */
  function updateScheduleUI(schedule) {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = ''; // Clear existing list

    if (!Array.isArray(schedule) || schedule.length === 0) {
      const noScheduleMessage = document.createElement('li');
      noScheduleMessage.textContent = 'No schedule available.';
      scheduleList.appendChild(noScheduleMessage);
      return;
    }

    // Sort schedules by time (parse 'YYYY-MM-DD HH:mm' to Date)
    const sortedSchedule = schedule.slice().sort((a, b) => {
      // Replace space with 'T' so Date parsing is more standard: "YYYY-MM-DDTHH:mm"
      const dateA = new Date(a.time.replace(' ', 'T'));
      const dateB = new Date(b.time.replace(' ', 'T'));
      return dateA - dateB;
    });

    // Build each schedule item
    sortedSchedule.forEach((entry) => {
      const listItem = document.createElement('li');
      // Example display: "2025-01-22 13:30 - heat (Recurring)"
      listItem.textContent = `${entry.time} - ${entry.mode} (${
        entry.recurring ? 'Recurring' : 'One-Time'
      })`;

      // DELETE BUTTON
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', () => deleteSchedule(entry._id));

      // EDIT BUTTON
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', () => toggleEditForm(entry));

      listItem.appendChild(deleteButton);
      listItem.appendChild(editButton);
      scheduleList.appendChild(listItem);
    });
  }

  // Simple inline edit using prompt() for demonstration
  function toggleEditForm(scheduleEntry) {
    const newTime = prompt('Enter new time (HH:mm)', extractHHmm(scheduleEntry.time));
    if (!newTime) return;

    const newMode = prompt('Enter new mode ("cool", "heat", or "off")', scheduleEntry.mode);
    if (!newMode) return;

    const isRecurring = confirm(
      'Click OK if you want this to be a recurring (daily) schedule.\nCancel for one-time.'
    );

    updateSchedule(scheduleEntry._id, newTime, newMode, isRecurring);
  }

  // Extract "HH:mm" from "YYYY-MM-DD HH:mm"
  function extractHHmm(dateTimeStr) {
    // e.g. "2025-01-22 13:30" -> "13:30"
    return dateTimeStr.split(' ')[1]?.slice(0, 5) || '00:00';
  }

  // PUT /api/schedule/:id
  async function updateSchedule(id, time, mode, recurring) {
    try {
      const res = await fetch(`${BASE_URL}/schedule/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ time, mode, recurring }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert('Failed to update schedule: ' + (data.message || 'Unknown error'));
        return;
      }
      alert(data.message);
      fetchSchedule(); // Refresh list
    } catch (err) {
      console.error('Error updating schedule:', err);
      alert('Error occurred while updating schedule.');
    }
  }

  // DELETE /api/schedule/:id
  async function deleteSchedule(scheduleId) {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/schedule/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        alert('Schedule deleted successfully.');
        fetchSchedule();
      } else {
        alert('Failed to delete schedule');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Error occurred while deleting schedule.');
    }
  }

  // POST /api/schedule
  async function addSchedule() {
    const time = document.getElementById('scheduleTime').value;
    const mode = document.getElementById('scheduleMode').value;
    const recurring = document.getElementById('scheduleRecurring').checked;

    if (!time || !mode) {
      alert('Please select both time and mode before adding a schedule.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ time, mode, recurring }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message); // e.g. "Schedule added successfully"
        fetchSchedule(); // Refresh list
      } else {
        alert('Failed to add schedule: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error adding schedule:', err);
      alert('Error occurred while adding schedule.');
    }
  }

  // Attach button listeners
  document.getElementById('addScheduleButton').addEventListener('click', addSchedule);
  document.getElementById('backToControlButton').addEventListener('click', () => {
    window.location.href = '/control';
  });

  // Initial fetch
  fetchSchedule();
});
