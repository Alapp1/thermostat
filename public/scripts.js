// scripts.js
//const BASE_URL = window.location.origin;
  const BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : `${window.location.protocol}//${window.location.host}/api`;
// Login 
document.getElementById('loginButton').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('controlSection').style.display = 'block';
    } else {
      alert('Invalid credentials');
    }
  } catch (err) {
    console.error('Error logging in:', err);
    alert('An error occurred while logging in.');
  }
});

// Thermostat 
document.getElementById('coolBtn').addEventListener('click', () => {
  sendThermostatCommand('cool');
});
document.getElementById('offBtn').addEventListener('click', () => {
  sendThermostatCommand('off');
});

async function sendThermostatCommand(command) {
  try {
    const res = await fetch('/setThermostat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById('status').innerText = data.message;
    } else {
      document.getElementById('status').innerText = 'Failed to send command.';
    }
  } catch (err) {
    console.error('Error sending thermostat command:', err);
    document.getElementById('status').innerText = 'Error occurred.';
  }
}

