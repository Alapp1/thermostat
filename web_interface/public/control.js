document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : `${window.location.protocol}//${window.location.host}/api`;

  // Thermostat Commands
  document.getElementById('coolBtn').addEventListener('click', () => {
    sendThermostatCommand('cool');
  });
  document.getElementById('heatBtn').addEventListener('click', () => {
    sendThermostatCommand('heat');
  });
  document.getElementById('offBtn').addEventListener('click', () => {
    sendThermostatCommand('off');
  });

  async function sendThermostatCommand(command) {
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrfToken='))
      ?.split('=')[1];

    if (!csrfToken) {
      alert('CSRF token missing. Please refresh the page or log in again.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/setThermostat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ command }),
      });

      const data = await res.json();
      if (res.ok) {
        document.getElementById('status').innerText = data.message;
      }
      else {
        document.getElementById('status').innerText = 'Failed to send command.';
      }
    } catch (err) {
      console.error('Error sending thermostat command:', err);
      document.getElementById('status').innerText = 'Error occurred.';
    }
  }

  // Change Schedule Button
  document.getElementById('scheduleBtn').addEventListener('click', () => {
    window.location.href = '/schedule';
  });

  // Logout Button
  document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isTestUser');
    window.location.href = '/';
  });
});

