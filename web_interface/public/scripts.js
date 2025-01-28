document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/auth'
      : `${window.location.protocol}//${window.location.host}/api/auth`;

  // Login
  document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isTestUser', data.isTestUser);
        window.location.href = '/control';
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      alert('An error occurred while logging in.');
    }
  });
});
