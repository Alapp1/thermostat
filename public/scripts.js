document.getElementById('loginButton').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
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
});

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
    const text = await res.text();
    document.getElementById('status').innerText = text;
  } catch (err) {
    console.error('Error:', err);
  }
}

