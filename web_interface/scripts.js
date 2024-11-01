// Login button click event
document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            // Hide login section and show control section if login is successful
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('controlSection').style.display = 'block';
        } else {
            // Show an alert for invalid credentials
            alert('Invalid credentials. Please try again.');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('An error occurred during login. Please check your network connection.');
    });
});

// Cool button click event
document.getElementById('coolButton').addEventListener('click', () => {
    sendCommand('cool');
});

// Off button click event
document.getElementById('offButton').addEventListener('click', () => {
    sendCommand('off');
});

// Function to send command to the server
function sendCommand(command) {
    fetch('/setThermostat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('status').innerText = `Status: Command "${command}" sent successfully.`;
        } else {
            throw new Error('Failed to send command');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('status').innerText = 'Status: Error sending command.';
    });
}

